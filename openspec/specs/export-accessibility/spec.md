# Spec: Export, Persistence, Accessibility and UX

## Purpose

Define cross-cutting export, local persistence, accessibility and operational-quality guarantees.

## Requirements

### Requirement: Export
Compatible results SHALL retain complete copy and CSV, JSON, XML or TXT downloads. Batch filenames SHALL retain their existing domain/generator identifiers for compatibility; no visible environment switch is required. Preview limits SHALL NOT truncate exports and unsupported actions SHALL give understandable feedback.

#### Scenario: Export a full batch
- **WHEN** a batch is exported from either domain
- **THEN** every record is included in the existing format and contextual filename.

#### Scenario: Reject an unsupported export
- **WHEN** a generator or format is unsupported
- **THEN** understandable guidance is shown.

### Requirement: Persistence
Sidebar, theme, favorites and existing histories SHALL remain compatible. Legacy environment preferences SHALL NOT filter the catalog or be erased. Activity SHALL retain its explicit allowlist and present both legacy domains together. API keys, sensitive tokens and unnecessary data MUST NOT be persisted insecurely.

#### Scenario: Load existing state
- **WHEN** saved general and port preferences and activity are loaded
- **THEN** their data remains available together without preserving a UI split
- **AND** extra activity fields and secrets are not retained.

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
The browser audit SHALL check all panels for overflow, accessible names, focus, reduced motion, runtime/console errors, unified search and first-party budgets. The matrix SHALL cover light/dark, 360/768/1280/1920 CSS pixels and expanded/collapsed sidebar states.

#### Scenario: Audit the unified interface
- **WHEN** the audit and matrix run
- **THEN** all panels and documented viewport/theme/sidebar combinations are checked
- **AND** errors, warnings, search regressions and exceeded budgets fail the audit.
