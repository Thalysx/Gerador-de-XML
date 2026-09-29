# Spec: QA Portuário

## Scope
QA Portuário SHALL specialize in synthetic data for terminals, REDEX, bonded facilities, logistics systems, Gate, yard, scheduling and cargo operations.

## People
Support synthetic Driver, Operator, Visitor and Person profiles with CPF, RG, CNH, phone, e-mail, badge and complete data where applicable.

## Companies
Support Carrier, Client, Depositor, Importer and Exporter with CNPJ, IE, legal/trade names, contacts, address and test attributes.

## Vehicles
Support tractor, trailer, tractor+trailer set, plates, RENAVAM and vehicle type.

## Containers
Support container number/check digit, type, ISO, seal, tare, gross weight and other properties; types include 20', 40', 40HC, Reefer, Dry, Open Top and Flat Rack. When applicable, numbers SHALL be consistent with ISO 6346 and check digit validation.

## Cargo
Support Loose Cargo, Solid Bulk, Liquid Bulk and Containerized Cargo with description, quantity, package type, net/gross weight, unit and NCM.

## NCM
Users SHALL be able to manually add multiple NCMs, remove individual entries, validate format and use manually added values in generation rather than being restricted to presets.

## Port documents
Centralize CT-e/XML, CT-e key, Booking, DI, DUIMP, DU-E, seal and cargo documents. Existing CT-e XML generation SHALL migrate without functional loss. NF-e and its access key SHALL remain exclusive to General Generators.

## Environment boundary
All port profiles, companies, vehicles, containers, cargo and port documents SHALL be discoverable only in QA Portuário. Registry, search, favorites, recent tools, batch generation, export and the Assistant SHALL honor the active environment without duplicating domain engines.
