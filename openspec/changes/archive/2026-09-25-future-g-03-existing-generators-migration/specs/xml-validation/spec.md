# Spec Delta

## ADDED Requirements

### Requirement: Existing XML workflow parity after migration
NF-e and CT-e generation, scenario selection, locked fields, products, preview, download, editor import and validation SHALL remain available inside the FUTURE G shell without changing the existing fiscal generation rules.

#### Scenario: Complete migrated XML flow
- **WHEN** the user generates an NF-e or CT-e, edits it, validates it and downloads the selected document
- **THEN** the data, selected document type, locked values, products and existing validation behavior remain consistent across the workflow

#### Scenario: Invalid imported XML
- **WHEN** the user imports or pastes malformed or inconsistent XML
- **THEN** the validator reports the existing recoverable syntax or consistency findings without discarding the source content

### Requirement: Single XML entry architecture
Migrated XML panels SHALL share the FUTURE G shell and existing XML state adapters. The migration MUST NOT create a second XML generator, editor or validator engine.

#### Scenario: Move between XML panels
- **WHEN** the user moves from generation to editing or validation
- **THEN** the relevant current XML remains available through the existing workflow adapters
