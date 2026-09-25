# Spec: XML Generation and Validation

## Validation depth
XML validation SHALL go beyond valid/invalid and, when applicable, inspect well-formedness, root, expected structure, required tags, access key, issuer, recipient, products, CPF/CNPJ, formats, values and available system rules.

## Severity
Results SHALL classify findings as Error, Warning or Information.

## Error detail
When possible, show tag, value, issue, XML path and syntax line/column.

## Views
Provide Summary, XML and Validation views. Summary MAY show key, issuer, CNPJ, recipient, products, total value, gross weight and relevant fields.

## Upload
The upload area SHALL be broadly clickable, support drag-and-drop, display loaded filename, permit replacement and MAY automatically start validation when appropriate.

## Negative tests
The system SHALL support intentionally inconsistent synthetic XML such as invalid CPF/CNPJ/key, missing required field, invalid format/tag and malformed XML. UI MUST clearly identify these as intentionally generated test data.
