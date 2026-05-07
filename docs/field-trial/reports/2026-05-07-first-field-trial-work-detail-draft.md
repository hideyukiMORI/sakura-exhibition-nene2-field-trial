# Field trial report

Filled draft aligned with NENE2’s generic skeleton (`docs/templates/field-trial-report.md` in `hideyukiMORI/NENE2`). This file stays **abbreviated**. Do **not** add secrets, raw API keys, production URLs, or confidential prompts.

Older MCP-focused artefacts for list endpoints live alongside this directory (`2026-05-07-exhibition-*-mcp.md`).

## Trial context

| Item | Notes |
| Sandbox or repository name (if safe to name) | `hideyukiMORI/sakura-exhibition-nene2-field-trial` (SAKURA Exhibition-style sandbox). |
| NENE2 version or tag | `v0.1.1` (see root `README.md` “NENE2 Base” / commit `8f64707dc6c60fe99cef6cfe5f6dae7dac57e7a5`). |
| Read-only endpoint(s) added or exercised | `GET /exhibitions/{year}/works/{workId}` (sandbox work **detail**, fixture-backed). Supporting context: parameterized year routes for artists/works lists already existed. |
| OpenAPI `operationId`(s) involved | `getExhibitionWorkByYearAndId` (detail). Earlier trial notes used `getExhibition2026Artists`, `getExhibition2026Works`, etc. |

## MCP and API boundary

| Item | Notes |
| MCP tool name(s) called | Local catalog still exposes **`getFrameworkSmoke`**, **`getHealth`**, **`getExhibition2026Artists`**, **`getExhibition2026Works`** (`docs/mcp/tools.json`). There is **no** generated MCP wrapper yet for the new **parameterized detail** route; parity is a deliberate follow-up. Prior reports document **`getExhibition2026Works`** / **`getExhibition2026Artists`** smoke. Separately, **GitHub MCP** (Cursor-hosted) was used to open/merge pull requests once the PAT had **`repo`**-class access. |
| `X-Request-Id` or equivalent from the API (if present) | Example captured by driving the shipped runtime in Docker (same stack as PHPUnit): **`f4b8d2a3298ad7762a9a84ff4656e97f`** for `GET /exhibitions/2026/works/20260101`. Re-run captures a new id. |
| Command, UI action, or high-level client step you record | LLM/agent implemented catalog lookup (`ExhibitionWorkCatalog::workForYearAndId`), `RuntimeApplicationFactory` route wiring, OpenAPI additions, PHPUnit (`HttpRuntimeTest`, generated `RuntimeContractTest` row). Human reviewed PR **`#41`**, squash-merged after CI. |

## Commands run

```text
docker compose run --rm app composer check

# Optional narrow slice while iterating (from docs/development/endpoint-scaffold.md):

docker compose run --rm app vendor/bin/phpunit tests/HttpRuntimeTest.php tests/OpenApi/RuntimeContractTest.php

# Example: capture runtime status + request id without starting long-lived HTTP daemon:

docker compose run --rm app php -r 'require "vendor/autoload.php";
use Nyholm\Psr7\Factory\Psr17Factory;
use Nene2\Http\RuntimeApplicationFactory;
$f = new Psr17Factory();
$app = (new RuntimeApplicationFactory($f, $f))->create();
$r = $f->createServerRequest("GET", "https://example.test/exhibitions/2026/works/20260101");
$s = $app->handle($r);
echo $s->getStatusCode(), "\n", $s->getHeaderLine("X-Request-Id"), "\n";'
```

## Outcomes

What worked well:

- OpenAPI-example-driven **`RuntimeContractTest`** picked up the new path automatically once `examples.ok` existed; fewer bespoke assertions needed.
- **404 problem+json** path stayed consistent with other routes via `ProblemDetailsResponseFactory`.

What the LLM inferred easily:

- Mirroring **`worksForYear`** output shape inside a keyed **`work`** object for detail responses once types were enumerated in PHP.

What docs or boundaries were unclear:

- Cursor **GitHub MCP** initially returned `403` until the PAT scopes / resource access matched private-repo PR operations (**not solved by `gh auth` alone**).
- When to add MCP catalog entries vs. shipping HTTP/OpenAPI/tests first (trial kept HTTP contract as source of truth; MCP list tools lag parameterized operations).

## Follow-up Issues

- GitHub **`#38`** — closed via PR **`#41`** (sandbox work detail endpoint + contract tests).
- **Suggested next sandbox issue (not filed automatically):** add a **read-only MCP tool** mapped to **`getExhibitionWorkByYearAndId`** (path parameters `{year}`, `{workId}`) mirroring **`docs/mcp/tools.json`** + `composer mcp`.

## Reminder (do not fill)

Confirm this report omits client secrets, raw keys, production endpoints, and confidential business-only prompts.
