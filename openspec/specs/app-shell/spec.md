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

The UI SHALL use shared neutral backgrounds and surfaces in both environments, blue for primary actions, active selection and focus, and purple only for AI-related details. Green SHALL indicate success, amber warnings or partial coverage, and red errors or destructive actions, accompanied by text or icons. Inputs, buttons, spacing, typography and radii SHALL be consistent in light and dark themes, without decorative gradients, glow or nested boxes for individual result fields. Environment identity SHALL remain clear through labels, icons and content isolation.

#### Scenario: Render an environment with its visual language

- **WHEN** a user views Geradores Gerais or QA Portuário
- **THEN** both use neutral surfaces and the same blue interaction hierarchy
- **AND** the active environment remains identifiable by its label and content
- **AND** AI details use purple without tinting the whole assistant page.

#### Scenario: Interpret status feedback
- **WHEN** success, warning or error feedback is shown
- **THEN** its semantic color is paired with a text description or icon
- **AND** readable contrast and visible keyboard focus remain available in both themes.

### Requirement: Theme

Existing light/dark theme capability SHALL be preserved when present.

#### Scenario: Change the application theme

- **WHEN** an existing light or dark theme is selected
- **THEN** the application preserves and applies that theme capability

### Requirement: Shared shell

Both environments SHALL use a shared application shell and design system while allowing environment-specific content.

#### Scenario: Switch product environments

- **WHEN** the active environment changes between Geradores Gerais and QA Portuário
- **THEN** the shared shell and design system remain in use
- **AND** the content may reflect the selected environment

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
- **THEN** the manifest, favicon and active environment brand mark load successfully
- **AND** non-public project files remain unavailable
