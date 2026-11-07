# Spec: QA Portuário

## Purpose

Define the synthetic people, companies, assets, cargo and documents available in the unified catalog as port-domain tools.

## Requirements

### Requirement: Scope

QA Portuário SHALL specialize in synthetic data for terminals, REDEX, bonded facilities, logistics systems, Gate, yard, scheduling and cargo operations.

#### Scenario: Use the port environment

- **WHEN** a user works in QA Portuário
- **THEN** the available synthetic data is specialized for the defined port and logistics contexts

### Requirement: People

QA Portuário SHALL support synthetic Driver, Operator, Visitor and Person profiles with CPF, RG, CNH, phone, e-mail, badge and complete data where applicable.

#### Scenario: Generate a port person profile

- **WHEN** a supported Driver, Operator, Visitor or Person profile is generated
- **THEN** it contains the applicable listed identity, contact, badge and qualification data

### Requirement: Concise generators and complete registration
Individual port-domain tools SHALL retain concise identifiers. Cadastro SHALL offer complete entity data through its type selector, using the same engines.

#### Scenario: Generate a concise carrier
- **WHEN** Carrier is activated in Dados cadastrais
- **THEN** the result contains legal name and CNPJ.

#### Scenario: Generate a complete carrier
- **WHEN** Transportadora is selected and generated in Cadastro
- **THEN** its legal/trade names, CNPJ, IE, activity, contact, phone, email, address and test attributes are present without a global context switch.

### Requirement: Companies

QA Portuário SHALL support Carrier, Client, Depositor, Importer and Exporter with CNPJ, IE, legal/trade names, contacts, address and test attributes.

#### Scenario: Generate a port company

- **WHEN** a supported port company type is generated
- **THEN** it contains the listed registration, naming, contact, address and test attributes

### Requirement: Vehicles

QA Portuário SHALL support tractor, trailer, tractor+trailer set, plates, RENAVAM and vehicle type.

#### Scenario: Generate a port vehicle

- **WHEN** a tractor, trailer or tractor-and-trailer set is generated
- **THEN** its applicable plates, RENAVAM and vehicle type are available

### Requirement: Containers

Support container number/check digit, type, ISO, seal, tare, gross weight and other properties; types include 20', 40', 40HC, Reefer, Dry, Open Top and Flat Rack. When applicable, numbers SHALL be consistent with ISO 6346 and check digit validation.

#### Scenario: Generate a container

- **WHEN** a supported container type is generated
- **THEN** its number, check digit, type, ISO, seal, tare, gross weight and applicable properties are available
- **AND** its number is consistent with ISO 6346 and check digit validation when applicable

#### Scenario: Avoid duplicate container generators

- **WHEN** the user browses the individual QA Portuário generators
- **THEN** Container, Container and seal, and Seal are available without a duplicate Detailed container option
- **AND** the complete container attributes remain available from General Registration

### Requirement: Cargo

QA Portuário SHALL support Loose Cargo, Solid Bulk, Liquid Bulk and Containerized Cargo with description, quantity, package type, net/gross weight, unit and NCM.

#### Scenario: Generate port cargo

- **WHEN** a supported cargo type is generated
- **THEN** its description, quantity, package type, weights, unit and NCM are available

### Requirement: NCM

Users SHALL be able to manually add multiple NCMs, remove individual entries, validate format and use manually added values in generation rather than being restricted to presets.

#### Scenario: Use manually managed NCMs

- **WHEN** a user adds valid NCMs and removes an individual entry
- **THEN** the remaining manually added values are available for generation instead of being restricted to presets

### Requirement: Port documents
CT-e/XML, CT-e key, Booking, DI, DUIMP, DU-E, seal and cargo documents SHALL remain available in the unified catalog. NF-e and CT-e SHALL remain together without changing existing fiscal generation.

#### Scenario: Access existing documents
- **WHEN** a user accesses document tools
- **THEN** their existing engines remain available and both fiscal forms remain together.

### Requirement: Port tools in the unified catalog
Port profiles, companies, vehicles, containers, cargo and documents SHALL be discoverable alongside general-purpose tools. Registry, search, favorites, recent tools, batches, export and commands SHALL reuse existing domain engines without a global environment boundary.

#### Scenario: Discover port capabilities
- **WHEN** a user searches or browses the unified catalog
- **THEN** port tools are reachable without changing application context.
