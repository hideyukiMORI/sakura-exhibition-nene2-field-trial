# Field Trial Plan

This private repository proves whether NENE2 can be adapted into a small client-style API project with useful LLM/MCP evidence.

## Domain

Use a SAKURA Exhibition-style public contest domain:

- exhibition year
- artist display name
- work title or category when useful
- public listing and detail concepts

The first trial should use fixed sandbox data. Public websites can be used as reference material for naming and shape, but trial records should not depend on scraping or private systems.

## Success Criteria

- A new endpoint is implemented through the NENE2 endpoint scaffold workflow.
- The endpoint behavior is covered by automated tests.
- The OpenAPI contract describes the endpoint response.
- A local MCP or machine-client smoke record proves the API can be called from an AI/tooling boundary.
- A short field-trial report records what worked, what was awkward, and what should become a NENE2 follow-up issue.

## First Endpoint Candidate

```text
GET /exhibitions/2026/artists
GET /exhibitions/{year}/artists
GET /exhibitions/{year}/works
```

Suggested first response fields:

- `artistId`
- `displayName.en`
- `displayName.jp`
- `countryOrRegion`
- `workCount`

Suggested first work response fields:

- `workId`
- `artistId`
- `artistDisplayName.en`
- `artistDisplayName.jp`
- `title.en`
- `title.jp`
- `workNumber`

Keep the data small, static, and non-sensitive until the endpoint shape is proven.

## Next Endpoint Candidates

- `GET /exhibitions/{year}/works/{workId}` — public work **detail** for a single fixture work (see Issue `#38`).

## Report Template

Create reports under `docs/field-trial/reports/` with:

- date
- Issue and PR links
- endpoint added
- checks run
- OpenAPI diff summary
- MCP or machine-client command used
- request id if available
- observations
- follow-up candidates for NENE2

Optional cross-check: NENE2 publishes a short generic skeleton at `docs/templates/field-trial-report.md` (**`hideyukiMORI/NENE2`**). Example filled draft for work detail: `docs/field-trial/reports/2026-05-07-first-field-trial-work-detail-draft.md`.

## Non-Goals

- Production integration
- Member-site integration
- Admin features
- Authentication beyond the existing machine-client boundary
- Broad redesign of NENE2 internals
