## ADDED Requirements

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
