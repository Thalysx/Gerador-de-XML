# Change: Existing Generators Migration

## Why
Move current functionality into the FUTURE G architecture with no behavioral regression.

## What Changes
Existing generators, XML, AI and batch entry points.

## Capabilities
- `general-generators`: migrate every existing generator entry point to the canonical registry and FUTURE G workspaces while preserving outputs and actions.
- `batch-generation`: preserve batch quantities, uniqueness, copy and export through the shared registry projection.
- `xml-validation`: preserve NF-e/CT-e generation, editor and validation flows inside the FUTURE G shell.
- `ai-assistant`: preserve local and remote assistant behavior, attachments, sessions and recoverable errors without exposing secrets.

## Out of Scope
Feature expansion.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
