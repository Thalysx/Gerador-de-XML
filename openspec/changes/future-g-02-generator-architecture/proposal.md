# Change: Generator Architecture

## Motivation
Create the modular foundation that future generators and navigation consume.

## Scope
Central generator registry; routes/categories; reusable components; general/port separation.

## Out of Scope
New domain generators.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
