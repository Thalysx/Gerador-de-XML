# Revisão visual do FUTURE G — 05/10/2026

Implementação do briefing `FUTURE_G_PLANO_VISUAL_ATUALIZADO.txt`, entregue na versão `3.0.0-alpha.4` e registrada na change `simplify-visual-system-and-workspaces`, concluída com 8 de 8 tarefas e arquivada em 05/10/2026. A interface prioriza escolher, gerar, consultar o resultado e agir; configuração complementar aparece sob demanda. Geradores Gerais e QA Portuário usam a mesma base visual nos temas claro e escuro.

## Telas e componentes

| Tela | Alteração aplicada |
| --- | --- |
| Home | Busca, ferramentas e recentes em primeiro plano; categorias, favoritos, métricas e atividade em seções recolhidas. Links diretos para Editor, Validação e Assistente. Descrições dos geradores quebram linha. |
| Dados cadastrais | Botão Gerar visível para cada gerador individual selecionado; clique gera normalmente e Ctrl+Enter é opcional, sem selo no texto do botão. Preferências de máscara/nome recolhidas; configurações essenciais de telefone, placa e crachá continuam visíveis. Resultado persistente, Copiar/Baixar próximos dele e regeneração, detalhes e limpeza em Mais ações. Lote, histórico e conferência continuam disponíveis. |
| XML Fiscal | Gerar XML como ação principal, prévia e ações de uso visíveis. Campos completos, cenários e NCMs sob Editar campos e opções avançadas; preservação de campos e downloads complementares nas opções de geração. |
| Cadastro geral | Grupos ou tipo de entidade visíveis para gerar; resultado antes do formulário completo. Editar dados abre os campos existentes e move o foco, mantendo edição, histórico e exportação. |
| Editor XML | Controles, fontes, superfícies, bordas e estados alinhados aos tokens compartilhados. Título/importação usam XML; abas e cards carregados cabem no celular. Abrir pelo menu do gerador move o foco ao Editor; importação e edição preservadas. |
| Validação XML | Mesma base visual; severidades usam cores semânticas com rótulos, mantendo resumo, achados, XML e exportação. |
| Assistente | Conversa ocupa a área disponível; mensagem, anexo e enviar permanecem acessíveis. Modo, máscara, nova conversa e privacidade em Opções do assistente. Sugestões quebram linha no celular; detalhes de IA usam roxo. |

Os componentes compartilhados são `ui-primary`, `ui-secondary`, `ui-ghost`, `ui-danger`, `ui-disclosure` e `action-disclosure`. Disclosures usam `details/summary` nativos e conservam os mesmos campos, IDs, valores e handlers. O controller visual fecha opções com Escape ou clique externo, recupera foco e abre seções que contêm campos inválidos. Popovers respeitam a viewport e o espaço da sidebar, inclusive o menu de anexos em telas estreitas.

## Tokens e decisões visuais

Os tokens vivem em `assets/css/base.css`; aliases antigos são resolvidos no `body`, acompanhando o tema ativo.

| Token | Claro | Escuro |
| --- | --- | --- |
| `--background` | `#f7f8fa` | `#090d14` |
| `--sidebar` | `#f0f2f5` | `#0d131d` |
| `--surface` | `#ffffff` | `#111925` |
| `--surface-elevated` | `#f0f3f7` | `#16202e` |
| `--surface-hover` | `#e8edf3` | `#1d2a3b` |
| `--border` | `#dce2ea` | `#243044` |
| `--border-strong` | `#a9b6c7` | `#465973` |
| `--text-primary` | `#172033` | `#f8fafc` |
| `--text-secondary`, `--text-muted` | `#526176` | `#a8b5c7` |
| `--primary` / `--primary-hover` | `#2563eb` / `#1d4ed8` | mesmos valores |
| `--link`, `--border-focus` | `#1d4ed8`, `#2563eb` | `#7db6ff` |
| `--success` | `#167344` | `#4ade80` |
| `--warning` | `#895b08` | `#fbbf24` |
| `--danger` | `#b42332` | `#ff8993` |
| `--ai` | `#7043c1` | `#bca3ff` |

