## MODIFIED Requirements

### Requirement: Task-first workspaces

Each workspace SHALL keep its primary task, essential configuration and persistent result directly available. Optional settings, full cadastro editing, dashboards and complementary result actions outside XML Fiscal SHALL use named secondary disclosures closed by default. Closing a disclosure SHALL NOT disable its controls, change their values or remove them from generation, validation, exports or restoration. Existing primary generator discovery and category filtering SHALL be preserved.

#### Scenario: Generate with advanced settings collapsed
- **WHEN** the user generates a document while optional controls are collapsed
- **THEN** the existing settings and generators still produce the same kind of output
- **AND** Copy, Download and validation remain accessible
- **AND** expanding advanced controls exposes their retained values.

#### Scenario: Generate by clicking the primary action
- **WHEN** the user selects an individual generator in Dados cadastrais
- **THEN** a named Generate button remains directly available and generates on click
- **AND** Ctrl+Enter remains an optional shortcut without appearing as a required part of the button label
- **AND** simple generator options still generate immediately when activated.

#### Scenario: Generate and then edit a cadastro
- **WHEN** the user opens Cadastro and generates with the visible group or entity selection
- **THEN** the result is shown without requiring the full form to be open
- **AND** a named Edit data action opens the existing form and moves focus to the applicable fields
- **AND** history, field editing and existing export actions remain available.

#### Scenario: Discover tools from a simplified Home
- **WHEN** the user opens Home
- **THEN** search, tools and recent destinations are directly available
- **AND** favorites, catalog metrics and activity remain accessible in secondary disclosures
- **AND** no stored personalization or activity is removed.

#### Scenario: Use the restored XML Fiscal workspace
- **WHEN** the user opens XML Fiscal
- **THEN** document selection, saved scenarios, manual NCM and applicable XML fields are directly available in the previous workspace organization
- **AND** Copy, Download, Validate and Open Editor are visible without a secondary disclosure
- **AND** edited fields, validation, exports, history and the unified catalog retain their existing behavior
- **AND** the workspace adapts to narrow screens without horizontal overflow.

### Requirement: Search placement
Search and category filtering SHALL precede configuration and results, operate on the whole catalog and expose contextual clearing only while a query exists.

#### Scenario: Search tools
- **WHEN** a category or query is applied
- **THEN** only matching catalog entries appear.

#### Scenario: Clear a filter
- **WHEN** search is cleared
- **THEN** category filtering resets and the complete discoverable workspace collection is restored.

## REMOVED Requirements

### Requirement: Environment isolation
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

## ADDED Requirements

### Requirement: Registration composition by type
The personal profile SHALL retain its existing groups without receiving domain-specific fields. Complete domain entities SHALL use their existing forms and engines, selected inside Cadastro without a global environment switch.

#### Scenario: Select a personal profile
- **WHEN** Perfil pessoal is selected
- **THEN** the five existing groups and retained values are available.

#### Scenario: Select a complete entity
- **WHEN** Transportadora or another supported entity is selected
- **THEN** its complete form is available without changing the catalog.
