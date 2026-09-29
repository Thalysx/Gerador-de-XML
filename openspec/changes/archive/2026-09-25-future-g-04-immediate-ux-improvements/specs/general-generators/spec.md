# Spec Delta

## MODIFIED Requirements

### Requirement: Entity-oriented naming
Generator section titles SHALL represent entities, including Pessoa física and Pessoa jurídica, while individual action labels such as CPF, RG, CNH and CNPJ remain explicit and independently controlled. Changing a section title MUST NOT implicitly change button labels.

#### Scenario: Rename a section
- **WHEN** the generator catalog renders an entity-oriented section title
- **THEN** the actions inside it retain their registry labels

### Requirement: Unified vehicle plate area
Mercosul and old-pattern plates SHALL live in one discoverable Placa area with an explicit pattern selector. The former old-pattern identifier SHALL remain a compatible direct-entry alias without rendering a second discovery action.

#### Scenario: Select a plate pattern
- **WHEN** the user chooses Mercosul or padrão antigo in the shared plate area
- **THEN** generation and regeneration preserve the selected format

#### Scenario: Open the compatible old-pattern identifier
- **WHEN** an existing favorite, recent item or history opens `placa-antiga`
- **THEN** the shared Placa area opens with padrão antigo selected
