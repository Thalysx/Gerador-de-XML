# Spec: History, Favorites and Dashboards

## Purpose

Define privacy-preserving activity history, favorites, environment dashboards and local retention behavior.

## Requirements

### Requirement: History

Generation activity SHALL record only the generator or destination identifier, environment, activity type, quantity and timestamp. It MUST NOT persist generated values, prompts, attachments, API keys, tokens or arbitrary caller-provided fields. Detailed synthetic-result histories MAY continue where required for explicit restoration and SHALL remain separate from the activity summary.

#### Scenario: Record generation activity

- **WHEN** a generator or destination records productivity activity
- **THEN** only its identifier, environment, activity type, quantity and timestamp are retained in the activity summary
- **AND** generated values, prompts, attachments, secrets and arbitrary caller fields are excluded
- **AND** any detailed restoration history remains separate

### Requirement: Favorites

Users SHALL be able to favorite generators and access them quickly from the dashboard. Persisted favorites SHALL contain only known generator identifiers. Favorites unavailable in the active environment SHALL be hidden without being deleted.

#### Scenario: View favorites in an environment

- **WHEN** a user opens the dashboard for the active environment
- **THEN** available favorite generators are accessible there
- **AND** unavailable favorites are hidden without being deleted
- **AND** persisted favorites contain only known generator identifiers

### Requirement: Dashboards

Each environment SHALL have its own dashboard projection from the shared registry and activity ledger. General SHALL expose available tools, favorites, recent activity and recent batches. Port SHALL expose available tools, favorites, recent activity and generated scenario masses. Activity lists and counters SHALL contain only the active environment.

#### Scenario: Project the active environment dashboard

- **WHEN** the active environment dashboard is displayed
- **THEN** its tools, favorites, recent activity and environment-specific recent content come from the shared registry and activity ledger
- **AND** activity lists and counters contain only the active environment

### Requirement: Retention and clearing

The activity ledger SHALL retain at most 50 normalized entries in local storage. Users SHALL be able to clear the activity for the active environment without deleting the other environment's entries, favorites or detailed synthetic-result histories.

#### Scenario: Clear active-environment activity

- **WHEN** a user clears activity for the active environment
- **THEN** that environment's activity entries are removed
- **AND** the other environment's entries, favorites and detailed histories remain available
- **AND** the ledger never retains more than 50 normalized entries
