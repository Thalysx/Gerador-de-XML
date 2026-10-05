## MODIFIED Requirements

### Requirement: Direct generation
The system SHALL execute simple deterministic generators directly when the user activates the generator option, unless configuration is required.

#### Scenario: CPF
- GIVEN the user is on a generator page
- WHEN CPF is activated
- THEN a synthetic CPF is generated immediately
- AND the result panel is updated
- AND no global Generate action is required.

#### Scenario: Activate a badge
- **WHEN** the user activates Crachá from a generator option, Home or search
- **THEN** one synthetic badge is generated immediately with the retained model and barcode options
- **AND** the Generate button and optional Ctrl+Enter shortcut remain available for regeneration
- **AND** opening the generator solely for navigation does not generate a new result.

### Requirement: Task-first workspaces

Each workspace SHALL keep its primary task, essential configuration and persistent result directly available. Optional settings, full cadastro editing, dashboards and complementary result actions outside XML Fiscal SHALL use named secondary disclosures closed by default. Closing a disclosure SHALL NOT disable its controls, change their values or remove them from generation, validation, exports or restoration. Existing primary generator discovery and environment isolation SHALL be preserved.

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
- **AND** favorites, environment metrics and activity remain accessible in secondary disclosures
- **AND** no stored personalization or activity is removed.

#### Scenario: Use the restored XML Fiscal workspace
- **WHEN** the user opens XML Fiscal
- **THEN** document selection, saved scenarios, manual NCM and applicable XML fields are directly available in the previous workspace organization
- **AND** Copy, Download, Validate and Open Editor are visible without a secondary disclosure
- **AND** edited fields, validation, exports, history and both environments retain their existing behavior
- **AND** the workspace adapts to narrow screens without horizontal overflow.

### Requirement: Contextual action hierarchy

Each functional section SHALL prefer one blue primary action, neutral bordered secondary actions and low-emphasis ghost actions. Complementary result actions outside XML Fiscal SHALL remain reachable through a named disclosure with keyboard support. XML Fiscal SHALL expose its result actions directly. Dismissal by Escape SHALL close the disclosure and return focus to its trigger; dismissing or closing SHALL NOT execute an action or alter generated data.

#### Scenario: Use complementary result actions
- **WHEN** the user opens More actions on a result
- **THEN** regeneration, details, editing or clearing actions are available as appropriate
- **AND** closing with Escape returns focus to the trigger without altering the result.

#### Scenario: Navigate from a contextual action
- **WHEN** the user activates Open Editor directly from the XML result
- **THEN** keyboard focus moves to the visible Editor workspace
- **AND** the generated XML remains available in the generator and is copied into the Editor.
