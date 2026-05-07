# SAKURA Exhibition NENE2 Field Trial

Private field-trial sandbox for proving NENE2 `v0.1.1` in a SAKURA Exhibition-style public contest domain.

This repository starts from NENE2 and keeps the first trial deliberately small: use public contest-page concepts, fixed sandbox data, documented JSON APIs, OpenAPI, tests, and local MCP tool calls.

## Purpose

The goal is to create evidence that NENE2 works beyond its framework repository:

- adapt NENE2 into a small client-style API project
- add a read-only contest endpoint through the documented scaffold workflow
- expose the endpoint through OpenAPI
- optionally map safe read-only behavior into MCP metadata
- record an LLM/MCP tool call and request id in a field-trial report

## Safety Boundaries

This sandbox must not touch production systems.

- Do not connect to the live SAKURA Exhibition database.
- Do not use admin pages, member-only pages, or private participant data.
- Do not commit API keys, passwords, local `.env` files, screenshots with secrets, or production URLs.
- Use public-page concepts and small fixed fixtures only.

Reference public pages can inform the domain shape, but the sandbox should stay self-contained and reviewable.

## First Trial Target

Start with one read-only endpoint:

```text
GET /exhibitions/2026/artists
```

Expected first behavior:

- return a small list of public artist display names from fixed fixture data
- document the response in `docs/openapi/openapi.yaml`
- add runtime and OpenAPI contract coverage
- record a field-trial report after a local MCP call

## Quick Start

Build the PHP runtime and run the standard checks:

```bash
docker compose build
docker compose run --rm app composer install
docker compose run --rm app composer check
```

Start the local app:

```bash
docker compose up -d app
```

Useful local URLs:

- API health: `http://localhost:8080/health`
- Example endpoint from NENE2: `http://localhost:8080/examples/ping`
- Field-trial artist list: `http://localhost:8080/exhibitions/2026/artists`
- OpenAPI: `http://localhost:8080/openapi.php`
- Swagger UI: `http://localhost:8080/docs/`

## NENE2 Base

Initial base:

- Source project: `hideyukiMORI/NENE2`
- Base tag: `v0.1.1`
- Base commit: `8f64707dc6c60fe99cef6cfe5f6dae7dac57e7a5`

Keep framework-level improvements in the NENE2 repository. Keep SAKURA Exhibition-style domain work in this sandbox.

## Project Docs

- Field-trial plan: `docs/field-trial/plan.md`
- Current TODO: `docs/todo/current.md`
- NENE2 client project start guide: `docs/development/client-project-start.md`
- Endpoint scaffold workflow: `docs/development/endpoint-scaffold.md`
- Local MCP client configuration: `docs/integrations/local-mcp-client-configuration.md`
- Machine-client smoke workflow: `docs/development/machine-client-smoke.md`

## Workflow

Use GitHub Issues for work:

1. Create or reuse a focused Issue.
2. Use a branch named like `docs/1-initial-field-trial-setup` or `feat/2-exhibition-artists-api`.
3. Keep PHP code, OpenAPI, tests, and docs aligned.
4. Run the narrowest useful checks, then `composer check`.
5. Push, open a PR, merge after checks, and return local `main` to a clean state.

## License

This sandbox inherits the MIT-licensed NENE2 foundation. Public page references remain owned by their respective rights holders.
