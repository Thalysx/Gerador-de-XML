# Design

## Context

See `proposal.md` for motivation. The five target files contain valid normative language but use legacy headings such as `## Scope`, `## Export` and bare `###` sections. The current OpenSpec validator requires `## Purpose`, `## Requirements`, named `### Requirement:` blocks and scenarios beneath requirements.

## Goals / Non-Goals

**Goals:**

- Produce validator-compliant canonical specs with no semantic change.
- Preserve every existing SHALL, MUST, SHOULD and MAY statement.
- Make scenarios representative and directly traceable to their parent requirement.
- Leave a globally strict-valid canonical spec set.

**Non-Goals:**

- Changing application behavior, tests, APIs or implementation files.
- Adding requirements that are merely inferred from current code.
- Rewriting already valid canonical specs or beginning another FUTURE G phase.

## Decisions

1. **Edit the five canonical specs directly.** This is a format migration rather than a capability change, so delta specs are skipped. An alternative change-and-archive delta would incorrectly imply modified behavior and could duplicate the existing normative text.
2. **Map each legacy topical section to one named requirement.** Existing paragraphs remain intact as the requirement body. This gives the smallest reviewable transformation and avoids merging independent obligations.
3. **Add one or more scenarios per requirement without introducing new outcomes.** Each scenario will restate an observable case already required by its parent text. Existing scenarios, such as local shell asset loading, will be retained under the renamed requirement.
4. **Validate after each spec and once globally.** Per-file strict validation localizes formatting mistakes; the final `openspec validate --all --strict` proves the baseline is clean.
5. **Use the original files as the rollback boundary.** Since runtime code is untouched, rollback is a documentation-only revert of the five spec files.

## Risks / Trade-offs

- **Scenario wording could add an unintended constraint** → derive every `WHEN`/`THEN` only from explicit existing normative text and review the diff for new modal verbs.
- **Long requirements may remain informationally dense** → preserve semantics now; splitting behavior into new requirements is out of scope unless necessary for strict validity.
- **Direct canonical edits bypass archive-based sync** → `skip_specs` documents why this maintenance change has no delta, and strict validation is the acceptance gate.

## Migration Plan

1. Normalize one target spec at a time and run strict validation for it.
2. Compare the normalized text with its original to confirm all normative statements remain represented.
3. Run strict validation across all specs.
4. Archive the maintenance change after review; if rollback is needed, restore only the five canonical spec files.
