## ADDED Requirements

### Requirement: Packaged XSD runtime assets
The Vercel function package SHALL explicitly include the dynamically loaded xmllint-wasm Worker and WASM binary alongside the existing fiscal schemas. Supported positive and negative XSD validation SHALL remain available without changing schemas, validation rules or API contracts.

#### Scenario: Execute XSD from the deployed function package
- **WHEN** a supported document is submitted to the deployed first-party XSD endpoint
- **THEN** the Worker can load its packaged WASM binary
- **AND** valid and invalid documents return XSD coverage rather than a missing-runtime service failure
