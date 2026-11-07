## MODIFIED Requirements

### Requirement: Local command execution
Supported commands SHALL execute locally across the whole catalog without model or chat/status requests. Quantities, accent-insensitive names and existing options SHALL remain supported. Unknown text and totals outside 1 to 500 MUST fail before generation. Remote assistant endpoints SHALL remain retired.

#### Scenario: Generate across domains
- **WHEN** the user requests 3 CPFs and 2 Transportadoras
- **THEN** all five records are available without switching context or contacting a remote assistant.

#### Scenario: Reject partial commands
- **WHEN** a request contains unknown text or an unsupported generator
- **THEN** no partial data is generated and the draft and attachment remain editable.

### Requirement: Discoverable reusable commands
The assistant SHALL provide one searchable catalog, reviewable suggestions, examples, help, repeat-last-successful-command and up to 20 favorite command texts. Selection SHALL only fill the composer. Repeat SHALL NOT recurse. Favorites SHALL contain bounded command text only. Conversation retention SHALL remain ten exchanges; clearing SHALL discard repeat context and attachments.

#### Scenario: Consolidate legacy favorites
- **WHEN** unified favorites have not been saved
- **THEN** the distinct valid texts of both legacy lists are available without deleting those lists or losing their twenty supported entries.

#### Scenario: Remove a migrated favorite
- **WHEN** a favorite is removed from the unified list and the application reloads
- **THEN** that item does not reappear from its legacy list.

#### Scenario: Review a favorite
- **WHEN** the user selects a saved command
- **THEN** its text fills the composer without automatic execution.
