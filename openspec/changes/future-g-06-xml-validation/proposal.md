# Change: Advanced XML Validation

## Motivation
Evolve XML tooling into a detailed QA-oriented validator and negative-test generator.

## Scope
Detailed validation; severity; error location; summary; negative XML; export.

## Out of Scope
Unrelated port scenarios.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
