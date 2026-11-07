# Navigation

## Purpose

Define accessible unified navigation and discovery behavior for the shared FUTURE G application shell.

## Requirements

### Requirement: Expandable sidebar
The sidebar SHALL show FUTURE G identity, named tool groups and an icon-based collapse control. Its compact state SHALL show icons with accessible names/tooltips and increase usable content width. Collapse state SHALL persist without an environment selector.

#### Scenario: Collapse and restore navigation
- **WHEN** the user collapses navigation and reloads
- **THEN** the compact state remains usable by keyboard with an accessible expand control.

### Requirement: Unified catalog navigation
The shell SHALL expose one catalog containing existing general-purpose and port-domain tools. It SHALL NOT offer a global Geral/QA Portuario switch.

#### Scenario: Open with a legacy environment preference
- **WHEN** saved preferences contain general or port
- **THEN** the same unified catalog opens without hiding tools or erasing that preference.

### Requirement: Global search
Global search SHALL discover tools and destinations across the whole catalog. Ctrl+K, Arrow keys, Enter, Escape, focus containment and focus restoration SHALL remain supported.

#### Scenario: Find tools across domains
- **WHEN** the user searches for CPF or Transportadora
- **THEN** the matching tool is reachable without a context switch.

#### Scenario: Navigate global search by keyboard
- **WHEN** the user opens search with Ctrl+K
- **THEN** focus moves to the query, Arrow keys change the result, Enter opens it, Escape restores prior focus and Tab stays contained.

### Requirement: Native search button activation
Global search SHALL intercept Enter for result selection only from the query field outside text composition. Buttons SHALL retain native keyboard activation and their own click handlers. Closing search SHALL restore prior focus without navigating or generating data.

#### Scenario: Close without executing the selected result
- **WHEN** the user focuses Close and presses Enter or Space
- **THEN** search closes and prior focus returns without opening a tool or generating data.

#### Scenario: Activate a focused result
- **WHEN** the user tabs to a result different from the query selection and presses Enter
- **THEN** that focused result is activated once through its own click handler.

#### Scenario: Confirm composed query text
- **WHEN** Enter is received while the query is composing text
- **THEN** no result is activated and search remains open.

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

### Requirement: Reachable navigation and predictable panel position
Every visible navigation destination SHALL remain reachable by keyboard and scrolling when the sidebar is taller than the viewport. Opening another primary panel SHALL place the document at the top instead of preserving an unrelated scroll position from the previous panel.

#### Scenario: Navigate in a short viewport
- **WHEN** zoom or viewport height makes the sidebar taller than the visible area
- **THEN** the user can scroll the navigation to every available destination

#### Scenario: Change primary panel after scrolling
- **WHEN** the user scrolls one panel and opens another primary panel
- **THEN** the new panel starts at the top of the document
