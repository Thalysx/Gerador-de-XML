# Proposal

## Why

The user wants Crachá to generate immediately when selected and prefers the XML Fiscal workspace used before the visual refresh.

## What Changes

- Activate Crachá with the existing defaults and retained options, preserving its Generate button and optional Ctrl+Enter shortcut.
- Restore the XML Fiscal markup and layout from commit `4a46652`: visible fields, scenarios, manual NCM and direct result actions.
- Keep the current shared palette, generation engines, validation, history, exports and other workspaces.
- Non-goals: SEFAZ integration, AI configuration and unrelated redesigns.
- Regression risks: duplicate badge history, loss of badge options, XML action focus and responsive overflow.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui-system`: direct badge generation and directly exposed XML configuration/result actions.

## Impact

Changes affect the generator registry, XML markup/layout, regression tests, browser audit and UI documentation. No API or data schema changes are required.
