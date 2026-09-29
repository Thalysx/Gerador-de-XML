# Batch Generation

## Purpose

Define safe batch generation, placement and state-isolation behavior across compatible FUTURE G generators.

## Requirements

### Requirement: Configurable safe quantities
Batch generation SHALL remain available for compatible generators and SHALL use safe configurable quantities with understandable validation.

#### Scenario: Request a supported quantity
- **WHEN** the user submits a valid batch quantity for a compatible generator
- **THEN** the application generates that quantity or reports a recoverable generation constraint

### Requirement: Batch placement after individual result
The document workspace SHALL present configuration, Generate, individual result and then batch generation in document order. Batch generation SHALL appear after the individual result and before history rather than among the individual configuration controls.

#### Scenario: Navigate individual and batch controls
- **WHEN** the user follows the generator workspace in document order
- **THEN** individual configuration and result precede batch generation

### Requirement: Isolated batch clear
A visible Limpar lote action SHALL clear only the generated batch and its export actions. It MUST NOT reset generator configuration, individual result, history or the selected generator.

#### Scenario: Clear a generated batch
- **WHEN** the user clears batch results after generating an individual value
- **THEN** batch state is removed while the individual value and configuration remain available

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
