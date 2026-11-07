## MODIFIED Requirements

### Requirement: Generator behavior remains compatible
Catalog unification SHALL preserve IDs and existing generation, validation, formatting, history and export formats. Opening by identifier SHALL reach the declared workspace and variant without implicit generation.

#### Scenario: Open an existing tool
- **WHEN** the user opens an existing generator by identifier
- **THEN** its workspace and variant are selected without changing its output rules or generating solely for navigation.

## REMOVED Requirements

### Requirement: Environment-aware catalog projections
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

## ADDED Requirements

### Requirement: Unified catalog projection
The registry SHALL expose all existing discoverable generators and categories in one active catalog. Legacy domain metadata MAY remain for compatibility but SHALL NOT filter UI discovery, search, workspace, batch or commands. Non-discoverable variants SHALL remain compatible without becoming duplicate entries.

#### Scenario: Browse the catalog
- **WHEN** discovery or batch choices are rendered
- **THEN** general-purpose and port-domain tools appear together according to existing capabilities.

#### Scenario: Reach shared tools
- **WHEN** the user opens XML or Cadastro
- **THEN** NF-e, CT-e and all existing registration types remain available without an environment switch.
