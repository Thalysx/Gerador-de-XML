# Proposal

## Why

The user wants Placa to generate immediately on activation, following the automatic badge behavior just delivered.

## What Changes

- Generate a plate immediately when activated from its option, Home or global search.
- Respect the selected Mercosul or old format, retaining Generate and optional Ctrl+Enter for regeneration.
- Preserve navigation-only opening, the explicit old-format alias, history and exports.
- Non-goals: telephone behavior, XML layout, engine changes, SEFAZ and unrelated workspaces.
- Regression risks: resetting the chosen format and recording duplicate history entries.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui-system`: direct plate generation with retained format.

## Impact

Generator registry and activation controller, meaningful interaction regression coverage, release documentation and the UI specification. No dependency, API or data contract changes.
