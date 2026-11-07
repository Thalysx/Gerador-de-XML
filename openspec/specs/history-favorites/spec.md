# Spec: History, Favorites and Dashboards

## Purpose

Define privacy-preserving activity history, unified-catalog favorites and dashboard, and local retention behavior.

## Requirements

### Requirement: History

Generation activity SHALL record only the generator or destination identifier, environment, activity type, quantity and timestamp. It MUST NOT persist generated values, prompts, attachments, API keys, tokens or arbitrary caller-provided fields. Detailed synthetic-result histories MAY continue where required for explicit restoration and SHALL remain separate from the activity summary.

#### Scenario: Record generation activity

- **WHEN** a generator or destination records productivity activity
- **THEN** only its identifier, environment, activity type, quantity and timestamp are retained in the activity summary
- **AND** generated values, prompts, attachments, secrets and arbitrary caller fields are excluded
- **AND** any detailed restoration history remains separate

### Requirement: Favorites

Users SHALL be able to favorite generators from both domains and access them together in the unified catalog and dashboard. Persisted favorites SHALL contain only known generator identifiers. Legacy domain preferences SHALL NOT hide otherwise available favorite tools.

#### Scenario: View favorites in the unified catalog

- **WHEN** a user opens the unified dashboard
- **THEN** available general-purpose and port-domain favorite generators are accessible together
- **AND** a legacy environment preference does not separate or hide them
- **AND** persisted favorites contain only known generator identifiers

### Requirement: Dashboards

The unified dashboard SHALL project available tools, favorites, recent activity and recent batches from the shared registry and activity ledger. Lists and counters SHALL include normalized legacy general/port entries together with new unified entries. The dashboard SHALL NOT claim generated operational scenario masses absent from the runtime.

#### Scenario: Project the unified catalog dashboard

- **WHEN** the unified dashboard is displayed
- **THEN** its tools, favorites, recent activity and recent batches come from the shared registry and activity ledger
- **AND** activity lists and counters combine valid legacy and unified entries without presenting an operational scenario library

### Requirement: Retention and clearing

The activity ledger SHALL retain at most 50 normalized entries in local storage. Clearing activity SHALL remove the entire unified activity list, including normalized legacy general/port entries, without deleting favorites or detailed synthetic-result histories.

#### Scenario: Clear unified activity

- **WHEN** a user clears activity in the unified dashboard
- **THEN** all activity entries are removed regardless of their legacy or unified domain metadata
- **AND** favorites and detailed histories remain available
- **AND** the ledger never retains more than 50 normalized entries
