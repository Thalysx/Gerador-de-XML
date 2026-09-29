# Spec Delta

## ADDED Requirements

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
