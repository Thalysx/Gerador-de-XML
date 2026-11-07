## ADDED Requirements

### Requirement: Accurate validation processing notice
Before XML selection or validation, the screen SHALL distinguish browser syntax/local checks from first-party server XSD processing, identify its supported versions and size limit, explain upload/drop and validation triggers, and state that the XSD service does not store or log XML. It SHALL explain local fallback, unsupported CT-e 3.00 XSD coverage and fiscal exclusions without claiming all processing stays in the browser.

#### Scenario: Review processing before providing XML
- **WHEN** the user opens XML validation before selecting, dropping or validating XML
- **THEN** the notice identifies first-party server processing for NF-e and CT-e 4.00 within the 4 MiB XSD limit
- **AND** it explains that file selection/drop or a validation action can initiate that processing
- **AND** the screen retains explicit digital-signature, full-fiscal-rule and SEFAZ exclusions and describes local fallback when XSD is unavailable
