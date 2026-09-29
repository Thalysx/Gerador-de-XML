# FUTURE G — UI System

Fase `future-g-05-ui-system` concluída em 25 de setembro de 2026.

## Resultado

- Geradores determinísticos simples executam ao ativar a própria opção na Home ou em Dados cadastrais.
- Telefone e Placa conservam o botão Gerar porque dependem de configuração prévia; lote, XML e Cadastro Geral mantêm seus fluxos próprios.
- Busca e categoria aparecem no topo da configuração e continuam projetadas pelo ambiente ativo.
- Categorias primárias são seções visíveis, sem accordions; lote, histórico, privacidade e opções avançadas permanecem recolhíveis quando há justificativa.
- O resultado existe desde a entrada, usa empty state e é atualizado no mesmo painel.
- Copiar troca temporariamente para Copiado; Gerar novamente e o painel de resultado têm feedback curto, sem loading artificial.
- O Assistente usa toda a área de conteúdo do shell, com mensagens ao centro, sugestões e compositor na região inferior e anexos no botão `+`.
- Cadastro Geral permanece exclusivo de Geradores Gerais e não contém contêiner, lacre ou linguagem de motorista/transportadora. Esses geradores continuam disponíveis no QA Portuário.

## Decisões técnicas

- shadcn/ui não foi incorporado: o projeto usa HTML, CSS e JavaScript clássicos, sem React ou Tailwind; adicioná-lo exigiria a reescrita proibida pelo escopo.
- Lucide vanilla `1.44.0` foi incorporado como conjunto padrão e versionado localmente. Bootstrap Icons e os SVGs manuais de interface foram removidos; conteúdo criado dinamicamente é convertido pelo adaptador `assets/js/icons.js`, e ações somente por ícone mantêm nome acessível.
- `openGenerator(id)` continua responsável apenas por abrir/configurar uma ferramenta. `activateGenerator(id)` representa a ação do usuário e dispara imediatamente somente geradores simples.
- `requiresConfiguration` torna explícitos os geradores que conservam uma etapa de configuração.
- Históricos antigos continuam legíveis, mas campos portuários legados não são reapresentados dentro de Cadastro Geral.

## Arquivos alterados

- `index.html`
- `assets/css/base.css`
- `assets/css/documentos.css`
- `assets/css/evolucao.css`
- `assets/css/editor-xml.css`
- `assets/js/cadastro.js`
- `assets/js/editor-xml.js`
- `assets/js/generator-registry.js`
- `assets/js/generator-workspace.js`
- `assets/js/historico.js`
- `assets/js/home-dashboard.js`
- `assets/js/documentos.js`
- `assets/js/gerador-xml.js`
- `assets/js/icons.js`
- `assets/js/interface.js`
- `assets/js/lucide.min.js`
- `assets/js/visual-layout.js`
- `package.json`
- `package-lock.json`
- `tests/projeto.test.cjs`
- `docs/ui-architecture.md`
- `CHANGELOG.md`
- `openspec/changes/archive/2026-09-25-future-g-05-ui-system/*`
- `openspec/specs/ui-system/spec.md`

## Verificações

- `openspec validate ui-system --type spec --strict`: especificação principal aprovada.
- `openspec validate --archived --strict --report findings`: 5 mudanças arquivadas aprovadas, sem achados.
- `npm test`: 73 testes aprovados, 0 falhas.
- `npm run build`: aprovado.
- `npm run audit:browser`: sete painéis sem overflow; 209 passos de teclado; nenhum controle ou marco sem nome; movimento reduzido aplicado.
- `AUDIT_MATRIX=1 node scripts/audit-browser.cjs`: 112 capturas em 360, 768, 1280 e 1920 px, claro/escuro e sidebar expandida/recolhida; zero falhas.
- Inspeção visual: Dados cadastrais, Cadastro Geral e Assistente conferidos em mobile e desktop.
- Lint: não existe script de lint no `package.json`.

## Pendências

Nenhuma regressão conhecida no fechamento desta fase. `future-g-06-general-generators` não foi iniciado automaticamente durante seu arquivamento; seu início posterior está registrado em `docs/future-g-06-general-generators.md`.
