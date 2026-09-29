# Spec: Coherent Test Scenarios

## Scope
QA Portuário SHALL provide synthetic operational scenarios whose entities remain linked throughout each selected flow.

## Scenario model
Every scenario SHALL declare the schema version, a unique scenario ID, the selected template, requested and applied modes, generation time, stable internal references, related entities, operational data, ordered steps and intentional inconsistencies.

## Initial library
The library SHALL include Gate IN, Gate OUT, Recebimento, Expedição, Agendamento, Processo interno de entrada, Processo interno de saída, Operação com contêiner, Operação com carga solta and Fluxo operacional completo.

## Referential consistency
Driver, carrier, vehicle, container and cargo identifiers SHALL remain stable across the scenario and every step. Containerized cargo SHALL reference the same container number and seal as the container entity. Loose-cargo scenarios SHALL not create a container reference.

## Flow
Scenario steps SHALL be selected from the ordered operational sequence: internal process, window availability, scheduling, driver release, Gate IN, classification, inbound weighing, operation, outbound weighing and Gate OUT. Each template SHALL preserve the order of its applicable steps.

## Modes
Valid mode SHALL preserve applicable domain rules. Invalid mode SHALL introduce one explicit, described business-data inconsistency without silently breaking entity references. Random mode SHALL record the requested mode and resolve to either valid or invalid data.

## Persistence and export
Users SHALL be able to generate, inspect, copy and download a scenario as JSON. The browser MAY retain up to 20 recent scenario masses locally and SHALL allow restoring or clearing them.

## Environment boundary
Scenario discovery and its workspace SHALL be available only in QA Portuário. Geradores Gerais SHALL not expose the scenario route.
