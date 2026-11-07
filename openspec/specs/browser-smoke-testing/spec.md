# Spec: Browser Smoke Testing

## Purpose

Define isolated browser regression coverage for existing FUTURE G workflows, with inspectable failures and independent accounting of fiscal checks.

## Requirements

### Requirement: Isolated browser smoke coverage
The development suite SHALL exercise Home generation, catalog/preferences, Cadastro, XML editing/export/import and local commands in Chromium desktop/mobile projects. Each test SHALL start in a fresh browser context without replacing production engines.

#### Scenario: Start a workflow
- **WHEN** a workflow starts after another test
- **THEN** prior favorites, history and generated data are absent unless explicitly initialized
- **AND** existing production controls and engines execute the workflow.

### Requirement: Real result actions
Smoke tests SHALL compare clipboard and downloaded contents with the displayed/generated synthetic result, preserving the fiscal source when editing a copy.

#### Scenario: Export an edited copy
- **WHEN** a generated XML is opened in the editor, edited, exported and imported
- **THEN** the downloaded XML contains the edit and remains parseable
- **AND** the original generated source remains unchanged.

### Requirement: Inspectable isolated failures
Failures SHALL retain traces and screenshots outside the public build. Tests SHALL have zero automatic retries and SHALL reject unexpected external requests or application JavaScript errors.

#### Scenario: Investigate a failure
- **WHEN** a browser assertion fails
- **THEN** evidence is retained under ignored artifacts
- **AND** the failure is not hidden by an automatic retry.

### Requirement: Honest accounting of existing failures
The suite SHALL preserve the existing Node test command and SHALL NOT ignore or weaken preexisting fiscal failures to claim overall approval.

#### Scenario: Report all checks
- **WHEN** browser, Node, build and audit checks finish
- **THEN** each result is reported separately
- **AND** successful smoke tests alone do not imply fiscal validation approval.

### Requirement: Verified audit screenshot identity
Saved audit screenshots SHALL verify a unique visible/active panel, selected tab, theme and catalog against declared expectations before capture. Declared viewport and sidebar expectations SHALL also be checked. A mismatch SHALL prevent image capture and writing. Each run SHALL record observed state and image hashes in a manifest marked incomplete until the capture sequence finishes.

#### Scenario: Save the dark Home capture after a document result
- **WHEN** the audit captures dark Home after exercising a document result
- **THEN** it selects Home and dark theme and resets page scroll before verifying state
- **AND** the saved image and manifest identify Home rather than the previous document panel

#### Scenario: Refuse a mislabeled capture
- **WHEN** actual panel, selected tab, theme, catalog or a declared viewport/sidebar differs from the expected state
- **THEN** capture fails before requesting or writing the image
- **AND** the run manifest does not claim a completed capture sequence
