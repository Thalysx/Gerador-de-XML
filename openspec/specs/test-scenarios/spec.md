# Spec: Coherent Test Scenarios

## Purpose

Define coherent, linked and exportable synthetic operational scenarios for QA Portuário.

## Requirements

### Requirement: Scope

QA Portuário SHALL provide synthetic operational scenarios whose entities remain linked throughout each selected flow.

#### Scenario: Generate an operational scenario

- **WHEN** a user generates a selected QA Portuário flow
- **THEN** its synthetic entities remain linked throughout the scenario

### Requirement: Scenario model

Every scenario SHALL declare the schema version, a unique scenario ID, the selected template, requested and applied modes, generation time, stable internal references, related entities, operational data, ordered steps and intentional inconsistencies.

#### Scenario: Inspect a scenario model

- **WHEN** a generated scenario is inspected
- **THEN** every declared model field is present, including modes, stable references, ordered steps and intentional inconsistencies

### Requirement: Initial library

The library SHALL include Gate IN, Gate OUT, Recebimento, Expedição, Agendamento, Processo interno de entrada, Processo interno de saída, Operação com contêiner, Operação com carga solta and Fluxo operacional completo.

#### Scenario: Browse the initial scenario library

- **WHEN** a user opens the QA Portuário scenario library
- **THEN** all defined initial templates are available

### Requirement: Referential consistency

Driver, carrier, vehicle, container and cargo identifiers SHALL remain stable across the scenario and every step. Containerized cargo SHALL reference the same container number and seal as the container entity. Loose-cargo scenarios SHALL not create a container reference.

#### Scenario: Preserve entity references

- **WHEN** scenario entities recur across operational steps
- **THEN** their driver, carrier, vehicle, container and cargo identifiers remain stable
- **AND** containerized cargo uses the scenario container number and seal
- **AND** loose cargo has no container reference

### Requirement: Flow

Scenario steps SHALL be selected from the ordered operational sequence: internal process, window availability, scheduling, driver release, Gate IN, classification, inbound weighing, operation, outbound weighing and Gate OUT. Each template SHALL preserve the order of its applicable steps.

#### Scenario: Build an ordered flow

- **WHEN** a template selects its applicable operational steps
- **THEN** those steps preserve their order from the defined operational sequence

### Requirement: Modes

Valid mode SHALL preserve applicable domain rules. Invalid mode SHALL introduce one explicit, described business-data inconsistency without silently breaking entity references. Random mode SHALL record the requested mode and resolve to either valid or invalid data.

#### Scenario: Generate each supported mode

- **WHEN** valid, invalid or random mode is requested
- **THEN** valid mode preserves applicable domain rules
- **AND** invalid mode records one described business inconsistency without silently breaking references
- **AND** random mode records the request and resolves to valid or invalid data

### Requirement: Persistence and export

Users SHALL be able to generate, inspect, copy and download a scenario as JSON. The browser MAY retain up to 20 recent scenario masses locally and SHALL allow restoring or clearing them.

#### Scenario: Restore and export a scenario

- **WHEN** a user works with a generated or retained scenario
- **THEN** it can be inspected, copied and downloaded as JSON
- **AND** retained recent masses can be restored or cleared
- **AND** no more than 20 recent masses are retained locally when browser retention is used

### Requirement: Environment boundary

Scenario discovery and its workspace SHALL be available only in QA Portuário. Geradores Gerais SHALL not expose the scenario route.

#### Scenario: Access the scenario workspace

- **WHEN** the active environment changes
- **THEN** scenario discovery and its workspace are available only in QA Portuário
- **AND** Geradores Gerais does not expose the scenario route
