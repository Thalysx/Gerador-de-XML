# Change: Immediate UX Improvements

## Why
Apply the prioritized improvements already defined for the current product.

## What Changes
Chat auto-scroll; composer attachments; batch placement/clear; manual NCM; naming; plate unification; XML upload.

## Capabilities
- `ai-assistant`: follow new conversation content only while the user remains near the bottom and move attachments into an extensible `+` composer action.
- `batch-generation`: place batch generation after the individual result and keep its clear action isolated.
- `general-generators`: use entity-oriented section names and a single plate area with an explicit pattern selector.
- `ncm-management`: accept, validate, remove and apply multiple manually supplied NCM values without introducing a new cargo generator.
- `xml-validation`: make the upload target operable across its full surface, support drag-and-drop and identify the selected source.

## Out of Scope
New generator families.

## Constraints
- Preserve existing working behavior unless this change explicitly modifies it.
- Do not rewrite unrelated areas.
- Keep secrets server-side.
- Adapt implementation to the repository's actual stack and conventions.
- Complete validation before moving to another change.
