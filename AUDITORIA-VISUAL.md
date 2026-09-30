# Evidências de acessibilidade e revisão visual

## Resultado estruturado e rolagem — 30/09/2026

O painel compartilhado de Dados cadastrais foi conferido com um perfil de Motorista de 16 campos. Em 1440 px, o resultado usa duas colunas; em 360 px, passa a uma coluna sem rolagem horizontal. Labels técnicos como `categoria_cnh`, `validade_cnh`, `funcao` e `endereco` não aparecem na projeção visual, e o painel não contém `pre`, `code` ou `textarea` para os dados estruturados. Copiar, Baixar TXT e Gerar novamente permaneceram ativos.

O conteúdo longo possui rolagem interna. Depois de posicioná-lo em 264 px e gerar outro Motorista, o painel retornou a 0 no frame posterior à renderização, enquanto o documento permaneceu em 80 px. A auditoria também confirmou que cópia, download, resize e atualização sem novo resultado não reposicionam a leitura.

As capturas `future-g-structured-result-desktop.png` e `future-g-structured-result-mobile.png` foram inspecionadas. O auditor percorreu 231 passos de teclado, sem foco invisível, controle sem nome, falta de contorno, exceção, erro ou aviso de console. A suíte passou com **107 testes**, o build foi aprovado e a matriz de **128 combinações** terminou sem falhas.

---

## Polimento e robustez — 28/09/2026

A matriz final capturou **128 combinações**: oito painéis, temas claro/escuro, larguras CSS de 360, 768, 1280 e 1920 px e sidebar expandida/recolhida. A primeira rodada encontrou somente o botão “Gerar XML intencionalmente inválido” excedendo o viewport de 360 px; após permitir quebra de linha, a repetição terminou sem falhas ou overflow horizontal.

O auditor de 200% aprovou as oito telas e a busca `Ctrl+K` nos dois ambientes. O diálogo permaneceu nomeado, focado e contido no viewport; a consulta “transportadora” retornou zero resultados em Geradores Gerais e um em QA Portuário. A árvore nativa não encontrou controles ou marcos sem nome, e não houve foco invisível, foco sem contorno, exceção, erro ou aviso de console. A captura do próprio auditor também passou a disparar o evento real de troca de ambiente para impedir evidência visual com projeções desatualizadas.

Os ativos locais medidos totalizaram 336.839 bytes de JavaScript e 107.081 bytes de CSS, com 1.415 nós DOM na amostra. O subset Lucide contém 49 ícones e 11.467 bytes, 97,4% menor que o runtime completo anterior de 433.756 bytes. A suíte terminou com **105 testes aprovados** e o build público foi concluído. A auditoria percorreu 231 passos de teclado sem foco invisível e a matriz de 128 combinações não encontrou falhas. A verificação auditiva manual com leitor de tela real continua sendo uma etapa humana separada.

---

## Produtividade — 28/09/2026

A Home recebeu indicadores por ambiente e atividade recente sem conteúdo gerado. A busca global `Ctrl+K` usa diálogo nomeado, lista de resultados contextual, estado anunciado, navegação por setas, Enter, Escape, retorno de foco e contenção de Tab. Os lotes mantêm as mesmas ações e ganharam nomes de arquivo contextuais.

O comando `npm run audit:browser` aprovou as oito telas em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Nenhuma tela apresentou rolagem horizontal ou elementos excedentes. O percurso somou **244 passos de teclado**, sem controles sem nome, focos invisíveis ou focos sem contorno. A árvore de acessibilidade não encontrou controles ou marcos sem nome, e a preferência de movimento reduzido permaneceu aplicada.

A suíte automatizada passou com **102 testes** e o build público foi concluído. A cobertura da fase abre a busca por teclado, troca o ambiente com o diálogo ativo, verifica retorno/contenção de foco, filtra favoritos e atividade, rejeita campos sensíveis na persistência e exporta um lote integral de 75 itens.

