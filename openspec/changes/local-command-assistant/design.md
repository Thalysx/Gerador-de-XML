# Design

## Context
Vanilla browser modules already supply deterministic records, XML templates and local validation. The former AI UI shares the composer and attachments. See proposal.md for motivation.

## Goals / Non-Goals
Reuse engines and preserve generator workspaces. Retire remote chat; retain fiscal XSD API and historical provider unit code. No provider credential changes or SEFAZ integration.

## Decisions
Separate command parsing/catalog, XML execution, conversation presentation and attachments. Derive generator availability from the registry and explicit noun aliases. Fully parse and validate before execution. Use pure document clones and shared key, totals and validation helpers for isolated XML; avoid temporary replacement of form DOM. Use existing negative variant helper with optional source document and target checks. Choose explicit attached/current sources; otherwise attachment or last local XML, with a contextual missing-source error. Generate at most 20 NF-e items to bound rendering and memory.
Suggestions and favorites fill only; Enter or Send executes. Conversation and latest successful command remain in memory. Favorites store validated command strings under environment-specific local keys. Keep at most 10 exchanges, 50 visible records and bounded preview text. Clear discards attachments and repeat state. FileReader uses generation tokens so removed attachments cannot reappear.
Public Vercel, Netlify and default local server chat/status return 410, without importing or initializing provider runtime. Historical isolated server API tests may use explicit injected assistants. Delete retired browser AI modules from public assets; retain XML validation route unchanged.

## Risks / Trade-offs
Fixed grammar rejects unknown prose with help; no open-ended model explanation. Local validation reports syntax/domain rules and explicitly excludes XSD and official authorization. XML templates remain synthetic signed examples. Escape all supplied content. Test every catalog command in both environments, negative-source preservation, malformed/untrusted inputs, repeat/favorites, keyboard and mobile layout.

## Migration Plan
Run tests/build/browser matrix; sync specifications, archive completed change and release alpha.7 using established Git/Vercel integration. Rollback by reverting the version commits.
