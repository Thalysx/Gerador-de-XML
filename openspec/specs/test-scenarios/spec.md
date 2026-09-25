# Spec: Test Scenarios

## Scenario library
Initial scenario targets include Gate IN, Gate OUT, Receiving, Dispatch, Scheduling, Internal Entry Process, Internal Exit Process, Container and Loose Cargo.

## Complete scenario
The platform SHALL progressively support an integrated flow such as: Internal Process → Window Availability → Scheduling → Driver Release → Gate IN → Classification → Weighing → Operation → Exit Weighing → Gate OUT.

## Referential consistency
Related values MUST NOT be generated independently within the same scenario. A generated driver, vehicle, container and cargo SHALL remain consistently referenced across relevant steps. Internal identifiers MAY be used to guarantee consistency.

## Validity modes
Generators/scenarios SHOULD progressively support Valid, Invalid and Random modes for fields where meaningful, including CPF, CNPJ, RG, CNH, plate, container, NFe/XML, dates and weights.
