# Spec: Export, Persistence, Accessibility and UX

## Purpose

Define cross-cutting export, local persistence, accessibility and operational-quality guarantees.

## Requirements

### Requirement: Export

Where compatible, results SHALL export to CSV, JSON, XML and TXT and retain copy/copy-field/copy-complete actions. Output structures SHOULD be useful in Postman, Cypress, Playwright and QA workflows.

Batch-capable registry entries SHALL expose complete JSON, CSV and TXT downloads. Filenames SHALL identify the active environment and generator, visual preview limits MUST NOT truncate exported records, and unsupported formats or generators SHALL fail with understandable feedback.

#### Scenario: Export a compatible result

- **WHEN** a user exports a compatible individual or batch result
- **THEN** the available download contains every requested record in the supported format
- **AND** its filename identifies the active environment and generator

#### Scenario: Request an unsupported export

- **WHEN** a format or generator cannot be exported
- **THEN** the application provides understandable feedback

### Requirement: Persistence

Suitable local persistence includes sidebar state, selected environment, favorites, UI preferences and optionally history. API keys, sensitive tokens and unnecessary data MUST NOT be persisted insecurely.

The productivity activity ledger SHALL use an explicit field allowlist and ignore extra fields supplied by callers or found in storage.

#### Scenario: Restore suitable local state

- **WHEN** the application restores locally persisted state
- **THEN** only suitable UI and productivity data is used
- **AND** the activity ledger ignores fields outside its explicit allowlist
- **AND** API keys, sensitive tokens and unnecessary data are not persisted insecurely

### Requirement: Accessibility

New UI SHALL provide keyboard navigation, visible focus, proper labels, sufficient contrast, loading/success/error feedback, understandable messages, accessible collapsed-sidebar tooltips and accessible upload targets. Status MUST NOT rely on color alone.

Long-running local file operations SHALL expose a visible live status and `aria-busy`, and SHALL prevent duplicate activation while processing without imposing artificial loading on synchronous generators.

#### Scenario: Operate new UI without relying on color or a pointer

- **WHEN** a user navigates new UI with a keyboard or assistive technology
- **THEN** controls have proper labels, visible focus, sufficient contrast and understandable status feedback
- **AND** collapsed navigation and upload targets remain accessible

#### Scenario: Process a long-running local file operation

- **WHEN** a local file operation is still processing
- **THEN** a visible live status and `aria-busy` expose the busy state
- **AND** duplicate activation is prevented without adding artificial loading to synchronous generators

### Requirement: Operational quality

The browser audit SHALL exercise every application panel for horizontal overflow, accessible names, visible focus and reduced motion. It SHALL also fail on uncaught exceptions, console errors or warnings, a broken environment-aware command palette, or exceeded documented first-party resource budgets.

The responsive matrix SHALL cover every panel in light and dark themes at 360, 768, 1280 and 1920 CSS pixels with both expanded and collapsed sidebar states.

#### Scenario: Audit the complete interface

- **WHEN** the browser audit and responsive matrix run
- **THEN** every panel is checked for overflow, accessible names, visible focus and reduced motion
- **AND** all documented viewport, theme and sidebar combinations are covered
- **AND** runtime errors, console warnings, command-palette regressions or exceeded resource budgets fail the audit
