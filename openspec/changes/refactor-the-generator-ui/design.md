# Design

## Context

Ver motivação em `proposal.md`. Auditoria estática realizada em 24/09/2026, antes das tasks. Alvo: `projeto/`, conforme arquivo ativo, scripts de build e presença da Home descrita. Há cópias na raiz, `visual-lab/` e `artifacts/`; sua existência não comprova que sejam entradas de produção. Não foram alteradas. Não há specs anteriores nem repositório Git na raiz consultada. Esta proposta não executou auditoria visual em navegador nem a suíte de testes; efeitos visuais abaixo são riscos demonstrados pelas regras, não screenshots observadas.

### Duplicidades e lógica encontradas

| Evidência | Achado e consequência |
| --- | --- |
| `assets/js/home-dashboard.js:10`, `index.html:273–292`, `assets/js/geracao-dados.js:35` | `HOME_GENERATORS`, botões inline categorizados e `TIPOS_DADOS` mantêm inventários independentes. Home tem 18 entradas e não representa todos os tipos do lote, como lacre e motorista. |
| `home-dashboard.js`, `homeGenerateDocument`, `homeGenerateSelected`, `homeReadDocumentResult` | Dispatch próprio, seleção, busy, resultado, cópia e detalhes; chama geradores existentes e lê o DOM de outra tela. Não constitui um segundo algoritmo matemático completo, mas duplica orquestração e apresentação. |
| `homeOpenSelectedTool`, `visual-layout.js:filtrarGeradores` | Navegação escreve rótulo em `docs-search`; filtro examina texto dos botões, sem selecionar ID. Placa antiga perde a variante ao remover palavras; Razão social difere do rótulo legado. Telefone existe em `index.html:287` e `documentos.js:382`; a inspeção não prova que a substring Telefone falhe, mas prova ausência de seleção/configuração explícita. |
| `home-dashboard.js:conteiner`, `geracao-dados.js:TIPOS_DADOS` | Na Home `conteiner` significa contêiner e lacre; no domínio `conteiner` e `conteiner-lacre` são distintos. Uma migração ingênua muda o significado dos favoritos. |
| `documentos.js:baixarResultadoDocumento`, `geracao-dados.js:TIPOS_DADOS` | Rótulos repetidos; `currentType/currentValue`, `homeState.result` e `ultimoLote` têm diferentes donos. Separar estado individual/lote é legítimo; duplicar o mesmo resultado na Home não é. |
| `documentos.js:gerarCPF`, `geracao-dados.js:gerarCPFRaw` | O fluxo individual já reutiliza o gerador bruto do lote; manter essa delegação e cobri-la com testes dos dígitos, máscaras e não repetição, sem mudar regras. |
| `index.html:38,57,69,71`, `homeApplySidebar`, `definirMenuFerramentas` | Marca no header, botão textual, checkbox redundante e controle mobile separado; estado do shell está dentro do módulo Home. |
| `showHomeToast`, `utils.js:mostrarStatus/copiarTexto` | Feedback de cópia pode usar status global e toast simultaneamente; centralizar anúncio sem duplicação. |
| `chat-ia.js:93,118` | Falha em `file:` exibe comando npm e catch repassa mensagem de erro como experiência principal. |

Todos os caminhos desta auditoria, salvo indicação contrária, são relativos a `projeto/`.

### CSS conflitante

`index.html:21–31` carrega nesta ordem: base, documentos, cadastro, editor-xml, evolucao, validacao-xml, visual-lab, portus, usabilidade, minimal, experience (além de Bootstrap). Não é apenas duplicação de paleta: o teste atual verifica `--bg` somente em base.css, mas não controla propriedade dos componentes.

