# Spec: Export, Persistence, Accessibility and UX

## Export
Where compatible, results SHALL export to CSV, JSON, XML and TXT and retain copy/copy-field/copy-complete actions. Output structures SHOULD be useful in Postman, Cypress, Playwright and QA workflows.

Batch-capable registry entries SHALL expose complete JSON, CSV and TXT downloads. Filenames SHALL identify the active environment and generator, visual preview limits MUST NOT truncate exported records, and unsupported formats or generators SHALL fail with understandable feedback.

## Persistence
Suitable local persistence includes sidebar state, selected environment, favorites, UI preferences and optionally history. API keys, sensitive tokens and unnecessary data MUST NOT be persisted insecurely.

The productivity activity ledger SHALL use an explicit field allowlist and ignore extra fields supplied by callers or found in storage.

## Accessibility
New UI SHALL provide keyboard navigation, visible focus, proper labels, sufficient contrast, loading/success/error feedback, understandable messages, accessible collapsed-sidebar tooltips and accessible upload targets. Status MUST NOT rely on color alone.

Long-running local file operations SHALL expose a visible live status and `aria-busy`, and SHALL prevent duplicate activation while processing without imposing artificial loading on synchronous generators.

## Operational quality
The browser audit SHALL exercise every application panel for horizontal overflow, accessible names, visible focus and reduced motion. It SHALL also fail on uncaught exceptions, console errors or warnings, a broken environment-aware command palette, or exceeded documented first-party resource budgets.

The responsive matrix SHALL cover every panel in light and dark themes at 360, 768, 1280 and 1920 CSS pixels with both expanded and collapsed sidebar states.
