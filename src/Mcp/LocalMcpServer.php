<?php

declare(strict_types=1);

namespace Nene2\Mcp;

/**
 * @phpstan-import-type McpTool from LocalMcpToolCatalog
 */
final readonly class LocalMcpServer
{
    public function __construct(
        private LocalMcpToolCatalog $catalog,
        private LocalMcpHttpClientInterface $httpClient,
        private string $apiBaseUrl,
    ) {
    }

    /**
     * @param array<string, mixed> $message
     * @return array<string, mixed>|null
     */
    public function handle(array $message): ?array
    {
        $method = $message['method'] ?? null;
        $id = $message['id'] ?? null;

        if (!is_string($method)) {
            return $this->error($id, -32600, 'JSON-RPC request must include a method.');
        }

        if (!array_key_exists('id', $message)) {
            return null;
        }

        try {
            return match ($method) {
                'initialize' => $this->success($id, $this->initializeResult()),
                'tools/list' => $this->success($id, $this->toolsListResult()),
                'tools/call' => $this->success($id, $this->toolsCallResult($message['params'] ?? null)),
                default => $this->error($id, -32601, sprintf('Method "%s" is not supported.', $method)),
            };
        } catch (LocalMcpException $exception) {
            return $this->error($id, -32603, $exception->getMessage());
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function initializeResult(): array
    {
        return [
            'protocolVersion' => '2024-11-05',
            'capabilities' => [
                'tools' => [
                    'listChanged' => false,
                ],
            ],
            'serverInfo' => [
                'name' => 'nene2-local-mcp',
                'version' => '0.1.0',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toolsListResult(): array
    {
        return [
            'tools' => array_map(
                fn (array $tool): array => [
                    'name' => $tool['name'],
                    'title' => $tool['title'],
                    'description' => $tool['description'],
                    'inputSchema' => $this->mcpInputSchema($tool['inputSchema']),
                    'annotations' => [
                        'readOnlyHint' => $tool['safety'] === 'read',
                    ],
                ],
                $this->catalog->tools(),
            ),
        ];
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    private function mcpInputSchema(array $schema): array
    {
        if (($schema['properties'] ?? null) === []) {
            $schema['properties'] = new \stdClass();
        }

        return $schema;
    }

    /**
     * @param mixed $params
     * @return array<string, mixed>
     */
    private function toolsCallResult(mixed $params): array
    {
        if (!is_array($params)) {
            throw new LocalMcpException('tools/call params must be an object.');
        }

        $name = $params['name'] ?? null;
        $arguments = $params['arguments'] ?? [];

        if (!is_string($name) || $name === '') {
            throw new LocalMcpException('tools/call params.name must be a non-empty string.');
        }

        if (!is_array($arguments)) {
            throw new LocalMcpException('tools/call params.arguments must be an object when provided.');
        }

        $tool = $this->catalog->find($name);

        if ($tool === null) {
            throw new LocalMcpException(sprintf('MCP tool "%s" was not found.', $name));
        }

        if ($tool['safety'] !== 'read') {
            throw new LocalMcpException(sprintf('MCP tool "%s" is not read-only.', $name));
        }

        if ($tool['source']['type'] !== 'openapi' || $tool['source']['method'] !== 'GET') {
            throw new LocalMcpException(sprintf('MCP tool "%s" does not map to a local GET API operation.', $name));
        }

        $expandedPath = $this->expandToolPath($tool, $arguments);

        return $this->httpToolResult($expandedPath, $tool);
    }

    /**
     * @param array<string, mixed> $tool
     * @param array<string, mixed> $arguments
     */
    private function expandToolPath(array $tool, array $arguments): string
    {
        $path = $tool['source']['path'];
        $names = $this->pathParameterNames($path);

        if ($names === []) {
            if ($arguments !== []) {
                throw new LocalMcpException(sprintf('MCP tool "%s" does not accept arguments.', $tool['name']));
            }

            return $path;
        }

        foreach ($names as $name) {
            if (!array_key_exists($name, $arguments)) {
                throw new LocalMcpException(
                    sprintf(
                        'MCP tool "%s" requires integer path parameters: %s.',
                        $tool['name'],
                        implode(', ', $names),
                    ),
                );
            }

            if (!is_int($arguments[$name])) {
                throw new LocalMcpException(
                    sprintf(
                        'MCP tool "%s" path parameter "%s" must be an integer.',
                        $tool['name'],
                        $name,
                    ),
                );
            }
        }

        $extra = array_diff(array_keys($arguments), $names);

        if ($extra !== []) {
            throw new LocalMcpException(
                sprintf(
                    'MCP tool "%s" received unexpected arguments: %s.',
                    $tool['name'],
                    implode(', ', $extra),
                ),
            );
        }

        return $this->substitutePathPlaceholders($path, $arguments);
    }

    /**
     * @return list<string>
     */
    private function pathParameterNames(string $path): array
    {
        if (preg_match_all('/\{([a-zA-Z0-9_]+)\}/', $path, $matches) === false) {
            throw new LocalMcpException(sprintf('MCP catalog path "%s" could not be parsed for parameters.', $path));
        }

        /** @var list<non-empty-string> $names */
        $names = $matches[1];

        if ($names === []) {
            return [];
        }

        return $names;
    }

    /**
     * @param array<string, mixed> $arguments
     */
    private function substitutePathPlaceholders(string $path, array $arguments): string
    {
        return (string) preg_replace_callback(
            '/\{([a-zA-Z0-9_]+)\}/',
            static function (array $match) use ($arguments, $path): string {
                $key = $match[1];

                if (!array_key_exists($key, $arguments) || !is_int($arguments[$key])) {
                    throw new LocalMcpException(sprintf('MCP path "%s" is missing a value for "{%s}".', $path, $key));
                }

                return (string) $arguments[$key];
            },
            $path,
        );
    }

    /**
     * @param McpTool $tool
     * @return array<string, mixed>
     */
    private function httpToolResult(string $requestPath, array $tool): array
    {
        $response = $this->httpClient->get($this->apiBaseUrl, $requestPath);
        $body = $this->decodeBody($response->body);

        $structuredContent = [
            'tool' => $tool['name'],
            'operationId' => $tool['source']['operationId'],
            'statusCode' => $response->statusCode,
            'requestId' => $response->requestId(),
            'body' => $body,
        ];

        return [
            'content' => [
                [
                    'type' => 'text',
                    'text' => json_encode($structuredContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
                ],
            ],
            'structuredContent' => $structuredContent,
            'isError' => !$response->isSuccessful(),
        ];
    }

    private function decodeBody(string $body): mixed
    {
        try {
            return json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return $body;
        }
    }

    /**
     * @param mixed $id
     * @param array<string, mixed> $result
     * @return array<string, mixed>
     */
    private function success(mixed $id, array $result): array
    {
        return [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => $result,
        ];
    }

    /**
     * @param mixed $id
     * @return array<string, mixed>
     */
    private function error(mixed $id, int $code, string $message): array
    {
        return [
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => [
                'code' => $code,
                'message' => $message,
            ],
        ];
    }
}
