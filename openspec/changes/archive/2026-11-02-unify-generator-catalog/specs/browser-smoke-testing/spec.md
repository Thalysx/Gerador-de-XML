## MODIFIED Requirements

### Requirement: Isolated browser smoke coverage
The development suite SHALL exercise Home generation, catalog/preferences, Cadastro, XML editing/export/import and local commands in Chromium desktop/mobile projects. Each test SHALL start in a fresh browser context without replacing production engines.

#### Scenario: Start a workflow
- **WHEN** a workflow starts after another test
- **THEN** prior favorites, history and generated data are absent unless explicitly initialized
- **AND** existing production controls and engines execute the workflow.
