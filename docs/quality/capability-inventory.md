# BASE-09 — inventário documental

Entrega local de 07/11/2026 no checkout `future-g-e2e`. Change `align-current-capability-inventory`; trabalho anterior preservado.

README e planos apresentavam dez fluxos operacionais portuários como disponíveis. O runtime tem sete áreas em `APP_NAVIGATION`, não carrega `assets/js/test-scenarios.js`, não expõe painel/rota `scenarios` e não define `gerarCenarioTeste`. O teste existente confirma essa ausência. Já os cenários XML salvos permanecem em XML fiscal, com salvar/carregar/excluir até 20 configurações do formulário. A revisão documental separa esses dois recursos sem restaurar a biblioteca ausente.

O [inventário vigente](../current-capabilities.md) reúne áreas, disponibilidade, fontes de código e comportamento de produtividade. README remove o arquivo ausente de sua tabela atual, descreve cenários XML salvos e corrige a alegação de cobertura operacional. Roadmap e plano mestre apresentam o estado vigente antes das decisões históricas. Os relatórios das fases 09/10 passam a identificar seu conteúdo, arquivos e contagens como históricos; seus corpos e arquivos OpenSpec arquivados anteriores não foram reescritos.

A spec `history-favorites` ainda exigia dashboards por ambiente e massas de cenário. Ela foi alinhada ao comportamento já implementado em `productivity.js` e coberto por testes: favoritos/atividade juntos no catálogo, entradas legadas preservadas como metadados, limite de 50 e limpeza de toda a atividade sem apagar favoritos/históricos detalhados. Essa atualização documental não muda código, persistência ou regras de geração.

## Verificação

- **145/145 testes Node**, sem falhas, skips ou cancelamentos; build aprovado.
- A suíte existente confirma ausência dos cenários operacionais, presença/restauração dos cenários XML salvos, catálogo único, favoritos conjuntos, privacidade e limpeza da atividade legada. Nenhum teste foi adicionado, alterado ou enfraquecido para acompanhar o texto.
- **85 links locais em dez documentos** conferidos, incluindo os links novos nos relatórios históricos; nenhum destino ou âncora ausente. Referências históricas em código literal a arquivos ausentes permanecem identificadas como históricas, não como links ou arquivos atuais.
- Hashes de **104 arquivos** de aplicação, scripts, testes, schemas, HTML, manifestos de dependências e configuração E2E conferidos antes/depois: nenhum arquivo alterado nesta etapa. As mudanças locais anteriores de BASE-02/04/08 continuam presentes.
- Change e spec `history-favorites` aprovadas pela CLI OpenSpec em modo estrito. A validação global mantém somente os dois avisos legados de requisitos longos em `ai-assistant` e `ui-system`.
- E2E, auditor padrão e matriz visual **não foram repetidos nesta etapa somente documental**. A última etapa funcional BASE-08 registrou 20/20 E2E e auditorias aprovados; esses resultados não são apresentados como novas execuções de BASE-09.

Evidências locais ignoradas pelo Git e fora do build público:

- `artifacts/base-09-node.log` e `base-09-build.log`.
- `artifacts/base-09-source-before.json`, `base-09-source-integrity.cjs` e `base-09-source-verification.json`.
- `artifacts/base-09-links.cjs` e `base-09-links.json`: conferência de destinos e âncoras dos documentos atuais revisados.
- `artifacts/base-09-openspec-global.json`: avisos globais preservados.

Arquivos atuais revistos: `README.md`, `docs/current-capabilities.md`, `docs/roadmap-consolidado.md`, `docs/FUTURE_G_PLANO_CONSOLIDADO_ROADMAP_ATUALIZADO.md` e `openspec/specs/history-favorites/spec.md`. Relatórios das fases 09/10 receberam identificação histórica. Changelog, atualizações e pendências registram a correção; os demais planos históricos continuam sujeitos à leitura do inventário vigente.

Change arquivada em `openspec/changes/archive/2026-11-07-align-current-capability-inventory/`, com requisito canônico sincronizado. Nenhuma tela, motor, fluxo, dependência ou dado persistido foi criado ou modificado. Sem novo commit, push, PR ou deploy. BASE-10 e os dois avisos OpenSpec legados permanecem; nenhuma fase seguinte foi iniciada.
