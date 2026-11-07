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

### Requirement: Accurate validation processing notice
Before XML selection or validation, the screen SHALL distinguish browser syntax/local checks from first-party server XSD processing, identify its supported versions and size limit, explain upload/drop and validation triggers, and state that the XSD service does not store or log XML. It SHALL explain local fallback, unsupported CT-e 3.00 XSD coverage and fiscal exclusions without claiming all processing stays in the browser.

#### Scenario: Review processing before providing XML
- **WHEN** the user opens XML validation before selecting, dropping or validating XML
- **THEN** the notice identifies first-party server processing for NF-e and CT-e 4.00 within the 4 MiB XSD limit
- **AND** it explains that file selection/drop or a validation action can initiate that processing
- **AND** the screen retains explicit digital-signature, full-fiscal-rule and SEFAZ exclusions and describes local fallback when XSD is unavailable

### Requirement: Byte-preserving fiscal schema packaging
Vendored fiscal XSDs SHALL retain the exact bytes identified by the existing manifest, independently of Git newline conversion settings. Restoration SHALL use packages matching recorded hashes and SHALL NOT change fiscal rules, recorded hashes or weaken integrity verification.

#### Scenario: Restore normalized source files
- **WHEN** local XSD bytes differ only by newline normalization from the verified official package
- **THEN** original package bytes are restored without changing the manifest or derived schemas.

#### Scenario: Checkout or archive schemas
- **WHEN** Git prepares a fresh checkout or archive with different autocrlf settings
- **THEN** all packaged XSD bytes still match their recorded hashes.

#### Scenario: Detect altered schema bytes
- **WHEN** an incorporated schema differs from the recorded bytes
- **THEN** integrity verification rejects it instead of accepting a changed hash or normalized comparison.

### Requirement: Validation upload ownership
Starting a replacement analysis SHALL invalidate previous upload results and release its busy controls. Only the current upload SHALL publish results or release controls of that upload. A stale file read SHALL NOT initiate XSD processing after replacement.

#### Scenario: Replace upload with pasted XML
- **WHEN** file reading is pending and the user validates pasted XML
- **THEN** upload controls become available and the pasted report remains authoritative after the old read completes.

#### Scenario: Finish an old upload during a new one
- **WHEN** a second upload is reading and the superseded upload finishes
- **THEN** the second upload retains its busy state until its own completion.

### Requirement: Atomic XSD admission
The first-party XSD handler SHALL reserve one of its two per-instance slots before awaiting request-body reading. Body failures and synchronous engine errors SHALL release the slot. A timed-out response SHALL retain its slot until the underlying validation actually settles. Admission errors SHALL retain the existing 429 response and Retry-After contract.

#### Scenario: Hold two request bodies
- **WHEN** two accepted requests are still reading bodies and a third request arrives
- **THEN** the third request is rejected with 429 without starting another validation.

#### Scenario: Fail before validation
- **WHEN** reading, JSON validation or synchronous engine invocation fails
- **THEN** the reserved slot becomes available without a leak or double release.

#### Scenario: Respond before computation finishes
- **WHEN** an XSD response times out while its engine operation remains pending
- **THEN** that operation still counts against capacity until it settles.

### Requirement: Stable editor import ownership
An asynchronous editor import SHALL retain its initial destination group. Completion SHALL NOT switch a different selected group. Clearing a group SHALL invalidate only its pending imports; resetting the editor SHALL invalidate all pending imports. Every file SHALL settle once on success, failure or abort without hiding valid files in that batch.

#### Scenario: Change group during reading
- **WHEN** a user starts importing into one group and selects another before completion
- **THEN** imported files belong to the original group and the current selection remains unchanged.

#### Scenario: Discard pending imports
- **WHEN** a group is cleared or the editor resets before FileReader finishes
- **THEN** stale callbacks do not recreate discarded files or replace the new session.

#### Scenario: Read a mixed batch
- **WHEN** one file fails or is aborted while another contains valid XML
- **THEN** the valid file remains accessible and the batch reaches a completed state.
