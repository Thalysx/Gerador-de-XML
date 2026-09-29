# FUTURE G 10 — Produtividade

Fase concluída localmente em 28/09/2026, sem iniciar a mudança seguinte do roadmap.

## Entrega

- Busca global por `Ctrl+K` sobre ferramentas e áreas do ambiente ativo, com navegação por setas, abertura por Enter, fechamento por Escape, retorno do foco e contenção de Tab.
- Favoritos e recentes continuam derivados do registry e agora alimentam também os indicadores do dashboard, sem apagar preferências incompatíveis ao trocar de ambiente.
- Atividade produtiva separada dos históricos detalhados, limitada a 50 entradas e composta somente por identificador, ambiente, tipo de ação, quantidade e horário.
- Dashboard específico para Geradores Gerais com ferramentas, favoritos, atividades e lotes recentes.
- Dashboard específico para QA Portuário com ferramentas, favoritos, atividades e massas de cenário.
- Exportação completa de lotes em JSON, CSV e TXT com nomes que identificam ambiente e gerador, sem aplicar o limite visual de 50 registros.

## Decisões de arquitetura

`assets/js/productivity.js` consome `GENERATORS`, `APP_NAVIGATION` e suas projeções existentes. Não mantém um catálogo paralelo e usa os mesmos caminhos `activateGenerator` e `switchTab` ao abrir resultados.

O ledger `futureg:activity-v1` possui allowlist rígida. Argumentos como resultado, prompt, anexo, segredo ou token não atravessam a normalização, inclusive ao restaurar dados locais. Os históricos detalhados anteriores permanecem separados porque suportam restauração explícita de massas sintéticas.

A geração individual, XML, lote, cenário e exportação registram metadados mínimos. A limpeza do painel remove apenas eventos do ambiente ativo; favoritos, recentes, resultados e o outro ambiente permanecem intactos.

## Arquivos

Criado:

- `assets/js/productivity.js`
- `docs/future-g-10-productivity.md`

Modificados nesta entrega:

- `index.html`
- `assets/css/evolucao.css`
- `assets/js/generator-registry.js`
- `assets/js/home-dashboard.js`
- `assets/js/chat.js`
- `assets/js/geracao-dados.js`
- `assets/js/test-scenarios.js`
- `tests/projeto.test.cjs`
- `README.md`
- `CHANGELOG.md`
- `ATUALIZACOES.md`
- `AUDITORIA-VISUAL.md`
- `docs/ui-architecture.md`
- `openspec/specs/history-favorites/spec.md`
- `openspec/specs/export-accessibility/spec.md`
- `openspec/specs/navigation/spec.md`
- `openspec/changes/archive/2026-09-28-future-g-10-productivity/proposal.md`
- `openspec/changes/archive/2026-09-28-future-g-10-productivity/design.md`
- `openspec/changes/archive/2026-09-28-future-g-10-productivity/tasks.md`

## Verificação

- `npm test`: 102 testes aprovados, 0 falhas.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: oito telas aprovadas em Chromium a 200%, 244 passos de teclado, sem overflow horizontal, controle sem nome, foco invisível ou foco sem contorno.
- A cobertura específica verifica abertura e teclado do `Ctrl+K`, isolamento por ambiente, allowlist de privacidade, dashboards, favoritos projetados e exportação integral de 75 registros com nome contextual.

## Limites e riscos

- Busca e histórico são locais ao navegador; não há sincronização entre dispositivos ou usuários.
- O dashboard conta somente as 50 atividades mais recentes e não é uma ferramenta analítica permanente.
- CSV, JSON e TXT cobrem geradores em lote. XML mantém seu download especializado e cenários mantêm JSON próprio.
- Nenhuma regressão conhecida permaneceu após a suíte completa, o build e a auditoria de navegador.
