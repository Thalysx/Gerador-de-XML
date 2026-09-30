# Design: FUTURE G 12A — Local Fiscal Validation

## Baseline
O analisador atual cobre XML bem-formado, tipo reconhecido, namespace, estrutura básica, campos obrigatórios, chave, modelo, CPF/CNPJ, produtos, valores, totais e protocolo conforme regras disponíveis. Ele não valida XSD, assinatura digital, regras tributárias completas ou autorização.

## Decisions required before implementation
1. Fixar os documentos e versões inicialmente suportados.
2. Identificar fontes oficiais, licença/distribuição, dependências e hashes dos schemas.
3. Escolher um motor XSD compatível com Node.js e Netlify, com limites de CPU, memória, tamanho e tempo.
4. Definir a fronteira navegador/backend sem enviar XML automaticamente ou persistir seu conteúdo.
5. Mapear regras existentes para evitar mensagens duplicadas entre parser, XSD e domínio.
6. Definir códigos estáveis, severidade, origem da verificação e estado de cobertura.
7. Preparar fixtures válidas, inválidas e de versão não suportada sem dados reais.

## Target pipeline
`limites/segurança -> parser -> identificação de documento/versão -> XSD -> regras FUTURE G -> relatório estruturado`

Cada achado deve indicar sua origem (`sintaxe`, `xsd` ou `regra-local`). A ausência de integração oficial deve aparecer como limite de cobertura, nunca como aprovação.

## Compatibility
As visões Resumo, XML e Validação, upload, editor, testes negativos, exportação redigida e entrada pelo Assistente permanecem consumidores do mesmo relatório. O XML-fonte continua excluído da exportação JSON.

## Security
Recusar DTD/entidades, aplicar limites antes de parsear, não resolver recursos externos, não registrar XML integral, não aceitar caminhos fornecidos pelo documento e manter schemas imutáveis no build.

## Validation strategy
Testar cada documento/versão suportado; namespaces; schema ausente ou incompatível; XXE/DTD; limites; mensagens determinísticas; redaction; paridade navegador/backend; build Netlify e regressão dos fluxos atuais.
