# Spec Delta

## MODIFIED Requirements

### Requirement: Batch placement after individual result
The document workspace SHALL present configuration, Generate, individual result and then batch generation in document order. Batch generation SHALL appear after the individual result and before history rather than among the individual configuration controls.

#### Scenario: Navigate individual and batch controls
- **WHEN** the user follows the generator workspace in document order
- **THEN** individual configuration and result precede batch generation

### Requirement: Isolated batch clear
A visible Limpar lote action SHALL clear only the generated batch and its export actions. It MUST NOT reset generator configuration, individual result, history or the selected generator.

#### Scenario: Clear a generated batch
- **WHEN** the user clears batch results after generating an individual value
- **THEN** batch state is removed while the individual value and configuration remain available
