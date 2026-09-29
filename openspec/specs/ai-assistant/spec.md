# AI Assistant

## Purpose

Define complementary AI and deterministic local assistance for synthetic data, XML and QA work without making remote models a dependency for basic generators.

## Requirements

### Requirement: AI remains complementary
Remote AI SHALL remain optional and MUST NOT be required for deterministic operations such as UUID, synthetic CPF generation or random numbers. AI use cases MAY include custom test data, XML explanation, analysis or modification, test scenario suggestions, variations, transformations, JSON or XML payload generation and QA assistance.

#### Scenario: Perform a deterministic request
- **WHEN** the user requests a deterministic operation supported locally
- **THEN** the application can complete it without remote AI availability

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

### Requirement: Existing assistant parity after migration
The FUTURE G assistant SHALL preserve deterministic local mode, optional remote AI mode, explicit attachments, reviewable suggestions, safe text rendering, result actions and conversation continuity. Remote AI MUST NOT be required for deterministic generators.

#### Scenario: Use the local assistant
- **WHEN** the user requests a supported deterministic generator in local mode
- **THEN** the existing local engine produces the result without contacting a remote model

#### Scenario: Continue a remote conversation
- **WHEN** remote AI is configured and the user continues an existing session
- **THEN** the server-side session preserves the supported conversation context without exposing provider credentials to the browser

### Requirement: Recoverable assistant failures
Network failure, missing configuration, timeout, rate limit and expired session SHALL preserve the user's current draft and explicit attachments and SHALL present a recoverable product message without exposing stack traces, package commands, API keys or provider secrets.

#### Scenario: Remote service is unavailable
- **WHEN** the remote assistant cannot complete a request
- **THEN** the user can retry explicitly or use local mode while the unsent draft and attachments remain available
