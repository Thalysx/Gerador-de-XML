## MODIFIED Requirements

### Requirement: Existing batch parity after migration
All existing batch-capable tools SHALL be available together. Quantities 1 through 500, non-repetition within a batch, supported options and errors for invalid requests SHALL remain unchanged.

#### Scenario: Generate a valid batch
- **WHEN** a batch-capable tool receives 1 to 500 records
- **THEN** generation uses existing format options and batch uniqueness rules.

#### Scenario: Reject an invalid batch request
- **WHEN** quantity or type is unsupported
- **THEN** no partial batch is produced and understandable guidance is shown.
