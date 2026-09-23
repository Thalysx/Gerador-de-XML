# Evidências de acessibilidade e revisão visual

## Contraste de cores principais

Razões calculadas por luminância relativa sRGB para pares opacos definidos nos estilos locais:

| Combinação | Texto | Fundo | Razão |
| --- | --- | --- | --- |
| Texto claro | #241b33 | #ffffff | 16,41:1 |
| Texto auxiliar claro | #655672 | #f5f1fb | 6,03:1 |
| Botão roxo | #ffffff | #7c3aed | 5,70:1 |
| Texto roxo claro | #7c3aed | #f0e8fc | 4,79:1 |
| Sucesso claro | #1d7a4a | #eaf5ef | 4,78:1 |
| Erro claro | #b52f2f | #ffffff | 6,15:1 |
| Foco claro | #7030ce | #ffffff | 6,99:1 |
| Texto escuro | #f5effc | #131017 | 16,73:1 |
| Texto auxiliar escuro | #c1b3ce | #1c1624 | 8,92:1 |
| Link escuro | #a78bfa | #131017 | 6,93:1 |
| Sucesso escuro | #3bd68c | #0f2318 | 8,78:1 |
| Erro escuro | #ef5b68 | #131017 | 5,71:1 |
| Foco escuro | #c5adff | #131017 | 9,69:1 |

Todos os pares medidos superam 4,5:1. Um teste automatizado protege esses valores. A medição não abrange todos os seletores, transparências, bordas ou estilos herdados e não equivale a uma auditoria de conformidade da aplicação.

## Comportamento verificado por testes DOM

- Busca de geradores sem diferença de acentos e restauração da lista.
- Busca de histórico preservando os índices de copiar/restaurar.
- Navegação móvel: estado expandido, Escape e foco após selecionar uma ferramenta.
- Todos os botões, campos, seletores, links e resumos possuem nome acessível verificável; a auditoria inclui controles visualmente ocultos acionados por outros elementos.
- Alternância de formulário NF-e/CT-e sem perder edições.
- Respostas da IA com tabelas, listas e código, mantendo HTML não confiável como texto.

## Validação visual pendente

Em 21/09/2026, a revisão foi concluída com um navegador Chromium local após a ferramenta integrada falhar. As seis telas foram alternadas em 360, 768 e 1440 px. Em todas, `documentElement.scrollWidth` permaneceu igual à largura da janela e nenhum elemento visível do painel ativo ultrapassou seus limites.

Capturas locais inspecionadas:

- `artifacts/visual-review/360-dark.png`: XML fiscal no tema escuro e menu móvel recolhido.
- `artifacts/visual-review/768-light.png`: XML fiscal no tema claro com conteúdo em uma coluna.
- `artifacts/visual-review/768-chat-dark.png`: assistente no tema escuro.
- `artifacts/visual-review/1440-dark.png`: XML fiscal em duas colunas e navegação vertical.
- `artifacts/visual-review/1440-docs-dark.png`: documentos, lote, resultado e histórico.

O painel XML permaneceu a 16–18 px do topo ao rolar para baixo e para cima e voltou à posição original no topo. O painel de documentos acompanhou a rolagem e respeitou o final da área, sem cobrir o histórico. O menu móvel expôs os seis rótulos na árvore acessível; Escape fechou o menu e devolveu o foco ao botão após uma correção feita durante a revisão. Não foram registrados erros JavaScript.

Continuam pendentes um leitor de tela real, zoom real de 200%, teste manual de todos os controles por teclado e validação pública após a publicação.
