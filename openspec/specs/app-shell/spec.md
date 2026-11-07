# Spec: Application Shell and Visual Identity

## Purpose

Define the shared FUTURE G shell, visual identity, responsive behavior and public development asset boundary.

## Requirements

### Requirement: FUTURE G identity

The application SHALL use FUTURE G as the product identity.

#### Scenario: Present the product identity

- **WHEN** the application shell is displayed
- **THEN** FUTURE G is presented as the product identity

### Requirement: Visual language
The catalog SHALL use shared neutral surfaces in light/dark themes, blue for actions/selection/focus and consistent inputs, buttons, spacing, type and radii. Green, amber and red SHALL indicate success, warning and error with text or icons. Decorative gradients, glow and nested result-field boxes SHALL remain absent. Historical AI accent tokens MAY remain without reactivating remote AI.

#### Scenario: Read tools across categories
- **WHEN** a user browses the unified catalog
- **THEN** FUTURE G colors, typography and interaction hierarchy remain shared.

#### Scenario: Interpret feedback
- **WHEN** success, warning or error feedback appears
- **THEN** color is paired with text or icons and readable contrast and keyboard focus remain available.

### Requirement: Theme

Existing light/dark theme capability SHALL be preserved when present.

#### Scenario: Change the application theme

- **WHEN** an existing light or dark theme is selected
- **THEN** the application preserves and applies that theme capability

### Requirement: Shared shell
All tools SHALL share one FUTURE G shell and catalog, retaining existing light/dark themes and the brand's colors and typography.

#### Scenario: Navigate between domains
- **WHEN** the user moves between general-purpose and port-domain tools
- **THEN** the shell and catalog remain shared without changing the application context.

### Requirement: Responsive behavior

The shell SHALL support desktop, notebook, tablet and mobile. On mobile the sidebar MAY become a drawer; content MUST not overflow horizontally without an intentional responsive solution.

The fixed navigation SHALL remain vertically reachable when its content exceeds the viewport, including browser zoom and short desktop windows.

#### Scenario: Use the shell in a constrained viewport

- **WHEN** the application is viewed on mobile, with browser zoom, or in a short desktop window
- **THEN** content does not overflow horizontally without an intentional responsive solution
- **AND** the complete fixed navigation remains vertically reachable

### Requirement: Public development assets

The local development server SHALL serve the public HTML, CSS, JavaScript, web manifest and referenced SVG/PNG brand assets with appropriate content types while rejecting backend scripts, tests, configuration and secrets.

#### Scenario: Load the application locally

- **WHEN** the application opens through the local development server
- **THEN** the manifest, favicon and FUTURE G brand mark load successfully
- **AND** non-public project files remain unavailable
