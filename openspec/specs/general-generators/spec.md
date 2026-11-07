# Geradores Gerais

## Purpose

Define the catalog direction and interaction rules for general-purpose synthetic data generators used in development and QA.

## Requirements

### Requirement: General generator categories
The unified catalog SHALL retain the existing People, Companies, Addresses, Vehicles, Synthetic Finance and Development categories and allow future Text/Utility tools. Values SHALL remain synthetic and intended for testing.

#### Scenario: Discover a general generator
- **WHEN** a supported general-purpose tool is present
- **THEN** it is reachable by category alongside port-domain tools.

### Requirement: Entity-oriented naming
Generator section titles SHALL represent entities, including Pessoa física and Pessoa jurídica, while individual action labels such as CPF, RG, CNH and CNPJ remain explicit and independently controlled. Changing a section title MUST NOT implicitly change button labels.

#### Scenario: Rename a section
- **WHEN** the generator catalog renders an entity-oriented section title
- **THEN** the actions inside it retain their registry labels

### Requirement: Person and RG grouping
RG SHALL be treated as Person data alongside CPF while retaining an individual RG generator when useful.

#### Scenario: Access RG
- **WHEN** the user browses Person generators
- **THEN** RG is discoverable and can still be generated individually

### Requirement: Unified vehicle plate area
Mercosul and old-pattern plates SHALL live in one discoverable Placa area with an explicit pattern selector. The former old-pattern identifier SHALL remain a compatible direct-entry alias without rendering a second discovery action.

#### Scenario: Select a plate pattern
- **WHEN** the user chooses Mercosul or padrão antigo in the shared plate area
- **THEN** generation and regeneration preserve the selected format

#### Scenario: Open the compatible old-pattern identifier
- **WHEN** an existing favorite, recent item or history opens `placa-antiga`
- **THEN** the shared Placa area opens with padrão antigo selected

### Requirement: Cadastro Geral group selection
Cadastro Geral SHALL support a registration-sheet presentation and selectable Identificação, Documentos, Contato, Endereço and Dados profissionais groups, with Select all and Clear selection actions.

#### Scenario: Generate selected registration groups
- **WHEN** the user selects one or more Cadastro Geral groups
- **THEN** the registration sheet contains the selected synthetic sections

### Requirement: Badge generator baseline
A badge generator SHALL support a synthetic avatar or photo, name, badge code, company, function, registration, validity, status and optional barcode or QR when relevant. Initial actions SHALL include regenerate and copy code, and the architecture SHALL support future Employee, Driver, Visitor and Contractor models.

#### Scenario: Generate a synthetic badge
- **WHEN** the user requests a badge for a supported model
- **THEN** the badge exposes synthetic identity fields and regenerate and copy-code actions

### Requirement: Existing generator parity after migration
Every existing generator SHALL remain reachable by canonical identifier in the unified catalog, preserving generation format, options, validation, result actions and history. Presentation SHALL reuse existing engines.

#### Scenario: Open a generator variant
- **WHEN** the user opens an old plate, Mercosul plate or alphanumeric CNPJ variant
- **THEN** its exact variant opens without duplicating generation rules.

### Requirement: Single migrated entry point
Existing generator discovery and selection SHALL use the FUTURE G registry and workspaces. The application MUST NOT expose a second legacy shell, independent Home generator engine or duplicate catalog for the migrated functionality.

#### Scenario: Discover and open a migrated generator
- **WHEN** the user selects an existing generator from a discovery surface
- **THEN** the shared workspace opens the registry destination and generation occurs only after an explicit user action

### Requirement: Registration type selection
Cadastro SHALL provide one explicit type selector for personal profiles and existing complete domain entities. Selecting a type SHALL choose the appropriate existing form without changing the catalog or discarding another profile. History restoration SHALL select the matching type and retain the original data shape.

#### Scenario: Restore different registration types
- **WHEN** the user restores a personal profile or a Transportadora history entry
- **THEN** its type and existing values are restored without a global context switch.

#### Scenario: Change type before generating
- **WHEN** the user selects a different complete entity type
- **THEN** an incompatible prior result is not offered as that selected type's copy output.
