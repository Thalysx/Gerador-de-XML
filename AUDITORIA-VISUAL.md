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

## Validação visual em navegador

Em 21/09/2026, a revisão foi concluída com um navegador Chromium local após a ferramenta integrada falhar. As seis telas foram alternadas em 360, 768 e 1440 px. Em todas, `documentElement.scrollWidth` permaneceu igual à largura da janela e nenhum elemento visível do painel ativo ultrapassou seus limites.

Capturas locais inspecionadas:

- `artifacts/visual-review/360-dark.png`: XML fiscal no tema escuro e menu móvel recolhido.
- `artifacts/visual-review/768-light.png`: XML fiscal no tema claro com conteúdo em uma coluna.
- `artifacts/visual-review/768-chat-dark.png`: assistente no tema escuro.
- `artifacts/visual-review/768-chat-states-dark.png`: primeira revisão dos novos estados e das ferramentas executadas; a captura revelou um selo encostado no título e levou ao ajuste de ordem e espaçamento aplicado em seguida.
- `artifacts/visual-review/1440-dark.png`: XML fiscal em duas colunas e navegação vertical.
- `artifacts/visual-review/1440-docs-dark.png`: documentos, lote, resultado e histórico.

O painel XML permaneceu a 16–18 px do topo ao rolar para baixo e para cima e voltou à posição original no topo. O painel de documentos acompanhou a rolagem e respeitou o final da área, sem cobrir o histórico. O menu móvel expôs os seis rótulos na árvore acessível; Escape fechou o menu e devolveu o foco ao botão após uma correção feita durante a revisão. Não foram registrados erros JavaScript.

Em 23/09/2026, a revisão intermediária foi publicada no commit `85bd6ab`. O arquivo público do chat contém os estados novos e o ajuste de espaçamento. A API pública respondeu com Groq configurada e uma chamada real gerou texto, executou `gerar_dados` e devolveu um artefato de registros. A recaptura visual posterior ao último ajuste não pôde ser feita porque a cota do navegador automatizado foi atingida.

### Zoom de 200%, teclado e movimento reduzido — 23/09/2026

O comando `npm run audit:browser` iniciou uma instância isolada do Chrome e aplicou escala 2 a uma janela física de 1280 × 900, oferecendo um viewport de 640 × 450 px CSS. As seis telas mantiveram a largura do documento dentro do viewport, sem rolagem horizontal nem elementos visíveis cortados nas laterais.

O mesmo navegador percorreu 165 paradas de foco reais: 36 no XML fiscal, 33 em Dados cadastrais, 63 em Cadastro geral, 6 no Editor XML, 11 em Validação XML e 16 no Assistente. Nenhuma parada interativa ficou invisível, sem nome ou sem contorno de foco. A preferência `prefers-reduced-motion: reduce` também foi emulada e removeu a animação relevante dos componentes amostrados. O resultado estruturado fica em `artifacts/visual-review/auditoria-200.json` e a captura inspecionada em `artifacts/visual-review/200-percent.png`; ambos são artefatos locais ignorados pelo Git.

A auditoria também leu a árvore de acessibilidade nativa do Chromium em cada uma das seis telas. Todos os controles focáveis expostos tinham função e nome acessível, e os marcos de navegação e lista de ferramentas estavam nomeados. A primeira execução encontrou a região focável dos resultados da validação XML sem nome; `aria-label="Resultados detalhados da validação XML"` foi adicionado e a repetição passou sem ocorrências.

A identidade TheGenerator foi carregada no navegador com nome, assinatura, símbolo e favicon corretos. As capturas `thegenerator-desktop-dark.png` e `thegenerator-desktop-light.png` confirmam a aplicação nos dois temas, e o build contém os SVGs, PNGs e o manifesto da aplicação.

O servidor isolado da auditoria remove dependências visuais externas para tornar o teste determinístico e usa os mesmos HTML, CSS e JavaScript locais. Por isso, essa execução comprova o reflow e o foco da aplicação, mas não a disponibilidade das fontes, dos ícones ou do Bootstrap servidos por CDN.

Continua pendente apenas a validação auditiva manual com um leitor de tela real; a exposição estrutural à tecnologia assistiva foi aprovada pela árvore nativa do Chromium. O procedimento, os cenários e o modelo para registrar o resultado estão em `CHECKLIST-LEITOR-TELA.md`. A identidade aplicada recebeu a captura final local e foi publicada no commit `e6856b9`. O HTML, o símbolo SVG e o manifesto retornados por `https://gerador-all.netlify.app` coincidiram por SHA-256 com os arquivos do build local.

