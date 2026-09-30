# XML Generation and Validation

## Purpose

Define structured XML generation, inspection, upload and validation behavior for synthetic fiscal and QA workflows.

## Requirements

### Requirement: Structured XML validation depth
XML validation SHALL reject unsafe input before parsing, identify the fiscal document and version, validate supported NF-e 4.00 and CT-e 4.00 documents against immutable packaged official schemas, and then apply non-duplicated FUTURE G domain rules. Unsupported versions SHALL retain safe applicable checks while being reported as unsupported for XSD coverage.

#### Scenario: Validate a structured fiscal XML
- **WHEN** the user validates a supported XML document
- **THEN** the report covers syntax and every applicable structural or domain check available in the system

#### Scenario: Validate a supported fiscal XML
- **WHEN** the user validates an NF-e 4.00 model 55 or CT-e 4.00 model 57 XML
- **THEN** the report covers syntax, document and version identification, XSD and every applicable local domain rule
- **AND** it does not claim official authorization or legal validity

#### Scenario: Validate a legacy or unsupported version
- **WHEN** the user validates CT-e 3.00 or another safely parseable unsupported version
- **THEN** applicable syntax and local checks remain available
- **AND** XSD coverage is explicitly reported as unsupported rather than approved

### Requirement: Validation severity
Results SHALL classify findings as Error, Warning or Information.

#### Scenario: Present mixed findings
- **WHEN** validation produces findings with different impact
- **THEN** each finding displays the corresponding severity

### Requirement: Detailed XML finding
Every finding SHALL expose a stable code, severity, origin and understandable message and, when available, SHALL show tag, value, XML path and syntax or schema line and column. Finding origins SHALL distinguish syntax, XSD, FUTURE G local rules and coverage information.

#### Scenario: Locate a syntax problem
- **WHEN** the parser provides a source position
- **THEN** the finding includes the available line or column with the issue context

#### Scenario: Locate a schema problem
- **WHEN** XSD validation identifies an invalid element or value with a source location
- **THEN** the finding is marked with origin `xsd`
- **AND** the available line, column, tag or path is included without exposing the complete XML

### Requirement: XML result views
The interface SHALL provide Summary, XML and Validation views. Summary MAY show key, issuer, CNPJ, recipient, products, total value, gross weight and other relevant fields.

For CT-e, recipient fields in the Summary SHALL come from `dest`; `rem` SHALL remain the sender and MUST NOT be labeled as the recipient.

#### Scenario: Review an XML result
- **WHEN** the user changes between result views
- **THEN** summary, source XML and validation information remain associated with the same document

#### Scenario: Summarize a CT-e with different sender and recipient
- **WHEN** a CT-e contains distinct `rem` and `dest` parties
- **THEN** the recipient name and document shown in Summary come from `dest`

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

### Requirement: Explicit validation coverage
Each XML report SHALL expose separate coverage states for syntax, XSD, local rules and official validation. Coverage states SHALL distinguish approved, rejected, not executed, unsupported and unavailable checks. Official validation SHALL remain not executed during this capability.

#### Scenario: XSD service is unavailable
- **WHEN** local checks complete but the first-party XSD validator cannot be reached or completed
- **THEN** the local findings remain available
- **AND** XSD coverage is marked unavailable
- **AND** the document is not presented as fully validated

### Requirement: Safe immutable schema validation
XSD validation SHALL use versioned official schemas packaged with the application, SHALL verify their recorded integrity during build or tests, SHALL NOT download schemas or resolve external resources at runtime, and SHALL refuse DTD or entity declarations and inputs over the configured limits.

#### Scenario: Attempt external entity resolution
- **WHEN** an XML or schema reference requests a DTD, entity, URL or caller-controlled filesystem path
- **THEN** validation refuses the request before external resolution
- **AND** no network or filesystem resource selected by the document is accessed

### Requirement: Private first-party XSD processing
The application SHALL send XML to XSD processing only after an explicit validation action, only to the application first-party endpoint, and SHALL NOT persist, log or echo the source XML. Failure of remote XSD processing SHALL degrade to the local structured report with explicit reduced coverage.

#### Scenario: Complete first-party XSD validation
- **WHEN** the user explicitly validates a supported XML within the operational limit
- **THEN** the endpoint returns findings and coverage without the source XML
- **AND** the existing report views, redacted export and editor-copy workflow remain consumers of the same report
