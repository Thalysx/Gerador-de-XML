# Delta: ai-assistant

## ADDED Requirements

### Requirement: Multiline unified composer

The assistant composer SHALL use an auto-growing multiline field with Enter to send, Shift+Enter to insert a line break and empty submission blocked. Mode, mask and new-conversation controls SHALL remain grouped with the message field.

#### Scenario: Send with Enter
- **WHEN** the composer contains a non-empty request and the user presses Enter without Shift
- **THEN** the request is submitted
- **AND** focus returns to the composer after completion

#### Scenario: Insert a line break
- **WHEN** the user presses Shift+Enter while editing a request
- **THEN** the request is not submitted
- **AND** multiline editing remains available

### Requirement: Secondary assistant information

Privacy, retention and general provider availability information SHALL remain accessible outside the main conversation flow. Runtime errors and real processing status MAY appear contextually near the composer.

#### Scenario: Review privacy information
- **WHEN** the user opens application settings
- **THEN** the privacy and retention explanation is available
- **AND** the conversation is not interrupted by a permanent drawer or availability bar
