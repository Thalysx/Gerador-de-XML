# Design: Advanced XML Validation

## Approach
Extend the existing `analisarXml` report instead of introducing another engine. Preserve legacy fields used by current consumers and add structured severity, problem, tag, value, XML path and parser position. Derive Summary, XML and Validation views from the same object in `relatoriosXml`.

Create negative tests by cloning the current NF-e/CT-e document, applying one explicit mutation and sending the result through the same analyzer. Keep the source document immutable and label the derivative in the interface, filename and exported metadata.

## Compatibility
Keep the existing generator, preview, scenarios, downloads, editor transfer, upload and AI artifact entry points. Preserve `nivel`, `etapa`, `mensagem` and `localizacao` while adding the new structured fields. Exclude source XML and visual state from JSON report export.

## Validation
Cover generated NF-e/CT-e, malformed and unsupported XML, namespaces, structured fields, summary, the three views, keyboard tab navigation, all seven negative variants, source immutability, downloads and redacted export. Run the complete test suite, production build and browser audit before closing the change.