| Conjunto | Conflito observado | Destino recomendado |
| --- | --- | --- |
| base → visual-lab → portus → usabilidade → experience | `body` padding, `.workspace-nav` largura/posição e breakpoints alternam sidebar fixa, ícones e menu; portus usa 238px, usabilidade 220px, experience tokens 220/72px. | Um shell em base, com breakpoints únicos e estado explícito. |
| base → portus → minimal → experience | `.page-header`, título e espaçamentos redefinidos; experience cria grid de três colunas para marca no topo. | Header de contexto e ações no shell; marca na sidebar. |
| base → portus → minimal | `.btn-primary` começa com gradientes, portus usa accent, minimal torna primário neutro e usa `!important` em `.ui-primary/.btn-accent`; seletor global `button` afeta todas as ferramentas. | Variantes semânticas comuns em base; classes específicas somente para layout local. |
| documentos → visual-lab/portus → minimal | `.doc-gen-wrapper` e painéis redefinidos; minimal usa `:has()` sobre style inline para ocultar resultado e centralizar configuração em 760px. | Layout Configuração/Resultado em documentos.css; estado vazio explícito e resultado sempre presente. |
| cadastro → minimal; evolucao/editor-xml/validacao → minimal | Layout do cadastro passa a uma coluna com max-width 1100px; painéis, tabelas, modal, inputs e chat são remodelados fora dos arquivos proprietários. | Componentes comuns em base e estilos específicos nos arquivos de domínio. |
| usabilidade/minimal/experience | Regras `[hidden]`, foco, movimento reduzido e media queries misturadas a overrides cosméticos. | Preservar regras funcionais e de acessibilidade ao migrar; não excluir arquivos em bloco. |

### Componentes reutilizáveis e arquivos afetados

- `interface.js`: `switchTab`, teclado das abas, tema e integração Tooltip. Extrair propriedade do shell de `home-dashboard.js` e atualização de contexto de `visual-layout.js`; manter APIs de compatibilidade enquanto chamadas inline existirem.
- `utils.js`, `storage.js`: escape, copiar, download/feedback e persistência segura. Consolidar feedback acessível aqui, sem recriar um sistema para cada página.
- `documentos.js`, `geracao-dados.js`, `aleatorio.js`, `catalogos.js`: geração, formatação, validação e não repetição existentes. Reusar motores e extrair somente duplicações comprovadas.
- `historico.js`: preservar armazenamento, restauração, cópia e índices após filtro. Recentes de ferramentas não substituem histórico de dados.
- `cadastro.js`, `gerador-xml.js`, `xml-workflow.js`, `editor-xml.js`, `validacao-xml.js`: preservar operações e IDs de campos durante a migração visual.
- `chat.js`, `chat-ia.js`, `chat-formatacao.js`: manter modo local, IA, confirmação de sugestões, anexos explícitos e renderização segura.
- `index.html`, os onze CSS carregados, `home-dashboard.js`, `visual-layout.js`, `app.js`, `interface.js` e novos módulos JS limitados ao registry/controlador: superfície principal da mudança.
- `tests/projeto.test.cjs` contém contratos de Home antiga e checkbox que precisarão ser substituídos por equivalentes comportamentais; manter testes de domínio, XML, exportações e segurança. `tests/ai.test.cjs`, `http-api.test.cjs`, `provider.test.cjs`, `session-store.test.cjs`, `netlify.test.cjs` e `scripts/engine.cjs` são fronteiras de regressão. `scripts/build.cjs` copia scripts/CSS e deve continuar produzindo o mesmo aplicativo.

## Goals / Non-Goals

**Goals:** propriedade clara de shell, estilos, catálogo e execução; compatibilidade incremental com scripts clássicos, callbacks e persistência; resultado como foco do trabalho sem ampliar cards artificialmente.

**Non-Goals:** framework novo, router de terceiros, reescrita do backend, FUTURE G, novos geradores, alteração fiscal/documental, exclusão automática de cópias externas ao alvo. Não mudar formatos públicos nem limites de geração.

## Decisions

### 1. Um shell compartilhado