---

## Cenários de teste coerentes — 28/09/2026

O QA Portuário recebeu uma oitava tela para gerar e inspecionar massas operacionais relacionadas. Controles, resultado, aviso de dado inválido, lista de entidades, sequência de etapas e JSON completo permaneceram legíveis na grade responsiva e acessíveis pelo teclado.

O comando `npm run audit:browser` aprovou as oito telas em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Nenhuma tela apresentou rolagem horizontal ou elementos excedentes. O percurso somou **244 passos de teclado**, sem controles sem nome, focos invisíveis ou focos sem contorno. A árvore de acessibilidade também não encontrou controles ou marcos sem nome, e a preferência de movimento reduzido permaneceu aplicada.

A suíte automatizada passou com **98 testes** e o build público foi concluído. A cobertura da fase verifica os dez modelos, referências cruzadas, ordem de etapas, modos válido/inválido/aleatório, detecção de quebra estrutural, persistência, restauração e exportação JSON.

---

## QA Portuário — 27/09/2026

O catálogo portuário recebeu perfis, empresas, veículos, contêineres detalhados, cargas e documentos especializados. A lista manual de NCM passou a acompanhar o ambiente ativo, e os novos geradores usam o mesmo workspace e os mesmos controles de lote e exportação.

O comando `npm run audit:browser` aprovou as sete telas em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Nenhuma tela apresentou rolagem horizontal ou elementos excedentes. O percurso somou **233 passos de teclado**, sem controles sem nome, focos invisíveis ou focos sem contorno. A árvore de acessibilidade também não encontrou controles ou marcos sem nome, e a preferência de movimento reduzido permaneceu aplicada.

A suíte automatizada passou com **92 testes** e o build público foi concluído. A cobertura nova verifica todos os perfis e empresas, combinações veiculares, contêiner ISO 6346, modalidades de carga, prioridade dos NCMs manuais, documentos e chave CT-e, além da integração com registry, lote e exportação.

---

## Validação XML avançada — 27/09/2026

A tela de Validação XML recebeu o gerador de testes negativos e relatórios com abas Resumo, XML e Validação. A captura escura foi inspecionada após a mudança e os novos controles mantiveram a hierarquia da entrada existente. O relatório usa tabs nomeadas, painéis associados e navegação por setas, Home e End.

O comando `npm run audit:browser` aprovou as sete telas em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Nenhuma tela apresentou rolagem horizontal ou elementos excedentes. O percurso somou **234 passos de teclado**, sem controles sem nome, focos invisíveis ou focos sem contorno. A árvore de acessibilidade não encontrou controles ou marcos sem nome, e a preferência de movimento reduzido permaneceu aplicada.

A suíte automatizada passou com **84 testes**. A cobertura nova verifica o modelo estruturado, as três visões associadas, navegação das abas, as sete variantes negativas, preservação do documento-base, identificação explícita do dado inválido, download e exportação sem XML-fonte. A validação auditiva manual com leitor de tela real continua sendo uma etapa humana separada.

---

## Geradores Gerais — novos incrementos — 26/09/2026

Nome fantasia, Endereço completo, CEP, RENAVAM, UUID v4, IPv4/IPv6 de documentação, MAC local, três fixtures financeiras e Crachá foram adicionados ao catálogo compartilhado de Geradores Gerais. Cadastro Geral também recebeu seleção de cinco grupos e resultado em ficha. A auditoria foi repetida após as novas categorias e controles.

O comando `npm run audit:browser` aprovou as sete telas em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Nenhuma tela apresentou rolagem horizontal ou elementos excedentes. O percurso somou **231 passos de teclado**, sem controles sem nome, focos invisíveis ou focos sem contorno. A árvore de acessibilidade também não encontrou controles ou marcos sem nome, e a preferência de movimento reduzido permaneceu aplicada.

