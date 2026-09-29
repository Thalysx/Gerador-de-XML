# Design: QA Portuário Generators

## Approach
Implement this change incrementally against the existing repository. Inspect current patterns first, reuse compatible components/services, isolate business rules from presentation, and avoid parallel old/new implementations that create duplicated or visually mixed application shells.

Port domain rules live in `assets/js/port-generators.js` and return structured records. The existing registry projects those records into Home, search, favorites, recent tools, individual generation, batch generation and export. No second port-only shell or result controller is introduced.

The manual NCM list remains a single persisted capability. In General Generators it feeds NF-e products; in QA Portuário it feeds cargo records. NF-e and its key remain general, while CT-e and its key remain port-only.

## Compatibility
Existing routes and behaviors affected by this change MUST either remain compatible or be migrated deliberately with regression validation.

## Validation
Use the repository's available lint, tests and production build. Verify relevant existing functionality manually when automated coverage is absent.

The completion gate is the full automated suite, production build and the seven-panel browser accessibility/overflow audit.
