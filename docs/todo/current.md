# Current TODO

Purpose: keep the field-trial work visible across chats, agents, and local sessions.

## Status

- Current milestone: first private SAKURA Exhibition-style field trial
- Current GitHub Issue: `#1`
- Current branch: `main`
- Base: NENE2 `v0.1.1`

## Completed

- [x] Create private field-trial repository. `#1`
- [x] Import NENE2 `v0.1.1` as the starting foundation. `#1`
- [x] Add field-trial README and safety boundaries. `#1`

## Next Candidates

- [ ] Add fixed fixture data for a public exhibition artist list.
- [ ] Implement `GET /exhibitions/2026/artists`.
- [ ] Add OpenAPI contract coverage for the exhibition endpoint.
- [ ] Add local MCP-facing read-only evidence for the endpoint.
- [ ] Write the first field-trial report with command output, request id, and follow-up notes.

## Operating Notes

- Keep trial data self-contained and fictionalized when needed.
- Do not use production credentials, admin pages, private member data, or live database access.
- Keep framework improvements in the upstream NENE2 repository unless the change only makes sense for this sandbox.
