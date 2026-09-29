# XML Generation and Validation

## Purpose

Define structured XML generation, inspection, upload and validation behavior for synthetic fiscal and QA workflows.

## Requirements

### Requirement: Structured XML validation depth
XML validation SHALL inspect well-formedness and, when applicable, root, expected structure, required tags, access key, issuer, recipient, products, CPF or CNPJ, formats, values and available system rules.

#### Scenario: Validate a structured fiscal XML
- **WHEN** the user validates a supported XML document
- **THEN** the report covers syntax and every applicable structural or domain check available in the system

### Requirement: Validation severity
Results SHALL classify findings as Error, Warning or Information.

#### Scenario: Present mixed findings
- **WHEN** validation produces findings with different impact
- **THEN** each finding displays the corresponding severity

### Requirement: Detailed XML finding
When available, a finding SHALL show tag, value, issue, XML path and syntax line or column.

#### Scenario: Locate a syntax problem
- **WHEN** the parser provides a source position
- **THEN** the finding includes the available line or column with the issue context

### Requirement: XML result views
The interface SHALL provide Summary, XML and Validation views. Summary MAY show key, issuer, CNPJ, recipient, products, total value, gross weight and other relevant fields.

#### Scenario: Review an XML result
- **WHEN** the user changes between result views
- **THEN** summary, source XML and validation information remain associated with the same document

### Requirement: XML upload interaction
The XML validation upload area SHALL be operable across its full visible target, support keyboard selection and drag-and-drop, identify selected or dropped filenames, and permit replacement through the same interaction. Selection and drop SHALL use the same validation limits and local processing path.

#### Scenario: Replace an uploaded XML
- **WHEN** the user drops or selects another supported XML file
- **THEN** the interface identifies the new file and uses it as the active validation source

#### Scenario: Drop an unsupported file
- **WHEN** the user drops a file outside the supported type or size limits
- **THEN** the upload status identifies the rejected source and the validation result explains the recoverable problem

#### Scenario: Process selected files
- **WHEN** one or more supported files are being read locally
- **THEN** the input region exposes its busy state to assistive technology
- **AND** the upload target is temporarily disabled to prevent duplicate processing
- **AND** the visible live status identifies the files being analyzed and the eventual outcome

### Requirement: Intentional negative XML tests
The system SHALL support intentionally inconsistent synthetic XML such as invalid CPF, CNPJ or key; missing required fields; invalid formats or tags; and malformed XML. The UI MUST clearly identify these as intentionally generated test data.

#### Scenario: Generate an intentional invalid variant
- **WHEN** the user selects a supported negative-test variant
- **THEN** the resulting XML contains the selected inconsistency and is clearly labeled as intentional test data

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
