# Spec Delta

## MODIFIED Requirements

### Requirement: Person and RG grouping
RG SHALL be treated as Person data alongside CPF while retaining an individual RG generator. State-specific RG rules SHALL be identified to avoid presenting one state format as a national standard. RG and CNH generation SHALL produce values consistent with their declared check-digit rules and SHALL remain available to supported batch and export flows.

#### Scenario: Access RG
- **WHEN** the user browses Person generators
- **THEN** RG is discoverable and can still be generated individually

#### Scenario: Generate RG
- **WHEN** the user generates an RG individually or in a batch
- **THEN** the result uses the identified São Paulo format
- **AND** its check digit is consistent with that format

#### Scenario: Generate CNH
- **WHEN** the user generates a CNH individually or in a batch
- **THEN** the result contains eleven digits
- **AND** both check digits are consistent with the CNH rule

#### Scenario: Discover person documents
- **WHEN** the user browses Person generators
- **THEN** CPF, RG and CNH remain independently discoverable under Pessoa física

## ADDED Requirements

### Requirement: Company, address and vehicle tools
Geradores Gerais SHALL expose Nome fantasia, Endereço completo, CEP and RENAVAM through the shared registry. Each generator SHALL support individual generation, discovery, favorites, recents and supported batch/export flows without creating a parallel engine.

#### Scenario: Generate company and address data
- **WHEN** the user generates a fantasy name, complete address or CEP individually or in a batch
- **THEN** the result is explicitly synthetic, remains available to common result actions and can be exported without truncation

#### Scenario: Generate RENAVAM
- **WHEN** the user generates RENAVAM individually or in a batch
- **THEN** the result contains eleven digits and its check digit is consistent with the declared modulo-11 rule

#### Scenario: Keep environment boundaries
- **WHEN** the user switches between Geradores Gerais and QA Portuário
- **THEN** the new general generators appear only in Geradores Gerais while existing shared and port generators retain their prior availability

### Requirement: Development-safe identifiers and network examples
Geradores Gerais SHALL expose UUID v4, documentation-only IPv4 and IPv6 addresses, and locally administered unicast MAC addresses. Network examples MUST use ranges reserved for documentation rather than arbitrary routable addresses.

#### Scenario: Generate UUID v4
- **WHEN** the user generates a UUID individually or in a batch
- **THEN** the result contains 128 bits represented in canonical text form with version 4 and IETF variant bits

#### Scenario: Generate documentation IP addresses
- **WHEN** the user generates IPv4 or IPv6 examples
- **THEN** IPv4 belongs to TEST-NET-1, TEST-NET-2 or TEST-NET-3 and IPv6 belongs to `2001:db8::/32`

#### Scenario: Generate local MAC address
- **WHEN** the user generates a MAC address
- **THEN** the first octet marks it as locally administered and unicast, without claiming a vendor assignment

#### Scenario: Reuse common workflows
- **WHEN** a development utility is discovered, favorited, generated or exported
- **THEN** it uses the shared registry, result, recent-items and batch/export flows and remains exclusive to Geradores Gerais

### Requirement: Synthetic finance fixtures
Geradores Gerais SHALL expose a synthetic BRL amount, an unregistered Pix EVP-shaped key and an explicitly fictional transaction identifier. This increment MUST NOT generate bank accounts, cards, boletos, credentials or claims of a real financial transaction.

#### Scenario: Generate BRL amount
- **WHEN** the user generates a monetary value individually or in a batch
- **THEN** the result uses a positive BRL presentation suitable for interface and export tests without representing a balance

#### Scenario: Generate synthetic Pix EVP
- **WHEN** the user generates a Pix EVP fixture
- **THEN** the result has UUID v4 form and the product states that it is not registered in DICT

#### Scenario: Generate transaction test identifier
- **WHEN** the user generates a transaction identifier
- **THEN** the value contains an explicit `TESTE` marker, date and random suffix and carries no authorization or settlement meaning

#### Scenario: Keep finance fixtures in common workflows
- **WHEN** a finance fixture is discovered, favorited, generated or exported
- **THEN** it uses the shared general registry and batch/export flows and remains unavailable in QA Portuário

### Requirement: Cadastro Geral selectable registration sheet
Cadastro Geral SHALL let the user select Identificação, Documentos, Contato, Endereço and Dados profissionais independently before generation. The result SHALL present only populated groups as labeled sections in a registration sheet, while preserving individual field generation, copy actions and history.

#### Scenario: Generate selected groups
- **WHEN** the user selects one or more Cadastro Geral groups and generates a registration
- **THEN** fields belonging to the selected groups receive synthetic values
- **AND** fields belonging to unselected groups are cleared
- **AND** the result sheet contains only the populated group sections

#### Scenario: Require a selection
- **WHEN** the user tries to generate with every group cleared
- **THEN** no registration or history entry is created
- **AND** focus and feedback identify the group selection

#### Scenario: Select or clear all groups
- **WHEN** the user activates Select all or Clear selection
- **THEN** all five checkboxes change together
- **AND** a live status reports the selected count

#### Scenario: Restore current and legacy history
- **WHEN** the user restores a registration containing the selected-group metadata
- **THEN** the same groups and sheet are restored
- **WHEN** the user restores a legacy registration without that metadata
- **THEN** the groups are inferred from its populated fields without discarding the record

### Requirement: Extensible synthetic badge generator
Geradores Gerais SHALL expose a Crachá generator whose initial Funcionário model contains a synthetic avatar, name, badge code, company, function, registration, validity and status. It SHALL optionally present a clearly illustrative barcode and SHALL use one model registry that can receive Driver, Visitor and Contractor definitions later without adding a parallel generator engine.

#### Scenario: Generate an employee badge
- **WHEN** the user selects the Funcionário model and generates a badge
- **THEN** a visual badge presents every required synthetic identity field
- **AND** regenerate creates a new badge through the shared result action
- **AND** copy code copies the displayed badge code

#### Scenario: Toggle the illustrative barcode
- **WHEN** the user generates with the barcode option enabled
- **THEN** the badge includes a reference beginning with `TESTE` and an illustrative visual pattern
- **WHEN** the option is disabled
- **THEN** the identity fields remain available and no barcode is presented

#### Scenario: Reuse common badge workflows
- **WHEN** the badge generator is discovered, favorited, restored or used in a batch
- **THEN** it uses the shared registry, history, recent-items, batch and JSON/CSV/TXT export flows
- **AND** structured exports retain the badge fields as separate properties
