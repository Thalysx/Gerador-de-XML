# Design

## Context

See proposal.md. The app uses static HTML, six CSS owners, global vanilla presentation handlers, Bootstrap for optional tooltips/modals and a bounded Lucide runtime. Existing IDs are consumed by domain functions and regression tests. The updated plan supersedes the canonical purple identity and permanent secondary assistant controls; delta specs record these changes.

## Goals / Non-Goals

**Goals:** shared tokens and native disclosures, retaining all handlers and DOM inputs; task and result first across both environments and themes.

**Non-Goals:** new business capabilities from illustrative mockups, persistence migrations, a React/Tailwind rewrite, APIs, fiscal integration or deployment.

## Decisions

1. Keep the existing six CSS owners and edit their existing rules. Canonical semantic tokens live in base.css; legacy names alias them to preserve consumers. No extra override stylesheet.
2. Use native details/summary for advanced settings and More actions. They provide keyboard semantics and retain input values; avoid custom role=menu without implementing full menu navigation. A small presentation-only controller handles Escape, outside clicks, action dismissal and Edit data focus.
3. Keep optional mask/name in a collapsed disclosure; required phone/plate/badge configuration stays visible. Batch and history retain existing independent disclosures.
4. XML generation and preview come first; existing fields, saved scenarios, NCMs and lock controls move to advanced disclosures without cloning nodes. Cadastro keeps groups/entity selection visible and full editing collapsed, with Edit data next to the result.
5. Home retains generator discovery and recent tools; favorite and dashboard projections stay in native disclosures. Their storage and rendering remain unchanged.
6. Inter is the common UI font; monospace remains for identifiers and XML. Blue actions share both environments. Purple accents appear only on assistant indicators; success/warning/error use tokens with labels.
7. Keep both light and dark theme preferences. Use contrast-adjusted secondary text rather than the suggested low-contrast muted value for small body text.
8. If a contextual action navigates to another workspace, recover focus on the destination panel rather than a now-hidden summary. The Editor's shared title/import labels say XML; NF-e-specific product tools keep their explicit document label.
9. Verify the Editor with loaded files as well as its empty state. Wrap file/tool tabs and constrain product cards and fields to the available width; file labels truncate while their accessible names and close controls remain available.
10. Show the Generate button for every selected individual generator, with click as the standard action. Keep Ctrl+Enter as an optional shortcut described by the button title and aria-keyshortcuts, without a keyboard badge in the label. Simple options continue to generate when activated.

## Risks / Trade-offs

- Closed forms could hide errors → preserve validation and open ancestor disclosures before focusing invalid controls; test generation/edit/restoration with forms collapsed.
- Moved actions can lose keyboard context → keep IDs/handlers, named summary triggers, Escape focus recovery and outside dismissal; browser audit all panels and disclosure states.
- Large result changes affect scroll → preserve existing result lifecycle and test complete exports versus the displayed projection.
- New palette conflicts with existing product docs → synchronize the app-shell delta and architecture/roadmap notes after verification.

## Migration Plan

Implement only this change, verify unit regressions, build, strict OpenSpec validation and browser audits in both themes/environments and narrow/desktop widths. Review screenshots. Revert this change's presentation files together for rollback; no data migration is required.
