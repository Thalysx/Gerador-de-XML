## MODIFIED Requirements

### Requirement: Expandable sidebar
The sidebar SHALL show FUTURE G identity, named tool groups and an icon-based collapse control. Its compact state SHALL show icons with accessible names/tooltips and increase usable content width. Collapse state SHALL persist without an environment selector.

#### Scenario: Collapse and restore navigation
- **WHEN** the user collapses navigation and reloads
- **THEN** the compact state remains usable by keyboard with an accessible expand control.

### Requirement: Global search
Global search SHALL discover tools and destinations across the whole catalog. Ctrl+K, Arrow keys, Enter, Escape, focus containment and focus restoration SHALL remain supported.

#### Scenario: Find tools across domains
- **WHEN** the user searches for CPF or Transportadora
- **THEN** the matching tool is reachable without a context switch.

#### Scenario: Navigate global search by keyboard
- **WHEN** the user opens search with Ctrl+K
- **THEN** focus moves to the query, Arrow keys change the result, Enter opens it, Escape restores prior focus and Tab stays contained.

## REMOVED Requirements

### Requirement: Environment selector
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

### Requirement: Environment-aware navigation
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

### Requirement: Safe environment transition
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

## ADDED Requirements

### Requirement: Unified catalog navigation
The shell SHALL expose one catalog containing existing general-purpose and port-domain tools. It SHALL NOT offer a global Geral/QA Portuario switch.

#### Scenario: Open with a legacy environment preference
- **WHEN** saved preferences contain general or port
- **THEN** the same unified catalog opens without hiding tools or erasing that preference.

### Requirement: Shared discovery and personalization
Home, categories, favorites, recent tools, workspace choices and batch choices SHALL consume the unified registry without deleting saved IDs or duplicating generators.

#### Scenario: Read existing favorites
- **WHEN** saved IDs include CPF and Motorista
- **THEN** both are available together and their saved identifiers remain unchanged.

### Requirement: Stable catalog context
Opening a tool or restoring a history entry SHALL NOT switch the catalog or erase other results and preferences. Legacy environment entry points SHALL NOT reintroduce a split.

#### Scenario: Open a port tool after a general tool
- **WHEN** the user opens Conteiner after CPF
- **THEN** its existing workspace opens and both tools remain discoverable.
