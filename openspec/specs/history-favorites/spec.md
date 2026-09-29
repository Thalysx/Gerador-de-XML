# Spec: History, Favorites and Dashboards

## History
Generation activity SHALL record only the generator or destination identifier, environment, activity type, quantity and timestamp. It MUST NOT persist generated values, prompts, attachments, API keys, tokens or arbitrary caller-provided fields. Detailed synthetic-result histories MAY continue where required for explicit restoration and SHALL remain separate from the activity summary.

## Favorites
Users SHALL be able to favorite generators and access them quickly from the dashboard. Persisted favorites SHALL contain only known generator identifiers. Favorites unavailable in the active environment SHALL be hidden without being deleted.

## Dashboards
Each environment SHALL have its own dashboard projection from the shared registry and activity ledger. General SHALL expose available tools, favorites, recent activity and recent batches. Port SHALL expose available tools, favorites, recent activity and generated scenario masses. Activity lists and counters SHALL contain only the active environment.

## Retention and clearing
The activity ledger SHALL retain at most 50 normalized entries in local storage. Users SHALL be able to clear the activity for the active environment without deleting the other environment's entries, favorites or detailed synthetic-result histories.
