## ADDED Requirements

### Requirement: Atomic XSD admission
The first-party XSD handler SHALL reserve one of its two per-instance slots before awaiting request-body reading. Body failures and synchronous engine errors SHALL release the slot. A timed-out response SHALL retain its slot until the underlying validation actually settles. Admission errors SHALL retain the existing 429 response and Retry-After contract.

#### Scenario: Hold two request bodies
- **WHEN** two accepted requests are still reading bodies and a third request arrives
- **THEN** the third request is rejected with 429 without starting another validation.

#### Scenario: Fail before validation
- **WHEN** reading, JSON validation or synchronous engine invocation fails
- **THEN** the reserved slot becomes available without a leak or double release.

#### Scenario: Respond before computation finishes
- **WHEN** an XSD response times out while its engine operation remains pending
- **THEN** that operation still counts against capacity until it settles.
