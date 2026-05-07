# SAKURA Exhibition NENE2 Field Trial

**Public** field-trial sandbox that demonstrates adapting [NENE2](https://github.com/hideyukiMORI/NENE2) `v0.1.1` into a small **SAKURA Exhibition–style** public-contest API shape: fixed fixture data, documented JSON APIs, OpenAPI, tests, and local MCP tools.

## Public notice (read before use)

- **Not affiliated** with any real exhibition, contest organiser, or trademark holder. **“SAKURA Exhibition–style”** means *inspired-by public listing/detail concepts* for learning and API design only.
- **Fictional / sandbox data** only. Names, years, and work ids are **not** real participant or production records.
- **No endorsement** implied. Third-party names and references in docs or fixtures are for domain illustration unless explicitly stated otherwise.
- **Purpose:** evidence that NENE2’s workflow (scaffold, OpenAPI, tests, MCP boundary) works **outside** the framework repository. This is **not** a production product offering.

For security expectations and how to report issues, see [`SECURITY.md`](SECURITY.md).

## Purpose

The goal is to create evidence that NENE2 works beyond its framework repository:

- adapt NENE2 into a small client-style API project
- add read-only contest-style endpoints through the documented scaffold workflow
- expose behaviour through OpenAPI
- map safe read-only operations into MCP metadata where useful
- record an LLM/MCP tool call and request id in a field-trial report

## Safety Boundaries

This sandbox must not touch production systems.

- Do not connect to any live exhibition or contest production database.
- Do not use admin pages, member-only pages, or real participant private data.
- Do not commit API keys, passwords, local `.env` files, screenshots with secrets, or production URLs.
- Use public-page concepts and small fixed fixtures only.

Reference public pages may inform naming and shape, but this repository stays **self-contained and reviewable**.

## First Trial Target

Start with one read-only endpoint:

```text
GET /exhibitions/2026/artists
```

Expected first behaviour:

- return a small list of display names from **fixed fixture data**
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
- Field-trial artist list by year: `http://localhost:8080/exhibitions/2025/artists`
- Field-trial work list by year: `http://localhost:8080/exhibitions/2026/works`
- Field-trial work detail by year and id: `http://localhost:8080/exhibitions/2026/works/20260101`
- OpenAPI: `http://localhost:8080/openapi.php`
- Swagger UI: `http://localhost:8080/docs/`

Start the browser demo with the local Vite proxy:

```bash
npm run dev --prefix frontend
```

The cinematic field-trial demo is served at `http://localhost:5173/` and reads the Docker API through `/api`.
If that port is already in use, run `npm run dev --prefix frontend -- --port 5174`.

## NENE2 Base

Initial base:

- Source project: [`hideyukiMORI/NENE2`](https://github.com/hideyukiMORI/NENE2)
- Base tag: `v0.1.1`
- Base commit: `8f64707dc6c60fe99cef6cfe5f6dae7dac57e7a5`

Keep framework-level improvements in the NENE2 repository. Keep exhibition-style **demo** domain work in this sandbox.

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

## Before flipping the repo to Public on GitHub

Suggested maintainer checklist:

- Confirm **no** committed `.env` or real keys (`git log --all -S 'NENE2_MACHINE_API_KEY=' -- '*.env*'` and similar if ever in doubt).
- Enable **Private vulnerability reporting** (Settings → Security) if you want `SECURITY.md` path 1 to apply.
- Review **branch protection** and **Dependabot** alerts periodically.

## License

This sandbox inherits the MIT-licensed NENE2 foundation. Third-party marks, public page references, and any real-world names used only for illustration remain owned by their respective rights holders; **no association with this demo is implied**.
