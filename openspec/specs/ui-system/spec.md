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

The AI assistant SHALL dedicate the central application area to empty state or conversation, SHALL keep suggestions immediately before the lower composer and SHALL group attachment, message, send, mode, mask and new-conversation controls inside that composer.

#### Scenario: Open the AI assistant
- GIVEN the FUTURE G shell is visible
- WHEN the user opens the AI assistant
- THEN the conversation uses the available content area without a redundant outer card
- AND no permanent controls or privacy drawer interrupt the conversation
- AND the unified composer remains in the lower conversation region.

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
