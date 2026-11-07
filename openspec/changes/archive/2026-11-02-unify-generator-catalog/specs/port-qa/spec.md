## MODIFIED Requirements

### Requirement: Concise generators and complete registration
Individual port-domain tools SHALL retain concise identifiers. Cadastro SHALL offer complete entity data through its type selector, using the same engines.

#### Scenario: Generate a concise carrier
- **WHEN** Carrier is activated in Dados cadastrais
- **THEN** the result contains legal name and CNPJ.

#### Scenario: Generate a complete carrier
- **WHEN** Transportadora is selected and generated in Cadastro
- **THEN** its legal/trade names, CNPJ, IE, activity, contact, phone, email, address and test attributes are present without a global context switch.

### Requirement: Port documents
CT-e/XML, CT-e key, Booking, DI, DUIMP, DU-E, seal and cargo documents SHALL remain available in the unified catalog. NF-e and CT-e SHALL remain together without changing existing fiscal generation.

#### Scenario: Access existing documents
- **WHEN** a user accesses document tools
- **THEN** their existing engines remain available and both fiscal forms remain together.

## REMOVED Requirements

### Requirement: Environment boundary
**Reason:** The user replaced global environment switching with one catalog.
**Migration:** Use the unified catalog and explicit registration type selection.

## ADDED Requirements

### Requirement: Port tools in the unified catalog
Port profiles, companies, vehicles, containers, cargo and documents SHALL be discoverable alongside general-purpose tools. Registry, search, favorites, recent tools, batches, export and commands SHALL reuse existing domain engines without a global environment boundary.

#### Scenario: Discover port capabilities
- **WHEN** a user searches or browses the unified catalog
- **THEN** port tools are reachable without changing application context.
