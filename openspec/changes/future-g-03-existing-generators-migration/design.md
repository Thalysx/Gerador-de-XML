# Design: Existing Generators Migration

## Approach
Implement this change incrementally against the existing repository. Inspect current patterns first, reuse compatible components/services, isolate business rules from presentation, and avoid parallel old/new implementations that create duplicated or visually mixed application shells.

## Compatibility
Existing routes and behaviors affected by this change MUST either remain compatible or be migrated deliberately with regression validation.

## Validation
Use the repository's available lint, tests and production build. Verify relevant existing functionality manually when automated coverage is absent.
