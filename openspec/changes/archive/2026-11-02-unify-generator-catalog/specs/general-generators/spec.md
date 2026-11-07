## MODIFIED Requirements

### Requirement: General generator categories
The unified catalog SHALL retain the existing People, Companies, Addresses, Vehicles, Synthetic Finance and Development categories and allow future Text/Utility tools. Values SHALL remain synthetic and intended for testing.

#### Scenario: Discover a general generator
- **WHEN** a supported general-purpose tool is present
- **THEN** it is reachable by category alongside port-domain tools.

### Requirement: Existing generator parity after migration
Every existing generator SHALL remain reachable by canonical identifier in the unified catalog, preserving generation format, options, validation, result actions and history. Presentation SHALL reuse existing engines.

#### Scenario: Open a generator variant
- **WHEN** the user opens an old plate, Mercosul plate or alphanumeric CNPJ variant
- **THEN** its exact variant opens without duplicating generation rules.

## ADDED Requirements

### Requirement: Registration type selection
Cadastro SHALL provide one explicit type selector for personal profiles and existing complete domain entities. Selecting a type SHALL choose the appropriate existing form without changing the catalog or discarding another profile. History restoration SHALL select the matching type and retain the original data shape.

#### Scenario: Restore different registration types
- **WHEN** the user restores a personal profile or a Transportadora history entry
- **THEN** its type and existing values are restored without a global context switch.

#### Scenario: Change type before generating
- **WHEN** the user selects a different complete entity type
- **THEN** an incompatible prior result is not offered as that selected type's copy output.