Há tokens complementares para superfícies e bordas semânticas, texto sobre ação primária, overlay, marcações dos documentos e código de barras. `--ui-space-0` a `--ui-space-6` representam 4/8/12/16/24/32/48 px; `--ui-radius-sm`, `--ui-radius` e `--ui-radius-lg` definem 8/12/16 px; `--ui-control` define 44 px.

Inter é a fonte da interface; DM Mono permanece em identificadores/XML. Títulos e labels deixam de depender de caixa alta. Superfícies neutras, divisórias discretas e menos caixas nos resultados substituem gradientes e decoração. Azul concentra interação e foco; verde, âmbar e vermelho indicam estados, acompanhados por texto/ícones. Roxo fica nos detalhes de IA. O texto secundário foi ajustado para contraste legível, inclusive quando o briefing sugeria um cinza mais claro.

O símbolo FUTURE G conserva seu desenho, com preenchimento azul plano nos dois SVGs usados pelo shell. Lucide vanilla continua sendo a biblioteca existente, com subset de 51 ícones e 11.744 bytes. A stack continua HTML/CSS/JavaScript; não foram adicionadas dependências nem introduzidos React/Tailwind ou shadcn/ui.

## Arquivos desta revisão

| Arquivos | Responsabilidade |
| --- | --- |
| `index.html` | Hierarquia, disclosures e reposicionamento dos controles existentes nas sete telas. |
| `assets/css/base.css` | Tokens, shell, tipografia, controles compartilhados, disclosures e feedback. |
| `assets/css/documentos.css`, `cadastro.css`, `evolucao.css` | Workspaces Dados/Cadastro, Home/XML/Assistente e layouts responsivos. |
| `assets/css/editor-xml.css`, `validacao-xml.css` | Consistência visual das ferramentas de XML. |
| `assets/js/visual-disclosure.js` | Novo controller de apresentação: abertura, fechamento, foco, posicionamento e estado visual. |
| `assets/js/interface.js`, `home-dashboard.js` | Cor do navegador acompanha o tema; atalho de privacidade abre as configurações sem fechamento imediato. |
| `assets/js/generator-workspace.js` | Botão Gerar disponível para cada gerador individual, mantendo geração direta de opções simples e atalho opcional. |
| `assets/js/lucide.min.js` | Subset regenerado pelo build. |
| `assets/brand/future-g-mark.svg`, `future-g-mark-general.svg` | Marca do shell sem gradiente. |
| `tests/projeto.test.cjs`, `scripts/audit-browser.cjs` | Contratos de apresentação, contraste, regressões, auditoria e matriz ampliada. |
| `README.md`, `CHANGELOG.md`, `ATUALIZACOES.md`, `docs/ui-architecture.md`, `docs/roadmap-consolidado.md`, este relatório | Documentação do resultado e da verificação. |
| `openspec/changes/archive/2026-10-05-simplify-visual-system-and-workspaces/`, `openspec/specs/app-shell/spec.md`, `openspec/specs/ui-system/spec.md` | Planejamento arquivado, tarefas concluídas e requisitos canônicos sincronizados. |

O arquivamento de `normalize-legacy-openspec-specs` e o registro do cancelamento de SEFAZ pertencem ao encerramento documental anterior. Continuam preservados no conjunto local de alterações.

## Verificação e evidências

