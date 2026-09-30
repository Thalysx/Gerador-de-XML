# Proposal

## Why

Five canonical OpenSpec capabilities predate the current validator format and fail strict validation because they lack a `Purpose` section and structured requirement scenarios. Normalizing them restores a trustworthy all-spec validation baseline without changing product behavior.

## What Changes

- Add concise purpose statements to `app-shell`, `export-accessibility`, `history-favorites`, `port-qa` and `test-scenarios`.
- Convert their existing behavioral statements into named `### Requirement:` blocks.
- Add at least one representative `#### Scenario:` with `WHEN`/`THEN` assertions to every requirement while preserving the current meaning.
- Run strict validation across all canonical specs and confirm no product code or runtime behavior changed.
- Non-goals: no new functionality, no altered acceptance criteria, no implementation edits and no work from later FUTURE G phases.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is a documentation-format migration only; `.openspec.yaml` declares `skip_specs: true` because no requirement semantics change and delta specs would falsely represent behavioral changes.

## Impact

Only five files under `openspec/specs/` are affected. The main risk is accidentally narrowing or broadening an existing requirement during restructuring; implementation must preserve every normative statement and verify the result with `openspec validate --all --strict`.
