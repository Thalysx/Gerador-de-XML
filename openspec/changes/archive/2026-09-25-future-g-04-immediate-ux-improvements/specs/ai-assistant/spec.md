# Spec Delta

## MODIFIED Requirements

### Requirement: Chat auto-scroll respects user position
New local messages and AI response updates SHALL auto-follow while the user remains near the bottom of the active conversation. If the user manually scrolls upward, rendering MUST preserve that reading position and SHALL resume following only after the user returns near the bottom.

#### Scenario: Read an earlier message during streaming
- **WHEN** the user scrolls upward while a response is arriving
- **THEN** the interface stops forcing the latest content into view until the user returns near the bottom

#### Scenario: Resume following the conversation
- **WHEN** the user returns near the bottom before another conversation update
- **THEN** the active conversation follows the newest content

### Requirement: Integrated attachment action
The chat SHALL provide a keyboard-operable `+` attachment action integrated with the composer, including adding a local XML file and a current generated XML. A pending attachment SHALL appear as a removable item associated with the next message, and the dedicated always-visible XML-only attachment area SHALL be removed.

#### Scenario: Review an attachment before sending
- **WHEN** the user adds a supported attachment
- **THEN** its name and size appear beside the composer with an action to remove it

#### Scenario: Keep an attachment after a recoverable failure
- **WHEN** a remote request fails before being completed
- **THEN** the explicit pending attachment remains available for review or retry