- Suíte completa: **117 testes aprovados**, incluindo geração pelo clique em todos os adaptadores individuais e Ctrl+Enter opcional, opções fechadas, edição/restauração de Cadastro, preferências, XML, menus, foco, anexos e privacidade. O teste adicional verifica a navegação contextual ao Editor e preservação do XML original. Pares principais de texto/ação/status são verificados a partir dos tokens reais com contraste mínimo de 4,5:1.
- `npm run build`: aprovado; assets públicos preparados e subset de ícones regenerado.
- `openspec validate --all --strict --no-interactive`: **13 itens aprovados antes do arquivamento**, compreendendo 12 specs e a change; após o encerramento, as 12 specs são validadas novamente. `git diff --check`: sem erros.
- Auditoria Chrome: aprovada, console limpo, **152 passos de teclado** com nome, foco visível e contorno. Inclui viewport equivalente a zoom de 200%, navegação, busca global, movimento reduzido e resultado estruturado.
- Na rodada interativa, Telefone respeitou SP/Fixo, Cadastro gerou com edição recolhida e manteve o nome editado no resultado, CT-e seguiu para validação e Editor, Motorista mostrou sua projeção de dois campos e o Assistente local gerou três nomes. No celular, Escape recuperou foco no botão de anexos e preservou o CT-e pendente, sem enviar mensagem à IA.
- A rodada encontrou e corrigiu foco perdido ao abrir o Editor pelo menu e controles cortados no Editor carregado. A auditoria agora verifica foco no painel visível, fechamento do menu, fonte preservada e cópia integral. Mais **quatro casos de Editor carregado** (NF-e/CT-e × claro/escuro, 360 px) passaram sem controles fora da largura; incluem múltiplos arquivos e as projeções Produtos/Estrutura.
- Matriz: **224 combinações** = sete telas × dois ambientes × dois temas × quatro larguras (360/768/1280/1920) × dois estados da sidebar. Mais **56 estados com opções abertas** nas larguras 360 e 1280; nenhum controle excedente ou overflow horizontal detectado. Capturas representativas foram inspecionadas nos dois temas, incluindo opções e anexos no celular.
- Orçamentos: runtime de ícones 11.744 B, JavaScript local 349.000 B, CSS local 111.779 B e 1.510 nós DOM, dentro dos limites existentes.

A prévia estruturada atual continua mostrando até quatro campos; cópia, download, detalhes e histórico conservam o conteúdo completo. A auditoria usa o Motorista individual real de dois campos e, separadamente, uma fixture longa de cadastro com 18 campos para verificar duas/uma colunas e reset do scroll interno (`2146 → 0`) sem mover a página (`80 → 80`). Não modifica o contrato do gerador para satisfazer o teste.

Evidências locais: [auditoria Chrome](../artifacts/visual-review/auditoria-200.json), [medições responsivas](../../artifacts/refactor-the-generator-ui/final/measurements.json), [Home escura](../../artifacts/refactor-the-generator-ui/final/1280-general-dark-home.png), [opções do Assistente no celular](../../artifacts/refactor-the-generator-ui/final/360-general-light-chat-expanded.png), [foco no Editor](../artifacts/visual-review/future-g-contextual-editor.png) e [Editor com NF-e no celular](../artifacts/visual-review/future-g-loaded-editor-nfe-dark-mobile.png). Esses arquivos ficam nos diretórios de artifacts ignorados pelo Git.

## Limites da revisão manual

A auditoria usa Chrome headless em Windows e recursos locais, retirando dependências CDN para verificar degradação offline. Ainda cabe conferir renderização em Safari/Firefox, dispositivo com teclado virtual e interação das integrações CDN/Bootstrap disponíveis. O roteiro com leitor de tela real permanece pendente; testes de nome/foco não substituem essa verificação.

O status da IA na auditoria local é simulado como não configurado. A suíte cobre os contratos locais/API/provider/armazenamento; esta revisão não certifica disponibilidade de um provider externo nem Redis real. A referência DataSeed não pôde ser aberta durante a sessão; as decisões foram aplicadas a partir do briefing e da interface local, sem afirmar comparação visual com o site.

Regras de geração, XML, validação fiscal local, APIs, schemas, formatos/chaves de histórico e armazenamento foram preservados. Recursos ilustrativos ausentes no briefing não foram adicionados. SEFAZ permanece cancelada. O estado da publicação desta versão será registrado em `VERIFICACAO-PRODUCAO.md` após confirmação do deploy.
