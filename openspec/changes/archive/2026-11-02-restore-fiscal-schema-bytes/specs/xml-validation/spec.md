## ADDED Requirements

### Requirement: Byte-preserving fiscal schema packaging
Vendored fiscal XSDs SHALL retain the exact bytes identified by the existing manifest, independently of Git newline conversion settings. Restoration SHALL use packages matching recorded hashes and SHALL NOT change fiscal rules, recorded hashes or weaken integrity verification.

#### Scenario: Restore normalized source files
- **WHEN** local XSD bytes differ only by newline normalization from the verified official package
- **THEN** original package bytes are restored without changing the manifest or derived schemas.

#### Scenario: Checkout or archive schemas
- **WHEN** Git prepares a fresh checkout or archive with different autocrlf settings
- **THEN** all packaged XSD bytes still match their recorded hashes.

#### Scenario: Detect altered schema bytes
- **WHEN** an incorporated schema differs from the recorded bytes
- **THEN** integrity verification rejects it instead of accepting a changed hash or normalized comparison.
