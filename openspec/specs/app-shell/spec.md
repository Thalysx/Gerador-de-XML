# Spec: Application Shell and Visual Identity

## Requirements
### FUTURE G identity
The application SHALL use FUTURE G as the product identity.

### Visual language
The UI SHALL use a coherent visual system with defined cards, standardized inputs/buttons/icons, consistent spacing and hierarchy, and clear hover/focus/selected/error/success states. Geradores Gerais SHALL use the original purple identity in light and dark themes; QA Portuário SHALL use the blue identity inspired by the iPORT ecosystem without copying existing screens literally.

### Theme
Existing light/dark theme capability SHALL be preserved when present.

### Shared shell
Both environments SHALL use a shared application shell and design system while allowing environment-specific content.

### Responsive behavior
The shell SHALL support desktop, notebook, tablet and mobile. On mobile the sidebar MAY become a drawer; content MUST not overflow horizontally without an intentional responsive solution.

The fixed navigation SHALL remain vertically reachable when its content exceeds the viewport, including browser zoom and short desktop windows.

### Public development assets
The local development server SHALL serve the public HTML, CSS, JavaScript, web manifest and referenced SVG/PNG brand assets with appropriate content types while rejecting backend scripts, tests, configuration and secrets.

#### Scenario: Load the application locally
- **WHEN** the application opens through the local development server
- **THEN** the manifest, favicon and active environment brand mark load successfully
- **AND** non-public project files remain unavailable
