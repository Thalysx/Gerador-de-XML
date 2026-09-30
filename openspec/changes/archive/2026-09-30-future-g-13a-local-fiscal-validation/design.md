# Design: FUTURE G 13A — Local Fiscal Validation

## Baseline
O analisador atual cobre XML bem-formado, tipo reconhecido, namespace, estrutura básica, campos obrigatórios, chave, modelo, CPF/CNPJ, produtos, valores, totais e protocolo conforme regras disponíveis. Ele não valida XSD, assinatura digital, regras tributárias completas ou autorização.

## Supported documents and versions

- NF-e, modelo 55, namespace `http://www.portalfiscal.inf.br/nfe`, versão 4.00: validação sintática, XSD e regras FUTURE G.
- CT-e, modelo 57, namespace `http://www.portalfiscal.inf.br/cte`, versão 4.00: validação sintática, XSD e regras FUTURE G.
- CT-e 3.00 permanece aceito pelo parser e pelas regras locais para não quebrar documentos existentes, mas o relatório marca XSD como `nao-suportado` nesta primeira entrega.
- Outras raízes, modelos ou versões recebem somente as verificações seguras aplicáveis e cobertura `nao-suportado`; nunca são promovidos a válidos.

## Official schema sources and integrity

Os schemas serão obtidos exclusivamente dos catálogos oficiais consultados em 2026-09-30:

- NF-e: `https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w=`; pacote oficial 010f v1.04, com NT 2025.002 v1.50 e NT 2026.007 v1.00, publicado em 2026-08-31. Download verificado: `https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=8ITFuBLltXs=`.
- CT-e: `https://www.cte.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=0xlG1bdBass=`; pacote oficial `PL_CTe_400_NT2026.002_RTC_1.01_corr`, publicado em 2026-08-24. Download verificado: `https://www.cte.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=qGIe20MvWf4=`.

O repositório manterá somente os XSDs necessários e suas dependências, junto de `manifest.json` com documento, versão, pacote, URL, data de publicação, data de obtenção, caminho e SHA-256 de cada arquivo. Atualização exige nova change, revisão do diff do pacote e regeneração dos hashes. A validação nunca baixa schemas em runtime.

## XSD engine

Usar `xmllint-wasm` 5.3.0 (MIT, libxml2 2.13.8), compatível com Node.js 16+ e capaz de validar XSD com dependências pré-carregadas sem rede. Ele foi preferido a bindings nativos por evitar `node-gyp` e binários específicos da plataforma no deploy Netlify.

O motor roda numa função Node 22 compartilhada pelo servidor local, Netlify e adaptador `/api`. Cada chamada aceita um XML textual de até 4 MiB, processa um documento, usa memória WASM limitada e aplica timeout de 15 segundos. A função não aceita caminho de arquivo ou URL fornecidos pelo documento.

## Browser/backend boundary and privacy

Limites, rejeição de DTD/entidades, parsing, identificação, regras FUTURE G, resumo e exportação permanecem locais. Somente o XML escolhido explicitamente para validação XSD é enviado à função first-party. A resposta contém somente achados e cobertura; o XML não é persistido, incluído em logs ou retornado. Ausência da função preserva o relatório local e marca XSD como `indisponivel`.

## Findings and coverage model

Cada achado conserva `codigo`, `severidade`, `mensagem`, `tag`, `valor`, `caminho`, linha e coluna quando disponíveis e adiciona `origem`: `sintaxe`, `xsd`, `regra-local` ou `cobertura`. Códigos são estáveis e não dependem do texto traduzido.

O relatório inclui `cobertura` para `sintaxe`, `xsd`, `regrasLocais` e `oficial`, usando `aprovado`, `reprovado`, `nao-executado`, `nao-suportado` ou `indisponivel`. `oficial` permanece sempre `nao-executado` na G-13A.

XSD é a fonte para cardinalidade, tipos, formatos e estrutura declarada. Regras locais ficam responsáveis por CPF/CNPJ, chave, relações entre campos, cálculos, totais e regras FUTURE G que o XSD não expressa. O registro de regras associa cada código a uma origem para impedir a emissão duplicada do mesmo problema.

## Target pipeline
`limites/segurança -> parser local -> identificação documento/versão -> XSD first-party -> regras FUTURE G -> relatório estruturado`

Cada achado deve indicar sua origem (`sintaxe`, `xsd` ou `regra-local`). A ausência de integração oficial deve aparecer como limite de cobertura, nunca como aprovação.

## Compatibility
As visões Resumo, XML e Validação, upload, editor, testes negativos, exportação redigida e entrada pelo Assistente permanecem consumidores do mesmo relatório. O XML-fonte continua excluído da exportação JSON.

## Security
Recusar DTD/entidades, aplicar limites antes de parsear, não resolver recursos externos, não registrar XML integral, não aceitar caminhos fornecidos pelo documento e manter schemas imutáveis no build.

## Validation strategy
Fixtures sintéticas cobrem NF-e 4.00 e CT-e 4.00 válidos, erros XSD conhecidos, CT-e 3.00 legado, versão desconhecida, namespace incorreto, schema ausente, XXE/DTD, limite excedido e indisponibilidade. Testes verificam taxonomia determinística, ausência do XML na resposta/exportação/logs, build Netlify e regressão dos fluxos atuais.
