# 2026-05-07 Exhibition Works MCP Field Trial

## Summary

- Issue: `#34`
- Endpoint: `GET /exhibitions/2026/works`
- MCP tool: `getExhibition2026Works`
- Result: success

This report records local MCP-facing evidence for the sandbox exhibition **work list** alongside the existing 2026 artist tool.

## Checks Run

```bash
docker compose run --rm app vendor/bin/phpunit tests/Mcp/LocalMcpServerTest.php tests/Mcp/LocalMcpToolCatalogTest.php
docker compose run --rm app composer mcp
```

Result:

- PHPUnit (MCP tests only): OK
- MCP tool catalog: valid

## MCP Smoke Command

The smoke run starts a local API container and pipes JSON-RPC lines into the stdio MCP server from a second container:

```bash
docker rm -f sakura-field-trial-api >/dev/null 2>&1 || true
docker compose run --rm -d --name sakura-field-trial-api app
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"getExhibition2026Works","arguments":{}}}' \
  | docker compose run --rm -e NENE2_LOCAL_API_BASE_URL=http://sakura-field-trial-api app php tools/local-mcp-server.php
docker rm -f sakura-field-trial-api >/dev/null 2>&1 || true
```

Note: Run with a disposable API container name if `sakura-field-trial-api` is already in use.

## MCP Result

Example `structuredContent` from `tools/call`:

```json
{
  "tool": "getExhibition2026Works",
  "operationId": "getExhibition2026Works",
  "statusCode": 200,
  "requestId": "db001adb85e542e960612b351cda2e30",
  "body": {
    "exhibitionYear": 2026,
    "works": [
      {
        "workId": 20260101,
        "artistId": 1,
        "artistDisplayName": {
          "en": "Yoshimi Ohtani",
          "jp": "オオタニヨシミ"
        },
        "title": {
          "en": "Spring Light",
          "jp": "春の光"
        },
        "workNumber": 1
      },
      {
        "workId": 20260201,
        "artistId": 2,
        "artistDisplayName": {
          "en": "Hideyuki Mori",
          "jp": "彩"
        },
        "title": {
          "en": "Color Field",
          "jp": "彩の場"
        },
        "workNumber": 1
      }
    ]
  }
}
```

## Follow-Up

- Optional: MCP tool parameterized by `year` when the MCP host supports safe path-parameter arguments for read-only catalogue calls.
