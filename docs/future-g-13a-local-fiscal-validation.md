# FUTURE G 13A — validação fiscal local

Implementação concluída em 30/09/2026. A validação estruturada existente passou a combinar parser e regras locais no navegador com XSD versionado em endpoint first-party.

## Cobertura

- NF-e modelo 55, versão 4.00: sintaxe, XSD e regras FUTURE G.
- CT-e modelo 57, versão 4.00: sintaxe, XSD e regras FUTURE G.
- CT-e 3.00: parser e regras locais legadas, com XSD explicitamente não suportado.
- Assinatura criptográfica, autorização, situação e regras oficiais da SEFAZ não são executadas nesta fase.

Cada relatório separa os estados de sintaxe, schema XSD, regras locais e validação oficial. Os achados informam código estável, severidade e origem. Quando o endpoint XSD não responde, o relatório local é preservado e a cobertura passa a `indisponivel`.

## Schemas e integridade

Os arquivos ficam em `schemas/fiscal/` e são carregados sem rede em runtime. O `manifest.json` registra pacote, fonte oficial, publicação, SHA-256 do ZIP e SHA-256 de cada XSD incorporado.

- NF-e: `PL_010f_v1.04`, publicado em 31/08/2026.
- CT-e: `PL_CTe_400_NT2026.002_RTC_1.01_corr`, publicado em 24/08/2026.

O motor `xmllint-wasm` 5.3.0 roda em Node, com um documento por pedido, limite de 4 MiB, memória WASM limitada, timeout de 15 segundos, rejeição antecipada de DTD/entidades e no máximo duas validações simultâneas por instância.

## Privacidade e falhas

O XML somente é enviado após uma ação explícita de validação, para `/api/validate-xml`. A função não persiste nem registra o XML e não o inclui na resposta. O endpoint exige JSON e mesma origem. A exportação do relatório continua removendo o XML-fonte.

## Verificação

Os testes cobrem integridade dos schemas, NF-e 4.00 positiva, CT-e 4.00 positiva, erro XSD, CT-e 3.00 não suportado, DTD/entidades, mesma origem e ausência de eco do XML. A suíte geral, o build e a auditoria de navegador permanecem critérios de encerramento.
