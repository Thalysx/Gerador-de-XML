## ADDED Requirements

### Requirement: Reusable finite IPv4 generation
Documentation IPv4 generation SHALL complete successive batches of 1 to 500 unique records using the existing 762 addresses, even after individual or mixed generation. It SHALL select from candidates outside its last 500 values without retry exhaustion, keep bounded in-memory state and preserve existing formats, exports and other generators. Reuse across batches after leaving the recent window is permitted.

#### Scenario: Generate successive maximum IPv4 batches
- **WHEN** the user generates multiple consecutive batches of 500 documentation IPv4 addresses
- **THEN** every batch contains exactly 500 distinct addresses in the existing ranges
- **AND** exhaustion of a previous batch does not prevent generating or exporting the next batch

#### Scenario: Generate after individual values with repeated random indices
- **WHEN** individual generation precedes a batch or the random source repeatedly chooses the same candidate index
- **THEN** selection still completes without repeating an address within the batch
