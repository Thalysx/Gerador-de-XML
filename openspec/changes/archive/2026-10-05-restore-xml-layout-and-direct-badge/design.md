# Design

## Context

The existing activation path generates individual documents unless their registry entry requires configuration. Badge defaults are complete; optional model/barcode controls already retain their state. The visual refresh collapsed the XML form and moved result actions into disclosures, which the user wants reversed.

## Goals / Non-Goals

Generate a badge immediately on activation and restore the previous XML organization. Preserve the shared theme and existing functional paths. Do not change engines, APIs, SEFAZ or other workspaces.

## Decisions

1. Remove only the badge configuration prerequisite. Keep `openGenerator` as navigation without generation; use the existing activation path for option clicks, Home and search. Generate and Ctrl+Enter remain available for regeneration.
2. Restore only the XML panel subtree from `4a46652` and its workspace/setup CSS. Preserve global visual tokens and responsive breakpoints.
3. Expose XML fields, saved scenarios, manual NCM and Copy/Download/Validate/Open Editor directly. Keep focus on the visible Editor destination when navigating from the XML result.
4. Update regression tests and browser audit expectations to verify the requested behavior, retaining coverage of customized inputs, history, exports and mobile layouts.

## Risks / Trade-offs

- Automatic activation must add exactly one badge history entry; test clicks and retained options.
- Restoring a larger XML form increases its vertical footprint; verify mobile and both themes/environments without horizontal overflow.
- Direct Editor actions must not leave keyboard focus in the hidden XML panel; retain destination focus.

## Migration Plan

No data migration. Validate unit suite, production build and browser audit; synchronize changed UI requirements and archive the completed change. Reverting the focused change restores the prior presentation behavior without altering stored data.
