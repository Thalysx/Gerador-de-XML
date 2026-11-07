## ADDED Requirements

### Requirement: Validation upload ownership
Starting a replacement analysis SHALL invalidate previous upload results and release its busy controls. Only the current upload SHALL publish results or release controls of that upload. A stale file read SHALL NOT initiate XSD processing after replacement.

#### Scenario: Replace upload with pasted XML
- **WHEN** file reading is pending and the user validates pasted XML
- **THEN** upload controls become available and the pasted report remains authoritative after the old read completes.

#### Scenario: Finish an old upload during a new one
- **WHEN** a second upload is reading and the superseded upload finishes
- **THEN** the second upload retains its busy state until its own completion.
