## MODIFIED Requirements

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
