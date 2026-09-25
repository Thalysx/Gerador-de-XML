# Spec: Export, Persistence, Accessibility and UX

## Export
Where compatible, results SHALL export to CSV, JSON, XML and TXT and retain copy/copy-field/copy-complete actions. Output structures SHOULD be useful in Postman, Cypress, Playwright and QA workflows.

## Persistence
Suitable local persistence includes sidebar state, selected environment, favorites, UI preferences and optionally history. API keys, sensitive tokens and unnecessary data MUST NOT be persisted insecurely.

## Accessibility
New UI SHALL provide keyboard navigation, visible focus, proper labels, sufficient contrast, loading/success/error feedback, understandable messages, accessible collapsed-sidebar tooltips and accessible upload targets. Status MUST NOT rely on color alone.
