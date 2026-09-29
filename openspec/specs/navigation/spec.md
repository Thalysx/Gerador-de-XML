# Navigation

## Purpose

Define accessible, environment-aware navigation and discovery behavior for the shared FUTURE G application shell.

## Requirements

### Requirement: Expandable sidebar
The expanded sidebar SHALL show FUTURE G identity, environment selector, global search, icon and module name, settings and an icon-based collapse control. The collapsed sidebar SHALL show icons only, keep an icon-based expand control, expose function names through accessible tooltips and automatically increase usable content width. Collapse state SHALL persist between navigations when appropriate. The collapse control MUST NOT be represented as a large textual button or as a replacement for the FUTURE G identity.

#### Scenario: Collapse and restore navigation
- **WHEN** the user collapses the sidebar and navigates or reloads the application
- **THEN** the compact state remains usable with accessible names, tooltips and an icon-based expand control

### Requirement: Environment selector
The sidebar SHALL provide Geradores Gerais and QA Portuário. Changing environment SHALL update palette, brand mark, sidebar items, dashboard, search results, shortcuts, favorites, fiscal-document choices, assistant suggestions and application context without a full-page reload.

#### Scenario: Change active environment
- **WHEN** the user selects the other environment
- **THEN** all environment-sensitive navigation and discovery surfaces update without replacing the document

### Requirement: Global search
The application SHALL support generator and function search, with `Ctrl + K` as the preferred shortcut when compatible with the stack. Search SHALL respect the active environment, while the architecture SHALL permit future cross-environment search.

#### Scenario: Search within active environment
- **WHEN** the user searches for a generator or function
- **THEN** results contain only destinations available in the active environment

#### Scenario: Navigate global search by keyboard
- **WHEN** the user opens search with `Ctrl + K`
- **THEN** focus moves to the query, Arrow keys change the active result, Enter opens it, Escape restores prior focus and Tab remains contained in the modal search

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
