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

### Requirement: Search placement
Search SHALL appear before the generator collection and SHALL respect the active environment.

#### Scenario: Search the active environment
- GIVEN the user is viewing the generator collection for an environment
- WHEN the user enters a search term
- THEN the search is positioned before the collection
- AND only matching generators available in the active environment are shown.

### Requirement: Primary content visibility
Primary categories SHALL remain directly discoverable. Accordions SHALL be reserved for secondary or advanced content.

#### Scenario: Browse primary generator categories
- GIVEN the user opens a generator page
- WHEN the primary generator categories are rendered
- THEN the categories and their options are directly visible
- AND an accordion is used only for secondary or advanced content.

### Requirement: Full-page assistant
The AI assistant SHALL use the available application content area without a redundant outer chat card, while retaining FUTURE G navigation.

#### Scenario: Open the AI assistant
- GIVEN the FUTURE G shell is visible
- WHEN the user opens the AI assistant
- THEN the conversation uses the available content area without a redundant outer card
- AND the FUTURE G navigation remains available
- AND the composer remains in the lower conversation region.

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
