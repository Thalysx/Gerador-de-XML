# Change: FUTURE G 12A — Local Fiscal Validation

## Motivation
Evoluir a validação fiscal determinística antes de qualquer consulta oficial ou explicação por IA, aproveitando o relatório estruturado existente.

## Scope
Decisão documentada de documentos e versões; inventário das regras atuais; pesquisa e versionamento de schemas oficiais; validação XSD; regras locais adicionais; cobertura e mensagens explícitas; testes positivos e negativos.

## Out of Scope
Consulta SEFAZ, autorização, eventos fiscais, armazenamento de certificado, homologação/produção, validade jurídica e análise por IA.

## Constraints
- Reutilizar `analisarXml` e o modelo de `relatoriosXml`; não criar um segundo validador.
- Manter processamento local quando seguro e mover somente o que exigir runtime de servidor.
- Não baixar schemas em tempo de validação.
- Versionar a origem, versão e integridade de todo schema incorporado.
- Distinguir claramente sintaxe, XSD, regra FUTURE G e resultado oficial ausente.
- Não iniciar implementação antes de concluir as decisões técnicas desta change.
