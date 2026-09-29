# ncm-management Specification

## Purpose
Define reusable entry, validation, ordering and application behavior for manually supplied NCM values without coupling the capability to a future cargo generator.

## Requirements

### Requirement: Manual multi-NCM management
Users SHALL be able to add multiple manual NCM values, validate the eight-digit format, ignore duplicates, remove individual entries and apply the ordered values to current NF-e product rows instead of being restricted to presets. This capability MUST NOT introduce the later cargo-generator family.

#### Scenario: Apply several valid NCM values
- **WHEN** the user adds multiple valid NCMs and applies them to an NF-e with product rows
- **THEN** each current product receives the corresponding ordered manual value and the generated XML uses those values

#### Scenario: Reject an invalid NCM atomically
- **WHEN** any submitted NCM does not contain exactly eight digits in a supported plain or dotted format
- **THEN** no value from that submission is added and an understandable validation message is shown

#### Scenario: Remove a manual NCM
- **WHEN** the user removes one value from the manual list
- **THEN** the remaining valid entries stay available in their previous order
