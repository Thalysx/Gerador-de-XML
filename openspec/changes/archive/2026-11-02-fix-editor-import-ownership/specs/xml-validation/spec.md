## ADDED Requirements

### Requirement: Stable editor import ownership
An asynchronous editor import SHALL retain its initial destination group. Completion SHALL NOT switch a different selected group. Clearing a group SHALL invalidate only its pending imports; resetting the editor SHALL invalidate all pending imports. Every file SHALL settle once on success, failure or abort without hiding valid files in that batch.

#### Scenario: Change group during reading
- **WHEN** a user starts importing into one group and selects another before completion
- **THEN** imported files belong to the original group and the current selection remains unchanged.

#### Scenario: Discard pending imports
- **WHEN** a group is cleared or the editor resets before FileReader finishes
- **THEN** stale callbacks do not recreate discarded files or replace the new session.

#### Scenario: Read a mixed batch
- **WHEN** one file fails or is aborted while another contains valid XML
- **THEN** the valid file remains accessible and the batch reaches a completed state.
