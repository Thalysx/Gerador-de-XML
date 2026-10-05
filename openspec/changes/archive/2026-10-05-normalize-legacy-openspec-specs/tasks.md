# Tasks

## 1. Shell and cross-cutting specifications

- [x] 1.1 Normalize `app-shell/spec.md` with Purpose, named requirements and behavior-preserving scenarios; verify with `openspec validate app-shell --strict`
- [x] 1.2 Normalize `export-accessibility/spec.md` with Purpose, named requirements and behavior-preserving scenarios; verify with `openspec validate export-accessibility --strict`
- [x] 1.3 Normalize `history-favorites/spec.md` with Purpose, named requirements and behavior-preserving scenarios; verify with `openspec validate history-favorites --strict`

## 2. QA Portuário specifications

- [x] 2.1 Normalize `port-qa/spec.md` with Purpose, named requirements and behavior-preserving scenarios; verify with `openspec validate port-qa --strict`
- [x] 2.2 Normalize `test-scenarios/spec.md` with Purpose, named requirements and behavior-preserving scenarios; verify with `openspec validate test-scenarios --strict`

## 3. Integration verification

- [x] 3.1 Review the five diffs against their pre-change text and verify every original SHALL, MUST, SHOULD and MAY obligation remains represented without new behavior
- [x] 3.2 Run `openspec validate --all --strict` and verify every canonical spec passes
- [x] 3.3 Run `git diff --check` and verify the maintenance implementation changed no runtime, test or deployment file
