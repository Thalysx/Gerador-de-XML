## ADDED Requirements

### Requirement: Reachable attached command controls
The local command composer SHALL display a pending attachment on its own row within the existing form. Long filenames MAY truncate, while Remove and Send SHALL remain reachable and the message SHALL retain usable width on narrow screens. Clicking Send SHALL preserve the same command and error behavior as Enter.

#### Scenario: Send with a long attachment filename
- **WHEN** an XML attachment has a long name and the user clicks Send on a narrow screen
- **THEN** Send remains inside the form without overlap and the command executes normally
- **AND** rejected commands preserve the draft and attachment for review.