`interface.js` será dono da navegação e do estado da sidebar; Home não inicializa mais controles globais. Mover marca existente para o topo do nav. Um botão de ícone permanece acessível tanto expandido quanto recolhido, com nome dinâmico, `aria-expanded`, `aria-controls`, tooltip em hover/foco e preferência persistida. No mobile, o mesmo controle deve ficar alcançável quando o menu estiver fechado; Escape fecha e devolve foco. Não duplicar checkbox, botão textual ou listener. Usar o menu de abas existente evita trocar todo o roteamento; header atualiza diretamente no fluxo de navegação, sem depender de observer cosmético.

### 2. Consolidar CSS por propriedade

Manter `base.css` como dono de tokens claros/escuros, tipografia, shell e componentes compartilhados. Migrar estilos de domínio para documentos, cadastro, editor-xml, validacao-xml e evolucao (XML/chat) já existentes. Remover regras correspondentes de visual-lab, portus, usabilidade, minimal e experience no mesmo incremento em que a propriedade é transferida; ao final remover imports e arquivos vazios/obsoletos. Não adicionar um décimo segundo CSS global. Preservar Bootstrap como infraestrutura existente de modais/tooltips; conter colisões de `.btn` por variantes explícitas. Alternativa rejeitada: aumentar especificidade ou espalhar `!important` para vencer a cascata.

Tokens cobrem superfície, texto, borda neutra, accent, foco, sucesso, alerta, erro, espaçamento, raio, altura de controle e movimento. Roxo indica ação/foco/seleção, não borda de todo painel. Componentes: botão primário/secundário/terciário/destrutivo/ícone; input/select/textarea; card/painel; resultado; modal; tooltip; toast; loading/erro/sucesso/vazio/disabled. Uma implementação visual por componente, usada em todas as páginas, inclusive antes de migrar seus layouts internos.

### 3. Registry único com compatibilidade explícita

Adicionar `generator-registry.js` com IDs estáveis, label, descrição, categoria, aliases de busca, ícone, prioridade, destino, tipo de domínio, opções de variante e capacidades suportadas (individual/lote/validação). Adaptadores referenciam funções existentes; não copiam algoritmos. `TIPOS_DADOS` torna-se projeção compatível do registry para consumidores existentes, sem incluir tipos que o lote não suporta. Remover `HOME_GENERATORS`, mapas locais de nomes e botões manuais progressivamente.

IDs canônicos mantêm `cpf`, `cnpj`, `cnpj-alfa`, `telefone`, `placa`, `placa-antiga`, `conteiner`, `conteiner-lacre`, `lacre`, `nome`, `empresa`, `rg`, `cnh`, `email`, `imo`, `booking`, `due`, `motorista`, `cadastro`, `nfe`, `cte`. `placa-antiga` adapta tipo `placa` com opção antiga; `cadastro` distingue destino de workspace e capacidade de lote sem colapsar suas operações. Inventariar outras ações legadas antes de finalizar cobertura, sem promover ações de copiar/validar a geradores.

Migrar favoritos/recentes antigos `conteiner` para `conteiner-lacre` somente no contexto das chaves antigas da Home, com marcador de versão para execução única. Não remapear o tipo `conteiner` do domínio/histórico. Preservar demais IDs, limites atuais de favoritos (8) e recentes (5); IDs desconhecidos não causam crash. Não apagar históricos. Metadados não são uma nova engine.

### 4. Navegar por identidade, buscar por texto

Contrato proposto `openGenerator(id)`: resolver registry, ativar destino, selecionar ID e variante, revelar configuração pertinente e mover foco ao título/configuração. Não preencher busca nem disparar geração implicitamente; filtros anteriores não impedem abertura. ID inválido produz feedback recuperável e preserva estado atual. Busca usa metadados e aliases apenas para descoberta. Testar telefone com filtro anterior incompatível, placa antiga e CNPJ alfa para evitar falsos positivos por rótulo.

### 5. Uma execução e um resultado por workspace

