# Spec Delta

## ADDED Requirements

### Requirement: Existing batch parity after migration
Every existing batch-capable generator SHALL remain available from the active environment projection. Batch generation SHALL preserve quantities from 1 through 500, non-repetition within a batch, existing generator options and an explicit error for unsupported or invalid requests.

#### Scenario: Generate a valid batch
- **WHEN** the user requests between 1 and 500 records for a batch-capable generator
- **THEN** the application produces the requested number without duplicates in that batch and applies the existing format options

#### Scenario: Reject an invalid batch request
- **WHEN** the quantity is outside the supported range or the type is unavailable
- **THEN** no partial batch is produced and the user receives an understandable error

### Requirement: Batch copy and export parity
The migrated batch workspace SHALL preserve complete copy and TXT, CSV and JSON export behavior. A limited visual preview MUST NOT truncate copied or exported records, and clearing a batch MUST NOT erase the individual result or generator configuration.

#### Scenario: Export beyond the visual preview
- **WHEN** a generated batch contains more records than the visible preview
- **THEN** copy and every supported export include the complete batch while clear removes only batch state
