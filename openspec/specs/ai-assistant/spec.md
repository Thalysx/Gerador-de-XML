# Spec: AI Assistant

AI SHALL remain complementary and MUST NOT be required for deterministic operations such as UUID, CPF synthetic generation or random numbers.

Preferred AI use cases include custom test data, XML explanation/analysis/modification, test scenario suggestions, variations, transformations, JSON/XML payload generation and QA assistance.

## Chat auto-scroll
New messages and AI streaming SHOULD auto-follow while the user remains near the bottom. If the user manually scrolls upward, auto-follow MUST pause. It SHALL resume when the user returns to the bottom.

## Attachments
Remove a dedicated XML-only attachment area from chat. Provide a `+` action integrated with the composer, with `Adicionar arquivo` and `Adicionar XML`. Pending attachments SHALL appear as removable chips/cards. Architecture SHOULD permit future formats.
