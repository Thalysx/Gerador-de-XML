# Change: Generator Architecture

## Why
Create the modular foundation that future generators and navigation consume.

## What Changes
Central generator registry; routes/categories; reusable components; general/port separation.

## Capabilities
- `generator-registry`: extend the existing registry contract with environment, route, discovery and capability metadata, plus environment-aware projections.
- `navigation`: make the existing shell navigation and discovery surfaces consume the active environment without a full-page reload.

## Out of Scope
New domain generators.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
