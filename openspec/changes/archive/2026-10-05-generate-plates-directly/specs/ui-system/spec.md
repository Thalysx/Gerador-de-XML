## MODIFIED Requirements

### Requirement: Direct generation
The system SHALL execute simple deterministic generators directly when the user activates the generator option, unless configuration is required.

#### Scenario: CPF
- GIVEN the user is on a generator page
- WHEN CPF is activated
- THEN a synthetic CPF is generated immediately
- AND the result panel is updated
- AND no global Generate action is required.

#### Scenario: Activate a badge
- **WHEN** the user activates Crachá from a generator option, Home or search
- **THEN** one synthetic badge is generated immediately with the retained model and barcode options
- **AND** the Generate button and optional Ctrl+Enter shortcut remain available for regeneration
- **AND** opening the generator solely for navigation does not generate a new result.

#### Scenario: Activate a plate
- **WHEN** the user activates Placa from its option, Home or global search
- **THEN** one synthetic plate is generated immediately in the selected Mercosul or old format
- **AND** the format selector, Generate button and optional Ctrl+Enter remain available
- **AND** an explicit old-format option selects the old format
- **AND** opening solely for navigation does not generate another result.