Home renderiza descoberta, categorias, favoritos e recentes, sem resultado/busy/dispatch próprios. Clique abre o workspace; ações de gerar/regenerar/copiar/expandir/limpar continuam disponíveis lá. Não excluir funcionalidades ao eliminar sua apresentação duplicada. Recentes são atualizados pelo evento comum de geração bem-sucedida em qualquer workspace, mantendo o significado atual de tipos usados. Controller de Dados Cadastrais seleciona gerador e executa adaptador que conserva histórico e efeitos associados uma única vez; convergir caminhos individual/lote apenas onde equivalente.

Desktop: configuração de largura controlada e resultado com espaço flexível; resultado vazio permanece visível, evitando saltos de layout. Mobile: configuração seguida de resultado com foco/anúncio após geração. Lote e validação são modos/seções acessíveis do mesmo workspace; histórico tem divulgação progressiva, filtros e restauração. Não trocar prévia limitada por truncamento de exportação. Cadastro/XML preservam campos, locks, produtos, cenários, prévia, importação, edição, download e validação.

### 6. Assistente com falhas orientadas ao usuário

Mapear conexão, indisponibilidade, timeout, limite, sessão expirada e falha desconhecida a mensagens curtas e ações pertinentes (tentar novamente, revisar pedido, escolher modo local). Não expor npm, stack ou configuração de servidor como mensagem principal. Preservar rascunho, conversa, anexos e consentimento; não reenviar automaticamente nem mudar para modo local silenciosamente. Manter detalhes técnicos no diagnóstico apropriado sem revelar segredos.

## Risks / Trade-offs

- [Remover IDs ou mudar ordem de scripts quebra engine JSDOM do backend] → preservar IDs/adaptadores durante transição; executar testes de engine/API além dos testes DOM.
- [Unificar individual/lote altera máscara, nome associado, variante, dígito ou histórico] → caracterização de contratos antes de extração; mesma entrada/opções e invariantes de saída, não igualdade de valores aleatórios.
- [Renomear contêiner muda favoritos existentes] → migração versionada e contextual; fixtures de persistência antiga e recarga.
- [CSS morto aparente inclui regras funcionais] → inventário por seletor e dono, inspeção de computed styles e testes visuais em ambos os temas antes de remover cada import.
- [Migração gradual mantém duas aparências] → aplicar base compartilhada a todas as telas na fase 3; adaptar layouts depois, sem manter dois shells ou duas versões visíveis da mesma tela.
- [Home exige um passo adicional] → acesso direto por card/favorito ao gerador selecionado com foco correto; todas as ações ficam reunidas no workspace.
- [Testes atuais validam DOM antigo] → substituir assertivas de apresentação somente após existir cobertura equivalente de comportamento; não apagar testes de negócio para obter verde.

## Migration Plan

Nove incrementos na ordem solicitada. Cada incremento deve iniciar e terminar com aplicação utilizável; transferir responsabilidade e remover origem conjuntamente. Fase 1 complementa esta auditoria com baseline executável e visual, não repete descoberta genérica. Fases 2–3 estabelecem shell e linguagem comum; fase 4 liga registry a consumidores por adaptadores; fase 5 elimina fluxo de geração da Home; fase 6 reorganiza workspace; fases 7–8 migram demais telas; fase 9 remove só legado comprovadamente sem referências.

Verificar em 360, 768, 1280 e 1920px, claro/escuro, sidebar aberta/recolhida, teclado, zoom de 200% e movimento reduzido. Em telas grandes, resultado e áreas de trabalho usam espaço disponível sem esticar cards de descoberta; em telas pequenas não há rolagem horizontal da página (XML/tabelas podem rolar dentro do painel). Contraste mínimo de texto comum 4,5:1, foco visível e tooltips acionáveis por teclado.

Antes da implementação, obter baseline via `npm test` em `projeto/`, registrar falhas preexistentes e snapshots por tela. Por etapa executar testes pertinentes; ao final suíte completa, build e auditoria de navegador. Rollback por incremento deve restaurar markup, scripts e estilos juntos a partir de backup/controle de versão estabelecido antes da edição; migrações de preferências preservam dados legíveis pelo leitor compatível. Não depender de Git disponível na raiz nem limpar localStorage para resolver incompatibilidade.
