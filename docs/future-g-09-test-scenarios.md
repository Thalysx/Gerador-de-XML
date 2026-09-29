# FUTURE G 09 — Cenários de teste coerentes

Fase concluída localmente em 28/09/2026, sem iniciar a mudança seguinte do roadmap.

## Entrega

- Biblioteca inicial com Gate IN, Gate OUT, Recebimento, Expedição, Agendamento, processos internos de entrada e saída, operações com contêiner e carga solta e fluxo operacional completo.
- Modelo versionado `future-g.test-scenario.v1`, com IDs próprios para cenário, processo, agendamento, motorista, transportadora, veículo, contêiner e carga.
- Etapas ordenadas de processo interno a Gate OUT, selecionadas de acordo com cada fluxo e ligadas às mesmas referências.
- Relações consistentes entre motorista, veículo, contêiner e carga, incluindo número, lacre, pesos e ausência explícita de contêiner na carga solta.
- Modos Válido, Inválido intencional e Aleatório. O modo inválido altera uma regra de negócio identificada sem corromper os vínculos entre entidades.
- Workspace exclusivo do QA Portuário com inspeção do JSON, cópia, download, histórico local de até 20 massas, restauração e limpeza.

## Decisões de arquitetura

O motor de cenários foi isolado em `assets/js/test-scenarios.js` e reutiliza os geradores portuários existentes. O cenário agrega resultados estruturados, mas não duplica algoritmos de CPF, placas, contêineres ou cargas.

O objeto `referencias` é a fonte canônica dos vínculos. Cada etapa recebe uma cópia das mesmas referências, e a verificação dedicada separa quebra referencial de inconsistência de negócio intencional. Assim, um CPF inválido ou dígito ISO alterado continua sendo um teste negativo coerente, enquanto a troca acidental de um `motorista_id` é reportada como erro estrutural.

A área aparece como rota própria apenas no QA Portuário. A persistência usa `gerador:cenarios_teste`, contém somente dados sintéticos e é limitada aos 20 itens mais recentes.

## Arquivos

Criado:

- `assets/js/test-scenarios.js`
- `docs/future-g-09-test-scenarios.md`
- `openspec/specs/test-scenarios/spec.md`

Modificados nesta entrega:

- `index.html`
- `assets/css/evolucao.css`
- `assets/js/app.js`
- `assets/js/generator-registry.js`
- `scripts/audit-browser.cjs`
- `tests/projeto.test.cjs`
- `README.md`
- `CHANGELOG.md`
- `ATUALIZACOES.md`
- `openspec/changes/archive/2026-09-28-future-g-09-test-scenarios/proposal.md`
- `openspec/changes/archive/2026-09-28-future-g-09-test-scenarios/design.md`
- `openspec/changes/archive/2026-09-28-future-g-09-test-scenarios/tasks.md`

## Verificação

- `npm test`: 98 testes aprovados, 0 falhas.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: oito telas aprovadas em Chromium a 200%, 244 passos de teclado, sem overflow horizontal, controle sem nome, foco invisível ou foco sem contorno.
- A cobertura específica percorre todos os modelos repetidamente, confere ordem das etapas, referências estáveis, relações de contêiner/carga, modos válido/inválido/aleatório, detecção de quebra referencial, persistência, restauração e exportação.

## Limites e riscos

- Os cenários são massas sintéticas para QA; não representam integração com TOS, recinto, balança, transportadora ou órgão real.
- Os fluxos modelam coerência de dados e sequência operacional, não autorização, evento assíncrono, SLA, concorrência ou transação distribuída.
- O modo inválido introduz uma inconsistência conhecida por massa; combinações de múltiplas falhas ficam fora desta fase.
- Nenhuma regressão conhecida permaneceu após a suíte completa, o build e a auditoria de navegador.
