# Spec Delta

## ADDED Requirements

### Requirement: Environment-aware navigation
Changing between Geradores Gerais and QA Portuário SHALL update the visible navigation destinations, Home discovery, categories, favorites, recent tools, workspace choices and batch choices from the active registry projection without a full-page reload.

#### Scenario: Change environment from Home
- **WHEN** the user changes the environment while Home is active
- **THEN** the environment label, navigation and discovery surfaces update immediately and retain only destinations available in the selected environment

#### Scenario: Personalized item is unavailable
- **WHEN** a favorite or recent generator does not support the active environment
- **THEN** it is omitted from the active environment view without deleting the persisted preference

### Requirement: Safe environment transition
If the current workspace or selected generator is unavailable in the newly selected environment, the application SHALL navigate to Home and announce the transition while preserving generated results, history and preferences. A destination shared by both environments SHALL remain active.

#### Scenario: Switch away from a port-only generator
- **WHEN** the user is viewing a port-only generator and changes to Geradores Gerais
- **THEN** Home becomes active, the environment change is announced and previously generated or persisted data is not erased

#### Scenario: Switch while using a shared destination
- **WHEN** the active destination is supported by both environments
- **THEN** the destination remains active and its available generator choices are refreshed for the selected environment
