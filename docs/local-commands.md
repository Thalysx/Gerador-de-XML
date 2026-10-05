# Comandos locais — alpha.7

O assistente executa regras no navegador. Não usa IA nem envia comandos ou anexos para provedores. O catálogo nas Opções do assistente acompanha o ambiente atual e permite buscar qualquer gerador de lote disponível. As sugestões enquanto você digita e os favoritos apenas preenchem o pedido. Clique em Enviar ou pressione Enter; Shift+Enter insere uma linha. Uma barra inicial é opcional.

## Dados

- `3 CPFs e 2 CNPJs`
- `10 crachás sem código de barras`
- `5 UUIDs`
- `5 telefones fixos UF SP`
- `10 placas antigas`
- `2 cargas conteinerizadas` no QA Portuário

Aceita singular, plural e nomes sem acento, de 1 a 500 registros por pedido. Use `com máscara` ou `sem máscara`. As opções se aplicam ao pedido inteiro. CPF, empresas e utilitários gerais ficam no ambiente Geral; entidades e documentos portuários ficam no QA Portuário. Pedidos parcialmente compreendidos são recusados por inteiro. Copiar, JSON, CSV e TXT incluem o lote completo; a prévia mostra até 50 registros.

## XML

- `gerar NF-e com 3 produtos` — aceita de 1 a 20 produtos.
- `gerar CT-e`
- `resumir XML anexado`
- `mostrar produtos do XML anexado` — NF-e.
- `mostrar destinatário do XML anexado`
- `validar XML anexado`
- `mostrar apenas erros do XML anexado`
- `criar cópia com CNPJ inválido`
- `remover campo obrigatório` — remove o nome do emitente em uma cópia.

Também existem cópias com CPF inválido, chave inválida, formato inválido, tag inválida e XML malformado. O catálogo traz os exemplos completos. A cópia é identificada como teste intencional e preserva seu original. Se o campo necessário estiver ausente ou já contiver o erro, o comando informa que a variante não pode ser aplicada.

Use o botão + para adicionar arquivo `.xml`, colar até 100 KB ou anexar um XML Fiscal atual. Consultas com `XML anexado` exigem esse anexo. Para consultar o gerador, escreva `NF-e atual`, `CT-e atual` ou `XML atual` (tipo selecionado no menu de anexos). `XML resultado` usa o último arquivo XML produzido nos comandos. Sem indicar fonte, usamos o anexo, se existir, ou o último resultado XML. Os resultados identificam a fonte. Nenhuma consulta ou cópia modifica o XML Fiscal. A geração local cria arquivos separados, com dados sintéticos, ambiente de homologação e assinatura de exemplo.

Os arquivos possuem ações para copiar, baixar, validar localmente e abrir uma cópia no Editor. A validação por comando verifica sintaxe e regras locais, sem executar XSD ou consultar SEFAZ. A tela de Validação continua oferecendo XSD pela API da aplicação.

## Reutilização e privacidade

`ajuda` abre o catálogo. `repetir último comando` executa novamente o último comando concluído, verificando o ambiente atual. O XML é lido da fonte disponível no momento da repetição. Favoritar comando salva até 10 textos por ambiente neste navegador. Escolher um favorito não executa automaticamente.

A conversa conserva até 10 trocas apenas em memória. Anexos permanecem disponíveis para consultas até serem removidos ou a conversa ser limpa. Nova conversa remove resultados, contexto de repetição e anexo; favoritos permanecem. Favoritos não guardam arquivos ou resultados. Remover um anexo cancela também uma leitura de arquivo que ainda estiver em andamento. As antigas rotas `/api/chat` e `/api/status` retornam HTTP 410; a validação XML permanece disponível.

Se o armazenamento do navegador estiver bloqueado, favoritos continuam disponíveis na aba atual e a mensagem informa que não foram persistidos.

## Verificação da versão

- `npm test`: 124 testes aprovados, com cobertura de todos os comandos de lote nos dois ambientes, opções, rejeição integral, consultas XML, cópias negativas, escapes, ações, favoritos, recarga e leitura cancelada de anexos.
- `npm run build`: aprovado; 51 ícones locais, 11.744 bytes.
- `npm run audit:browser`: sete painéis, 193 passos de teclado, console limpo, ações XML, favoritos e preservação do rascunho aprovados. Nenhuma requisição a `/api/chat` ou `/api/status`.
- Matriz responsiva: 224 estados básicos e 56 expandidos sem overflow; quatro casos do Editor carregado em 360 px aprovados.
- `openspec validate --all --strict`: 13 itens aprovados antes do arquivamento.

Evidências locais: `artifacts/visual-review/auditoria-200.json` e `artifacts/visual-review/future-g-local-commands.png`. Auditoria automatizada em Chromium; leitor de tela real e dispositivo físico continuam conferências manuais.
