# Spec: QA Portuário

## Purpose

Define the synthetic people, companies, assets, cargo and documents available within the QA Portuário environment.

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

Individual QA Portuário generators SHALL show only the essential identifiers needed for quick use. General Registration SHALL remain available in QA Portuário and SHALL contain the complete profile, company, vehicle, container, cargo or cargo-document data produced by the same domain engines.

#### Scenario: Generate a carrier from the individual generator

- **WHEN** a user activates Carrier in the data-generator workspace
- **THEN** the result contains only legal name and CNPJ

#### Scenario: Generate a complete carrier registration

- **WHEN** a user selects Carrier in General Registration while QA Portuário is active
- **THEN** the registration includes legal and trade names, CNPJ, IE, activity, contact, phone, e-mail, address and test attributes

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

Centralize CT-e/XML, CT-e key, Booking, DI, DUIMP, DU-E, seal and cargo documents. Existing CT-e XML generation SHALL remain available without functional loss. NF-e and CT-e XML forms SHALL remain together and SHALL NOT be divided by the active environment switch.

#### Scenario: Access documents in each environment

- **WHEN** a user accesses the centralized port-document tools
- **THEN** CT-e/XML, CT-e key, Booking, DI, DUIMP, DU-E, seal and cargo documents are available without loss of existing CT-e generation
- **AND** NF-e and CT-e remain available together in the XML workspace in either environment

### Requirement: Environment boundary

All port profiles, companies, vehicles, containers, cargo and port documents SHALL be discoverable only in QA Portuário. Registry, search, favorites, recent tools, batch generation, export and the Assistant SHALL honor the active environment without duplicating domain engines.

#### Scenario: Discover port capabilities

- **WHEN** registry-driven surfaces operate in either product environment
- **THEN** port capabilities are discoverable only in QA Portuário
- **AND** registry, search, favorites, recents, batches, exports and the Assistant honor the active environment without duplicate domain engines
