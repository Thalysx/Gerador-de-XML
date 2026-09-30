# Change: FUTURE G 13A — Local Fiscal Validation

## Motivation
Evoluir a validação fiscal determinística antes de qualquer consulta oficial ou explicação por IA, aproveitando o relatório estruturado existente.

## Scope
Suportar validação XSD oficial de NF-e modelo 55 versão 4.00 e CT-e modelo 57 versão 4.00; preservar CT-e 3.00 como fluxo legado com cobertura explicitamente limitada; versionar schemas oficiais; ampliar regras locais determinísticas; expor origem, severidade e cobertura dos achados; e adicionar testes positivos, negativos, de segurança e de indisponibilidade.

## Out of Scope
Consulta SEFAZ, autorização, eventos fiscais, armazenamento de certificado, homologação/produção, validade jurídica e análise por IA.

## Constraints
- Reutilizar `analisarXml` e o modelo de `relatoriosXml`; não criar um segundo validador.
- Manter processamento local quando seguro e mover somente o que exigir runtime de servidor.
- Não baixar schemas em tempo de validação.
- Versionar a origem, versão e integridade de todo schema incorporado.
- Distinguir claramente sintaxe, XSD, regra FUTURE G e resultado oficial ausente.
- Não iniciar implementação antes de concluir as decisões técnicas desta change.

## Capabilities

- `xml-validation`: ampliar a validação estruturada existente com identificação de versão, XSD oficial, taxonomia de origem e cobertura verificável.

## Regression Risks

- Schemas oficiais podem reprovar XMLs sintéticos que antes passavam somente nas regras locais.
- A validação XSD assíncrona pode alterar estados de carregamento e ordenação do relatório.
- Empacotamento incompleto de `xs:include` ou `xs:import` pode produzir falsos erros de schema.
- Indisponibilidade da função não pode ser apresentada como aprovação fiscal.
