# 2026-05-07 Exhibition Artists MCP Field Trial

## Summary

- Issue: `#12`
- Endpoint: `GET /exhibitions/2026/artists`
- MCP tool: `getExhibition2026Artists`
- Result: success

This report records the first local MCP-facing evidence for the SAKURA Exhibition-style field-trial endpoint.

## Checks Run

```bash
docker compose run --rm app vendor/bin/phpunit tests/Mcp/LocalMcpServerTest.php tests/Mcp/LocalMcpToolCatalogTest.php
docker compose run --rm app composer mcp
```

Result:

- PHPUnit: `OK (7 tests, 31 assertions)`
- MCP tool catalog: valid

## MCP Smoke Command

The smoke run started a local API container and called the stdio MCP server from a second container:

```bash
docker rm -f sakura-field-trial-api >/dev/null 2>&1 || true
docker compose run --rm -d --name sakura-field-trial-api app
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"getExhibition2026Artists","arguments":{}}}' \
  | docker compose run --rm -e NENE2_LOCAL_API_BASE_URL=http://sakura-field-trial-api app php tools/local-mcp-server.php
docker rm -f sakura-field-trial-api >/dev/null 2>&1 || true
```

## MCP Result

The `tools/list` response exposed the new read-only tool:

```json
{
  "name": "getExhibition2026Artists",
  "title": "2026 Exhibition Artists",
  "annotations": {
    "readOnlyHint": true
  }
}
```

The `tools/call` response returned:

```json
{
  "tool": "getExhibition2026Artists",
  "operationId": "getExhibition2026Artists",
  "statusCode": 200,
  "requestId": "8c8cbc0c790f4862947e87a1cb5789bb",
  "body": {
    "exhibitionYear": 2026,
    "artists": [
      {
        "artistId": 1,
        "displayName": {
          "en": "Yoshimi Ohtani",
          "jp": "オオタニヨシミ"
        },
        "countryOrRegion": "Japan",
        "workCount": 1
      },
      {
        "artistId": 2,
        "displayName": {
          "en": "Hideyuki Mori",
          "jp": "彩"
        },
        "countryOrRegion": "Japan",
        "workCount": 1
      }
    ]
  }
}
```

## Observations

- The endpoint can be exposed through MCP without bypassing the documented HTTP/OpenAPI boundary.
- `requestId` is visible in the MCP structured content, which is useful for correlating AI/tooling activity with HTTP logs.
- The current local MCP tool model works well for no-argument read-only endpoints.
- The field-trial data shape should stay fixture-based until a real integration need appears.

## Follow-Up Candidates

- Add a parameterized endpoint only after the current no-argument tool shape is proven, for example `GET /exhibitions/{year}/artists`.
- Record a separate report when adding work or profile image endpoints.
- Consider whether NENE2 should document a reusable MCP smoke command template after one more endpoint.
