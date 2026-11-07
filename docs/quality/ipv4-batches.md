# BASE-04 — lotes IPv4 consecutivos

Entrega local de 07/11/2026 no checkout `future-g-e2e`, preservando as alterações anteriores de BASE-02. Change `fix-ipv4-batch-exhaustion`.

O gerador tinha 762 endereços possíveis, mas usava o helper compartilhado que retém até 2.000 valores recentes e tenta sortear um valor novo até cem vezes. Depois de um lote de 500, não restavam valores suficientes para outro lote do mesmo tamanho. No navegador, a falha mantinha o lote anterior disponível para download; a regressão detectou essa exportação repetida. A correção remove a causa do esgotamento IPv4, sem refatorar o tratamento genérico de erros da interface.

Agora o gerador enumera os mesmos três blocos, com hosts de 1 a 254, e escolhe diretamente entre os endereços fora de seus últimos 500 valores. Há sempre pelo menos 262 candidatos antes de cada escolha; após inserir um valor, o mais antigo sai da janela quando necessário. Não há rejeição probabilística de candidatos repetidos. A filtragem tem domínio fixo de 762 endereços e o Set de recentes fica limitado a 500.

Cada lote de até 500 continua sem duplicatas, incluindo pedidos mistos ou fracionados do mesmo tipo. O usuário pode gerar mais de 762 valores ao longo da sessão; valores podem reaparecer em lotes diferentes após sair da janela recente. Não se promete unicidade por sessão. Formato, blocos, hosts, limite de lote, opções, histórico de uso e exportações permanecem iguais. `semRepeticaoRecente`, fonte aleatória e motor de lotes compartilhados não foram alterados.

## Verificação

- Antes da correção: os três testes dirigidos falharam com o erro de geração por esgotamento. O E2E desktop falhou porque o segundo download repetia o lote anterior.
- Depois: **142/142 Node**, sem falhas, skips ou cancelamentos; inclui três regressões novas e a suíte fiscal existente.
- As regressões dirigidas verificam seis lotes consecutivos de 500; 1.600 gerações individuais seguidas de um lote de 500 com índice aleatório constante; e lote misto/fracionado após 499 gerações individuais, seguido de outro lote máximo. Conferem quantidade, unicidade e domínio, sem exigir ausência de reutilização entre todos os lotes.
- **20/20 E2E**, Chromium desktop/mobile, zero retries. E2E-10 usa seleção de ferramenta e controles reais para gerar/exportar dois lotes de 500 e outro pelos comandos locais. Os três downloads JSON contêm 500 IPv4 distintos cada e o lote da interface preserva o resultado individual. Nenhum gerador ou resultado foi simulado no navegador.
- Build e auditoria de navegador aprovados. Change e spec `batch-generation` aprovadas pela CLI OpenSpec em modo estrito. A validação global continua com os dois avisos legados de requisitos longos em `ai-assistant` e `ui-system`.

Os testes dirigidos carregam os três módulos de produção no VM; fornecem somente metadados dos tipos e registro de uso sem UI. O caso adverso substitui `rand` apenas no contexto isolado. Os demais casos usam a fonte aleatória real. Não foram instaladas dependências nem introduzidos sleeps/retries para ocultar falhas.

Evidências ignoradas pelo Git e fora do build público:

- `artifacts/base-04-before.log`, `base-04-e2e-before.log` e `artifacts/e2e/base-04-before/`: regressões antes da correção, com trace e screenshot do E2E com falha.
- `artifacts/base-04-after.log`, `base-04-node.log`, `base-04-e2e.log`, `base-04-build.log`, `base-04-audit.log`.
- `artifacts/e2e/base-04/`: relatórios HTML/JSON, sem falhas ou resultados flaky.
- `artifacts/base-04-openspec-global.json`: avisos globais preservados.

Arquivo funcional alterado: `assets/js/development-generators.js`. Testes adicionados: `tests/ipv4-batches.test.cjs` e `tests/e2e/ipv4-batches.spec.cjs`. Requisito sincronizado em `openspec/specs/batch-generation/spec.md`; change arquivada em `openspec/changes/archive/2026-11-07-fix-ipv4-batch-exhaustion/`.

Sem alterações em HTML/CSS nesta etapa, modelos/schemas fiscais, APIs, armazenamento persistido ou demais geradores. Sem novo commit, push, PR ou deploy. Permanecem BASE-08/09/10 e avisos OpenSpec legados; nenhuma etapa seguinte foi iniciada. Reversão deve restaurar somente o incremento IPv4, suas regressões e requisito/documentação, preservando BASE-02 e os dados do usuário.
