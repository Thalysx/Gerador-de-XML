# Spec Delta

## ADDED Requirements

### Requirement: Existing generator parity after migration
Every generator available before the FUTURE G migration SHALL remain reachable through its canonical identifier in an appropriate environment and SHALL preserve its generation format, options, validation behavior, result actions and history behavior. Migration SHALL reuse the existing generation rules rather than introduce a parallel implementation.

#### Scenario: Generate an existing individual document
- **WHEN** the user opens an existing generator through Home or its workspace and requests a value with supported options
- **THEN** the value follows the existing format and remains available to regenerate, copy, inspect, clear and restore from history as applicable

#### Scenario: Open a generator variant
- **WHEN** the user opens an existing variant such as old-pattern plate, Mercosul plate or alphanumeric CNPJ
- **THEN** the canonical identifier selects the exact variant without depending on display text or duplicating its generation rule

### Requirement: Single migrated entry point
Existing generator discovery and selection SHALL use the FUTURE G registry and workspaces. The application MUST NOT expose a second legacy shell, independent Home generator engine or duplicate catalog for the migrated functionality.

#### Scenario: Discover and open a migrated generator
- **WHEN** the user selects an existing generator from a discovery surface
- **THEN** the shared workspace opens the registry destination and generation occurs only after an explicit user action
