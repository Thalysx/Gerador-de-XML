# Change: QA Portuário Generators

## Motivation
Build specialized synthetic generators for port/logistics QA.

## Scope
People, companies, vehicles, containers, cargo, documents and NCM.

The port catalog includes CT-e and its access key. NF-e remains exclusively in General Generators, following the product environment boundary established before this change.

## Out of Scope
Complete cross-step scenarios.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
