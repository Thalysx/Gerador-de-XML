# Design: Existing Generators Migration

## Approach
Implement this change incrementally against the existing repository. Inspect current patterns first, reuse compatible components/services, isolate business rules from presentation, and avoid parallel old/new implementations that create duplicated or visually mixed application shells.

The previous UI refactor already moved the seven existing panels into the FUTURE G shell and introduced registry adapters. This change SHALL verify that migration against an explicit inventory, close only remaining integration gaps, and retain the current classic-script loading order required by the JSDOM engine and Netlify backend.

## Migration boundaries
- Registry and workspace adapters own discovery and routing, not generation algorithms.
- Existing domain scripts continue to own documents, XML, history, validation and export rules.
- Local assistant behavior remains deterministic; remote AI continues through the server-side API and session store.
- Existing storage keys and public entry points remain compatible unless a tested adapter deliberately replaces them.

## Compatibility
Existing routes and behaviors affected by this change MUST either remain compatible or be migrated deliberately with regression validation.

## Validation
Use the repository's available lint, tests and production build. Verify relevant existing functionality manually when automated coverage is absent.