A suíte automatizada passou com **81 testes** e o build público foi concluído. Os testes novos cobrem projeção por ambiente, busca, favoritos, recentes, lote heterogêneo, exportações, máscara de CEP, endereço sintético, o verificador de 500 RENAVAMs distintos, lotes de 500 valores de cada utilitário de desenvolvimento, fixture financeira e crachá, além dos estados vazio, parcial, completo e legado da ficha cadastral.

---

## Home compacta e sidebar retrátil — 24/09/2026

A camada `assets/css/experience.css` e o controlador `assets/js/home-dashboard.js` adicionaram a sétima tela da aplicação. A home foi inspecionada vazia e com um CPF gerado, nos temas escuro e claro. A geração usa as mesmas funções dos painéis especializados; favoritos e recentes persistem somente IDs de ferramentas.

O comando `npm run audit:browser` mediu **sete painéis** em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Todos ficaram sem rolagem horizontal e sem elementos visíveis fora do viewport. O percurso somou **190 paradas de teclado**, sem controles sem nome, invisíveis ou sem contorno de foco. A árvore de acessibilidade não encontrou controles focáveis ou marcos sem nome. O movimento reduzido foi aplicado corretamente.

Capturas desta rodada:

- `artifacts/visual-review/thegenerator-home-dark.png`.
- `artifacts/visual-review/thegenerator-home-result-dark.png`.
- `artifacts/visual-review/thegenerator-desktop-light.png`.
- Capturas atualizadas de XML fiscal, Dados cadastrais, Cadastro geral, Editor XML, Validação XML e Assistente.

A primeira tentativa da auditoria encontrou apenas uma condição de corrida ao ler a porta temporária do Chrome; a repetição completou normalmente. Esta rodada é local e não altera a implantação pública.

---

## Revisão corporativa minimalista — 24/09/2026

A camada final `assets/css/minimal.css` foi revisada para unificar botões, campos, cards, tabelas, mensagens e foco, reduzindo superfícies aninhadas e efeitos decorativos. O Cadastro geral passou a uma coluna ampla; conteúdos auxiliares do Editor, do Assistente e dos históricos usam divulgação progressiva.

O comando `npm run audit:browser` mediu os seis painéis em uma janela física de 1280 × 900 com escala 2, equivalente a 640 × 450 px CSS. Todos ficaram sem rolagem horizontal e sem elementos visíveis fora do viewport. O percurso somou 153 paradas de teclado, com zero controles sem nome, invisíveis ou sem contorno de foco. A árvore de acessibilidade nativa não encontrou controles focáveis ou marcos sem nome. A preferência de movimento reduzido também foi aplicada corretamente.

Capturas desta rodada:

- `artifacts/visual-review/thegenerator-desktop-dark.png` e `thegenerator-desktop-light.png`.
- `artifacts/visual-review/thegenerator-docs-minimal-dark.png`.
- `artifacts/visual-review/thegenerator-cadastro-dark.png`.
- `artifacts/visual-review/thegenerator-editor-dark.png`.
- `artifacts/visual-review/thegenerator-validacao-dark.png`.
- `artifacts/visual-review/thegenerator-chat-dark.png`.

A verificação auditiva manual com leitor de tela real continua como uma etapa humana separada.

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

### Simplificação visual — 24/09/2026

A nova camada `minimal.css` reduziu o conteúdo simultâneo. Categorias de geradores, lote e histórico usam divulgação progressiva. A gaveta de atalhos foi posteriormente removida; cenários e campos da NF-e passaram a ficar visíveis diretamente.

A repetição da auditoria aprovou as seis telas em zoom simulado de 200%: nenhuma apresentou rolagem horizontal, elemento excedente, controle exposto sem nome, foco invisível ou foco sem contorno. A captura `thegenerator-docs-minimal-dark.png` registra a nova proporção da tela antes da geração.

A versão foi publicada no commit `39ddc28`; a Netlify concluiu o deploy de produção desse mesmo commit com estado `ready`.
