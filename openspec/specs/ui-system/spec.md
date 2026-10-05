# ui-system Specification

## Purpose
Define the FUTURE G interaction system for direct and configured generation, persistent results, visible discovery, full-area assistance, functional feedback, accessibility and separation between general and port-specific experiences.

## Requirements

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

#### Scenario: Activate a plate
- **WHEN** the user activates Placa from its option, Home or global search
- **THEN** one synthetic plate is generated immediately in the selected Mercosul or old format
- **AND** the format selector, Generate button and optional Ctrl+Enter remain available
- **AND** an explicit old-format option selects the old format
- **AND** opening solely for navigation does not generate another result.

### Requirement: Persistent result
The result area SHALL be present before and after generation.

#### Scenario: Empty result
- GIVEN nothing has been generated
- WHEN the page opens
- THEN an empty state is visible
- AND the main layout remains stable.

### Requirement: Structured result presentation
The shared document result area SHALL present structured generator data as semantic field labels and values instead of a raw code, terminal, JSON or TXT block. Technical keys SHALL receive user-facing labels, larger fields MAY span the full result width, and the layout SHALL use two columns when space permits and one column on narrow screens without horizontal overflow. Text that cannot be safely interpreted as structured data SHALL retain a conventional text fallback.

The visual projection SHALL remain independent from the complete text representation used by Copy, TXT download, details and history restoration.

#### Scenario: Render a structured port profile
- GIVEN a port generator returns an object with profile, identity and access fields
- WHEN the result is rendered
- THEN each property is exposed as a semantic label and value
- AND internal underscores are not displayed
- AND the complete textual representation remains available to result actions.

#### Scenario: Render free text
- GIVEN a result does not contain a safely identifiable structured object or field pairs
- WHEN the result is rendered
- THEN it remains readable as conventional text
- AND arbitrary content is not coerced into fields.

### Requirement: Result scroll lifecycle

Every result content replacement SHALL reset the internal scroll to zero immediately and after rendering. The result SHALL NOT receive programmatic focus or an animated outline after generation. Copying, downloading, resizing and manual reading SHALL preserve the current position.

#### Scenario: Generate two long results
- GIVEN the user has scrolled inside a long result
- WHEN another result is generated
- THEN the internal result position returns to zero after rendering
- AND the page position remains unchanged.

#### Scenario: Reformat or restore a result
- GIVEN the result was manually scrolled
- WHEN its content is reformatted or restored from history
- THEN the internal result position returns to zero immediately
- AND no animated outline is shown around the result.

### Requirement: Search placement

Search and category filtering SHALL appear in a shared horizontal region before the configuration/result workspace, SHALL respect the active environment and SHALL expose contextual clearing only while a query exists.

#### Scenario: Search the active environment
- GIVEN the user is viewing Dados cadastrais
- WHEN the user enters a search term
- THEN search and category are positioned above both configuration and result
- AND only matching generators available in the active environment are shown
- AND a named clear action is available in the field while text exists.

#### Scenario: Clear a generator query
- GIVEN the search field contains text
- WHEN the contextual clear action is activated
- THEN the query and category filter are reset
- AND the complete generator collection for the active environment is restored
- AND focus returns to the search field.

### Requirement: Primary content visibility
Primary categories SHALL remain directly discoverable. Accordions SHALL be reserved for secondary or advanced content.

#### Scenario: Browse primary generator categories
- GIVEN the user opens a generator page
- WHEN the primary generator categories are rendered
- THEN the categories and their options are directly visible
- AND an accordion is used only for secondary or advanced content.

### Requirement: Full-page assistant

The local command assistant SHALL dedicate the central application area to empty state or conversation and keep suggestions immediately before the lower composer. Attachment, message and send SHALL remain directly available in the composer. Catalog, favorites, mask, new conversation and privacy SHALL remain accessible through a named secondary disclosure without permanently competing with the conversation.

#### Scenario: Open the AI assistant
- **WHEN** the user opens the local command assistant
- **THEN** the conversation uses the available content area without a redundant outer card
- **AND** message, attachment and send remain visible
- **AND** secondary controls and privacy are accessible on demand
- **AND** the unified composer remains in the lower conversation region.

### Requirement: UI foundations
When compatible with the stack, reusable UI SHALL use shadcn/ui as a technical base and Lucide as the standard icon set, customized to FUTURE G.

#### Scenario: Select compatible UI foundations
- GIVEN the existing application stack has been inspected
- WHEN a reusable component or icon is introduced
- THEN the implementation records whether shadcn/ui and Lucide are compatible
- AND any adopted component follows the FUTURE G tokens and visual language
- AND icon-only actions have an accessible name and a tooltip when needed.

### Requirement: Functional motion
Animations SHALL provide feedback without delaying deterministic generation. Artificial loading SHALL NOT be shown for instant synchronous generators.

#### Scenario: Generate synchronously
- GIVEN the user has not requested reduced motion
- WHEN an instant deterministic generator is activated
- THEN the result may use a brief functional transition
- AND no artificial loading indicator delays the result.

#### Scenario: Prefer reduced motion
- GIVEN the user prefers reduced motion
- WHEN a result or action feedback is rendered
- THEN non-essential animation and smooth scrolling are disabled.

### Requirement: Bounded local icon runtime
The production build SHALL generate a local Lucide runtime containing only icons referenced by the application while preserving the browser API consumed by static and dynamic renderers.

#### Scenario: Build public assets
- GIVEN the application uses the registered Lucide icon set
- WHEN the production build runs
- THEN the generated local runtime contains every required icon
- AND its size remains within the documented 20 KB budget
- AND the interface does not depend on an icon CDN.

### Requirement: Environment isolation
General and port-specific generator composition SHALL remain separated. Cadastro Geral SHALL NOT include port-specific fields unless explicitly required.

#### Scenario: Use Cadastro Geral
- GIVEN the active environment is Geradores Gerais
- WHEN the user opens Cadastro Geral or searches its available components
- THEN port-specific registration fields are not included.

#### Scenario: Use a port-specific generator
- GIVEN the active environment is QA Portuário
- WHEN the user browses or searches port-specific generators
- THEN the appropriate port registration options remain available in that environment.

### Requirement: Compact XML dropzone

The Editor XML SHALL expose one compact visual dropzone while retaining the existing upload behavior.

#### Scenario: Import XML files
- GIVEN no files are loaded in the Editor XML
- WHEN the import state is shown
- THEN exactly one dashed dropzone surface is visible
- AND its desktop width is bounded
- AND selection, multiple files, drag-and-drop, parsing and errors remain available.

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
