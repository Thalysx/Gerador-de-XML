# Spec Delta

## ADDED Requirements

### Requirement: Canonical generator metadata
Every available generator SHALL have one unique registry entry containing its stable identifier, user-facing name and description, category, supported environment or environments, destination route, discovery keywords and explicit capabilities relevant to the current application. Home, workspace selection and batch selection SHALL derive their available generators from this registry.

#### Scenario: Registry metadata coverage
- **WHEN** the application initializes the generator catalog
- **THEN** every registered generator has a unique identifier, a valid category, at least one supported environment and a reachable destination route

#### Scenario: Shared catalog consumers
- **WHEN** a generator is available in the active environment
- **THEN** Home discovery, the destination workspace and batch selection expose it according to its declared capabilities without maintaining a second generator catalog

### Requirement: Environment-aware catalog projections
The registry SHALL expose generators and categories for the active `general` or `port` environment. A generator declared for both environments SHALL remain available in both projections, while an environment-specific generator SHALL not appear in the other environment's discovery, workspace or batch choices.

#### Scenario: General environment projection
- **WHEN** the user selects Geradores Gerais
- **THEN** discovery, categories, workspace choices and batch choices exclude generators declared only for QA Portuário

#### Scenario: Port environment projection
- **WHEN** the user selects QA Portuário
- **THEN** discovery, categories, workspace choices and batch choices include port generators and shared generators while excluding generators declared only for Geradores Gerais

### Requirement: Generator behavior remains compatible
Environment classification and shared presentation patterns SHALL NOT duplicate or alter the existing generation, validation, formatting, history or export rules. Opening a registered generator by identifier SHALL continue to reach its declared workspace and variant.

#### Scenario: Open a generator after changing environment
- **WHEN** the user opens an available generator from an environment-filtered discovery surface
- **THEN** the declared workspace and variant open without generating implicitly or changing the generator's existing output rules
