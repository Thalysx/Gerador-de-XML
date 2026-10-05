## MODIFIED Requirements

### Requirement: Full-page assistant

The AI assistant SHALL dedicate the central application area to empty state or conversation and keep suggestions immediately before the lower composer. Attachment, message and send SHALL remain directly available in the composer. Mode, mask, new conversation and privacy SHALL remain accessible through a named secondary disclosure without permanently competing with the conversation.

#### Scenario: Open the AI assistant
- **WHEN** the user opens the AI assistant
- **THEN** the conversation uses the available content area without a redundant outer card
- **AND** message, attachment and send remain visible
- **AND** secondary controls and privacy are accessible on demand
- **AND** the unified composer remains in the lower conversation region.

## ADDED Requirements

### Requirement: Task-first workspaces

Each workspace SHALL keep its primary task, essential configuration and persistent result directly available. Optional settings, full cadastro editing, saved XML scenarios, manual NCM configuration, dashboards and complementary result actions SHALL use named secondary disclosures closed by default. Closing a disclosure SHALL NOT disable its controls, change their values or remove them from generation, validation, exports or restoration. Existing primary generator discovery and environment isolation SHALL be preserved.

#### Scenario: Generate with advanced settings collapsed
- **WHEN** the user generates a document or XML while optional controls are collapsed
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

### Requirement: Contextual action hierarchy

Each functional section SHALL prefer one blue primary action, neutral bordered secondary actions and low-emphasis ghost actions. Complementary result actions SHALL remain reachable through a named disclosure with keyboard support. Dismissal by Escape SHALL close the disclosure and return focus to its trigger; dismissing or closing SHALL NOT execute an action or alter generated data.

#### Scenario: Use complementary result actions
- **WHEN** the user opens More actions on a result
- **THEN** regeneration, details, editing or clearing actions are available as appropriate
- **AND** closing with Escape returns focus to the trigger without altering the result.

#### Scenario: Navigate from a contextual action
- **WHEN** the user opens the Editor from the XML result's More actions
- **THEN** the disclosure closes and keyboard focus moves to the visible Editor workspace
- **AND** the generated XML remains available in the generator and is copied into the Editor.
