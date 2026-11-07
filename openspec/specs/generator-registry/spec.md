# Generator Registry and Shared Architecture

## Purpose

Define the canonical catalog and shared behavioral contract used to discover, open and extend FUTURE G generators without duplicating business rules or presentation architecture.

## Requirements

### Requirement: Central registry
When compatible with the existing stack, generators SHALL be described by a central registry containing a stable identifier, name, environment, category, icon, route, keywords, batch support, export support, valid/invalid support and description. Sidebar, search, favorites and dashboards SHALL consume this common source rather than duplicate module metadata.

#### Scenario: Consumer reads generator metadata
- **WHEN** a discovery or navigation surface presents an existing generator
- **THEN** its identity, destination and supported capabilities come from the central registry

### Requirement: Modular generator boundaries
Generator business logic SHALL be separated from UI where practical. General and port-specific modules SHALL be separated conceptually without creating artificial directories that conflict with the real stack.

#### Scenario: Presentation changes without rule duplication
- **WHEN** a generator is presented in a new discovery or workspace surface
- **THEN** the surface reuses the existing generation rules instead of copying them into UI code

### Requirement: Reusable generator components
The application SHALL prefer shared configurable components for forms, results, copy, regenerate, batch, export, upload, errors, validation, cards, registration sheets and navigation. It SHALL NOT duplicate entire components between environments when configuration is sufficient.

#### Scenario: Shared behavior in both environments
- **WHEN** equivalent generator behavior is available in Geradores Gerais and QA Portuário
- **THEN** both environments use the same configurable interaction pattern and business implementation

### Requirement: New generator baseline
When applicable, every new generator SHALL have a name, description, category and environment; synthetic output; regenerate and copy actions; validation; understandable errors; searchability; favorites; and responsive UI. Batch and export SHALL be supported where meaningful.

#### Scenario: Register a new generator
- **WHEN** a new generator is added to FUTURE G
- **THEN** its registry entry and user experience expose every applicable baseline capability

### Requirement: Canonical generator metadata
Every available generator SHALL have one unique registry entry containing its stable identifier, user-facing name and description, category, supported environment or environments, destination route, discovery keywords and explicit capabilities relevant to the current application. Home, workspace selection and batch selection SHALL derive their available generators from this registry.

#### Scenario: Registry metadata coverage
- **WHEN** the application initializes the generator catalog
- **THEN** every registered generator has a unique identifier, a valid category, at least one supported environment and a reachable destination route

#### Scenario: Shared catalog consumers
- **WHEN** a generator is available in the active environment
- **THEN** Home discovery, the destination workspace and batch selection expose it according to its declared capabilities without maintaining a second generator catalog

### Requirement: Unified catalog projection
The registry SHALL expose all existing discoverable generators and categories in one active catalog. Legacy domain metadata MAY remain for compatibility but SHALL NOT filter UI discovery, search, workspace, batch or commands. Non-discoverable variants SHALL remain compatible without becoming duplicate entries.

#### Scenario: Browse the catalog
- **WHEN** discovery or batch choices are rendered
- **THEN** general-purpose and port-domain tools appear together according to existing capabilities.

#### Scenario: Reach shared tools
- **WHEN** the user opens XML or Cadastro
- **THEN** NF-e, CT-e and all existing registration types remain available without an environment switch.

### Requirement: Generator behavior remains compatible
Catalog unification SHALL preserve IDs and existing generation, validation, formatting, history and export formats. Opening by identifier SHALL reach the declared workspace and variant without implicit generation.

#### Scenario: Open an existing tool
- **WHEN** the user opens an existing generator by identifier
- **THEN** its workspace and variant are selected without changing its output rules or generating solely for navigation.
