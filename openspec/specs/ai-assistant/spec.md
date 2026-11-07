# Local Command Assistant

## Purpose

Define deterministic local commands for synthetic data, isolated XML generation, attachment queries, local validation and reusable QA requests without remote model or session dependencies.

## Requirements

### Requirement: Reachable attached command controls
The local command composer SHALL display a pending attachment on its own row within the existing form. Long filenames MAY truncate, while Remove and Send SHALL remain reachable and the message SHALL retain usable width on narrow screens. Clicking Send SHALL preserve the same command and error behavior as Enter.

#### Scenario: Send with a long attachment filename
- **WHEN** an XML attachment has a long name and the user clicks Send on a narrow screen
- **THEN** Send remains inside the form without overlap and the command executes normally
- **AND** rejected commands preserve the draft and attachment for review.

### Requirement: Chat auto-scroll respects user position
New local command messages and result updates SHALL auto-follow while the user remains near the bottom of the active conversation. If the user manually scrolls upward, rendering MUST preserve that reading position and SHALL resume following only after the user returns near the bottom.

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
- **WHEN** a local command fails before being completed
- **THEN** the explicit pending attachment remains available for review or retry

### Requirement: Multiline unified composer

The assistant composer SHALL use an auto-growing multiline field with Enter to send, Shift+Enter to insert a line break and empty submission blocked. Catalog, mask and new-conversation controls SHALL remain grouped with the message field.

#### Scenario: Send with Enter
- **WHEN** the composer contains a non-empty request and the user presses Enter without Shift
- **THEN** the request is submitted
- **AND** focus returns to the composer after completion

#### Scenario: Insert a line break
- **WHEN** the user presses Shift+Enter while editing a request
- **THEN** the request is not submitted
- **AND** multiline editing remains available

### Requirement: Secondary assistant information

Privacy, retention and local processing information SHALL remain accessible outside the main conversation flow. Runtime errors and real processing status MAY appear contextually near the composer.

#### Scenario: Review privacy information
- **WHEN** the user opens application settings
- **THEN** the privacy and retention explanation is available
- **AND** the conversation is not interrupted by a permanent drawer or availability bar

### Requirement: Local command execution
Supported commands SHALL execute locally across the whole catalog without model or chat/status requests. Quantities, accent-insensitive names and existing options SHALL remain supported. Unknown text and totals outside 1 to 500 MUST fail before generation. Remote assistant endpoints SHALL remain retired.

#### Scenario: Generate across domains
- **WHEN** the user requests 3 CPFs and 2 Transportadoras
- **THEN** all five records are available without switching context or contacting a remote assistant.

#### Scenario: Reject partial commands
- **WHEN** a request contains unknown text or an unsupported generator
- **THEN** no partial data is generated and the draft and attachment remain editable.

### Requirement: XML command artifacts
The assistant SHALL generate isolated NF-e with 1 to 20 products and CT-e test artifacts; summarize XML; show products or recipients; validate syntax and local rules; and optionally show only errors. Source selection SHALL distinguish attached XML, current fiscal XML and the latest local XML result. Missing or unsupported sources MUST produce actionable guidance. Generation SHALL preserve fiscal form values and generated source XML. Results SHALL expose copy, download, local validation and editor actions. Validation MUST state its local scope without claiming XSD or SEFAZ approval.

#### Scenario: Generate an isolated invoice
- **WHEN** the user requests an NF-e with 3 products
- **THEN** an XML download containing 3 products is produced without changing fiscal fields or source XML.

#### Scenario: Query or validate an attachment
- **WHEN** the user attaches supported XML and requests its summary, products, recipient or local validation
- **THEN** the requested information is rendered safely without external requests or changing the attachment.

### Requirement: Negative XML copies
The assistant SHALL create clearly identified negative copies using the existing invalid CPF, CNPJ, access key, missing field, invalid format, invalid tag and malformed XML variants. The original attachment, current fiscal XML and prior artifacts MUST remain unchanged. Missing target fields MUST report that a variant cannot be applied instead of returning an unchanged copy.

#### Scenario: Remove a mandatory field
- **WHEN** the user requests a copy without the emitter name
- **THEN** a separately named negative XML removes that field and the source remains intact.

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
