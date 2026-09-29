# Spec Delta

## MODIFIED Requirements

### Requirement: XML upload interaction
The XML validation upload area SHALL be operable across its full visible target, support keyboard selection and drag-and-drop, identify selected or dropped filenames, and permit replacement through the same interaction. Selection and drop SHALL use the same validation limits and local processing path.

#### Scenario: Replace an uploaded XML
- **WHEN** the user drops or selects another supported XML file
- **THEN** the interface identifies the new file and uses it as the active validation source

#### Scenario: Drop an unsupported file
- **WHEN** the user drops a file outside the supported type or size limits
- **THEN** the upload status identifies the rejected source and the validation result explains the recoverable problem
