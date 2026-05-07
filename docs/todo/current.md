# Current TODO

Purpose: keep the field-trial work visible across chats, agents, and local sessions.

## Status

- Current milestone: first private SAKURA Exhibition-style field trial
- Current GitHub Issue: none
- Current branch: `main`
- Base: NENE2 `v0.1.1`

## Completed

- [x] Create private field-trial repository. `#1`
- [x] Import NENE2 `v0.1.1` as the starting foundation. `#1`
- [x] Add field-trial README and safety boundaries. `#1`
- [x] Add fixed fixture data for a public exhibition artist list. `#8`
- [x] Implement `GET /exhibitions/2026/artists`. `#8`
- [x] Add OpenAPI contract coverage for the exhibition endpoint. `#8`
- [x] Add local MCP-facing read-only evidence for the endpoint. `#12`
- [x] Write the first field-trial report with command output, request id, and follow-up notes. `#12`
- [x] Add year-parameter artist list endpoint. `#16`
- [x] Add a first public work list endpoint for one exhibition year. `#20`

## Next Candidates

- [ ] Add local MCP-facing read-only evidence for the work list endpoint.

## Operating Notes

- Keep trial data self-contained and fictionalized when needed.
- Do not use production credentials, admin pages, private member data, or live database access.
- Keep framework improvements in the upstream NENE2 repository unless the change only makes sense for this sandbox.
