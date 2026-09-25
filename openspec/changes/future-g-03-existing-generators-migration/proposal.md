# Change: Existing Generators Migration

## Motivation
Move current functionality into the FUTURE G architecture with no behavioral regression.

## Scope
Existing generators, XML, AI and batch entry points.

## Out of Scope
Feature expansion.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
