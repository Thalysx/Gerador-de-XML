# Validação XML

## Cobertura

| Documento | Verificações |
| --- | --- |
| NF-e modelo 55, versão 4.00 | Sintaxe, XSD versionado e regras locais |
| CT-e modelo 57, versão 4.00 | Sintaxe, XSD versionado e regras locais |
| CT-e 3.00 | Sintaxe e regras locais legadas, sem XSD |

O relatório separa sintaxe, schema XSD, regras locais e validação oficial. Achados têm código, severidade e origem; tag, caminho, linha e coluna aparecem quando disponíveis. Assinatura criptográfica, situação, regras tributárias completas e autorização SEFAZ não são verificadas.

## Entrada e privacidade

A tela aceita conteúdo colado, XML do gerador e até 10 arquivos UTF-8 de 5 MB cada. Selecionar ou arrastar arquivos inicia a análise; texto, documento do gerador e cópias negativas dependem dos respectivos controles. Apenas abrir a tela ou digitar não envia o conteúdo.

Sintaxe e regras locais rodam no navegador. Para NF-e/CT-e 4.00 compatíveis, com sintaxe válida e até 4 MiB, a tela envia um documento por POST JSON a `/api/validate-xml`, na mesma origem. O serviço não persiste, registra ou devolve a fonte XML. Se estiver indisponível, o relatório local permanece e informa cobertura reduzida. O limite XSD é separado do limite de upload.

Consultas e validações nos [comandos locais](local-commands.md) usam somente o navegador e um limite separado de 100 KB para anexos. A exportação JSON do relatório remove a fonte XML. Cópias com erros intencionais preservam o original e recebem identificação explícita.

## Estado e concorrência

Cada análise tem uma versão. Outra análise invalida o upload anterior, libera seus controles e impede que leituras antigas publiquem resultados ou iniciem XSD. Na API, a vaga é reservada antes de aguardar o corpo; o motor conserva sua vaga até terminar, inclusive após timeout da resposta.

O Editor captura o grupo de destino por lote de importação. Trocar de grupo não muda esse destino. Limpar grupo cancela apenas suas leituras; reset cancela todas. Erros de leitura concluem o lote e preservam os arquivos válidos.

## Schemas e execução

Os XSDs oficiais estão em [schemas/fiscal](../schemas/fiscal), com pacotes, fontes, datas e hashes no [manifesto](../schemas/fiscal/manifest.json). O carregamento em runtime não usa rede. Preserve os bytes e fins de linha originais, protegidos por [.gitattributes](../.gitattributes): não formate, normalize ou reserialize os schemas.

O motor `xmllint-wasm` usa memória WASM limitada, timeout de 15 segundos e no máximo duas validações simultâneas por instância. DTDs e entidades são rejeitadas antecipadamente.

A função Vercel precisa incluir HTML, scripts, schemas e todo o diretório `node_modules/xmllint-wasm/**` conforme [vercel.json](../vercel.json). O Worker carrega o binário WASM dinamicamente; incluir somente o módulo JavaScript deixa o motor indisponível em produção. O [teste de empacotamento](../tests/vercel-xsd-assets.test.cjs) confere os recursos reais em uma árvore isolada, com XML positivo e negativo.

Execute os testes e checks pertinentes do [guia de verificação](quality.md). Validação XSD aprovada não equivale a emissão ou autorização fiscal.
