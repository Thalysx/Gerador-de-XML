## ADDED Requirements

### Requirement: Native search button activation
Global search SHALL intercept Enter for result selection only from the query field outside text composition. Buttons SHALL retain native keyboard activation and their own click handlers. Closing search SHALL restore prior focus without navigating or generating data.

#### Scenario: Close without executing the selected result
- **WHEN** the user focuses Close and presses Enter or Space
- **THEN** search closes and prior focus returns without opening a tool or generating data.

#### Scenario: Activate a focused result
- **WHEN** the user tabs to a result different from the query selection and presses Enter
- **THEN** that focused result is activated once through its own click handler.

#### Scenario: Confirm composed query text
- **WHEN** Enter is received while the query is composing text
- **THEN** no result is activated and search remains open.
