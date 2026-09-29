# FUTURE G 03 — migração dos geradores existentes

## Resultado

Os sete módulos existentes estão consolidados no shell FUTURE G e cada gerador possui uma única rota canônica. A fase foi tratada como uma migração de paridade: os adaptadores do registry e dos workspaces encaminham as ações aos motores existentes, sem criar catálogos, shells ou algoritmos paralelos.

## Inventário de funcionalidades

| Entrada FUTURE G | Módulos proprietários | Comportamento preservado |
| --- | --- | --- |
| Início | `home-dashboard.js`, `generator-registry.js` | busca, categorias, favoritos, recentes e abertura por ID |
| XML fiscal | `gerador-xml.js`, `modelos-xml.js`, `produtos.js`, `xml-workflow.js` | NF-e/CT-e, cenários, campos bloqueados, produtos, prévia, cópia, download e envio ao editor/validador |
| Dados cadastrais | `generator-workspace.js`, `documentos.js`, `geracao-dados.js`, `historico.js` | documentos individuais, variantes, opções, validação, histórico, lote, cópia e exportação |
| Cadastro geral | `cadastro.js`, `historico.js` | geração completa/por campo, edição, cópia, JSON, histórico e restauração |
| Editor XML | `editor-xml.js` | importação, edição, mapeamento, cópia e download |
| Validação XML | `validacao-xml.js` | arquivo/texto/XML atual, sintaxe, consistência, filtros e relatório |
| Assistente | `chat.js`, `chat-formatacao.js`, `chat-ia.js` | modo local, IA opcional, anexo explícito, renderização segura, resultados, recuperação e conversa |
| API de IA | `http-api.cjs`, `netlify-adapter.cjs`, `provider.cjs`, `session-store.cjs` e funções Netlify | credenciais no servidor, sessão, limites, cookies e respostas sem vazamento |

## Decisões arquiteturais

- `APP_NAVIGATION` e `GENERATORS` são as fontes canônicas de rotas e ferramentas; cada rota possui exatamente um painel existente.
- A Home continua apenas como descoberta. Geração, resultado, histórico e exportação pertencem aos workspaces.
- Scripts de domínio continuam responsáveis por formatos, dígitos, XML e exportação. Os adaptadores de migração apenas selecionam e apresentam esses comportamentos.
- A ordem de scripts clássicos permanece compatível com o motor JSDOM usado pelo backend; não houve conversão oportunista para módulos ES.
- O modo local do Assistente permanece independente de IA. O modo remoto continua usando `/api/status` e `/api/chat`, com sessão e segredos no servidor.
- O lote continua usando `TIPOS_DADOS` como contrato integral e a projeção do ambiente somente para apresentação.

## Verificações de paridade

- Todos os sete IDs de navegação possuem exatamente um botão e um painel.
- Todas as rotas declaradas pelos geradores resolvem para uma entrada de navegação.
- Cada script crítico de registry, workspace, XML, validação e Assistente é carregado uma única vez.
- Não existem `HOME_GENERATORS`, resultado independente na Home ou segundo shell legado.
- Adaptadores individuais preservam tipo, formato, ações e um único registro de histórico.
- NF-e/CT-e preservam produtos, cenários, locks, edição, validação e download.
- IA local/remota, anexos, sessões e falhas recuperáveis continuam cobertos.
- Lotes preservam limite de 500, não repetição, prévia de 50, cópia e exportação integral.

## Arquivos criados ou modificados nesta fase

- `tests/projeto.test.cjs`
- `docs/future-g-03-existing-generators-migration.md`
- `openspec/changes/future-g-03-existing-generators-migration/proposal.md`
- `openspec/changes/future-g-03-existing-generators-migration/design.md`
- `openspec/changes/future-g-03-existing-generators-migration/specs/*/spec.md`
- `openspec/changes/future-g-03-existing-generators-migration/tasks.md`
- `openspec/specs/general-generators/spec.md`
- `openspec/specs/batch-generation/spec.md`
- `openspec/specs/xml-validation/spec.md`
- `openspec/specs/ai-assistant/spec.md`

## Testes e validação

- `npm test`: 67/67 testes aprovados.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: sete painéis aprovados, sem overflow horizontal, controles sem nome ou foco invisível.
- `openspec validate future-g-03-existing-generators-migration --strict`: mudança válida.
- Especificações principais `general-generators`, `batch-generation`, `xml-validation` e `ai-assistant`: válidas em modo estrito.

## Riscos e limites restantes

- A interação de anexo por botão `+` e o auto-scroll refinado do chat pertencem à fase 04; esta fase preserva o comportamento existente sem antecipar essa UX.
- Novos geradores gerais, portuários ou cenários não fazem parte desta migração.
- Não foram encontradas regressões em geração, XML, IA, lote, cópia, exportação, build ou auditoria de navegador.
- A próxima mudança OpenSpec não foi iniciada.
