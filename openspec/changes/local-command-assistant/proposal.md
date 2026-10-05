# Proposal

## Why
The user wants a predictable local command assistant instead of remote AI chat, with discoverable commands for the generators and XML tools already in FUTURE G.

## What Changes
- **BREAKING**: remove remote chat selection and retire public chat/status endpoints without changing XML validation endpoints.
- Extend local requests to every available batch generator, including badges and developer data.
- Add isolated XML generation, attachment summaries, products, recipient queries, local validation and negative test copies.
- Add an environment-aware catalog, reviewable suggestions, repeat and command favorites.
- Preserve multiline input, explicit attachments, safe results and bounded conversations.

## Capabilities
### New Capabilities
None.
### Modified Capabilities
- `ai-assistant`: replace optional remote assistance with a complete deterministic local command contract.
- `ui-system`: expose local commands in the full-page assistant and secondary controls.

## Impact
Browser command modules, assistant markup/styles, public API adapters, tests, release documentation and canonical specifications. No SEFAZ integration, provider credential changes or changes to generator algorithms. Regression risks include attachment parsing, environment isolation, XML source mutation, keyboard navigation and exports.
