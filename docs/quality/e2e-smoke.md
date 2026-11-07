# Suíte E2E — FUTURE G

> Registro histórico da primeira entrega E2E, anterior à unificação. A suíte atual mantém os mesmos cinco fluxos, com busca/favoritos de catálogo único e seleção de tipo no Cadastro. Consulte [Catálogo único](../unified-catalog.md) para os resultados atuais e as mudanças autorizadas no produto; as afirmações de runtime intacto abaixo se referem exclusivamente à entrega de infraestrutura.

Entrega de infraestrutura de 02/11/2026, após a [baseline](baseline.md). Implementada no checkout oficial `Thalysx/Gerador-de-XML`, base `a2c8fef`, branch local `test/e2e-smoke`. A cópia original fornecida pelo usuário foi preservada; os documentos da Fase 0 foram incorporados neste checkout. Nenhum commit, push, PR ou deploy foi criado nesta etapa.

## Resultado e escopo

Cinco fluxos executam em dois projetos Chromium: desktop 1280 × 900 e mobile 390 × 844 com emulação de toque. São dez testes por rodada. As três rodadas finais passaram sem retries, testes ignorados ou falhas intermitentes: **30 execuções aprovadas**.

| Fluxo | Verificação principal |
| --- | --- |
| E2E-01 | Home gera uma vez; `openGenerator` só abre; geração explícita, clipboard real e conteúdo integral do TXT |
| E2E-02 | Busca por ambiente; favorito, tema e sidebar após reload; contexto adicional sem preferências/histórico herdados |
| E2E-03 | Grupos do Cadastro, edição, JSON real do clipboard e restauração do histórico com ambiente portuário correto |
| E2E-04 | Abrir cópia do XML, editar, baixar, verificar parse e reimportar, mantendo o XML-fonte intacto |
| E2E-05 | Sugestão revisável; lote de cinco registros e download JSON completo; comando inválido preserva rascunho/anexo; validação local sem pedidos ao chat/status remotos |

Nenhum HTML, CSS, script de produção, schema fiscal, API, ID, handler, regra de persistência ou rolagem foi alterado. A suíte importa o servidor existente por um harness próprio; não carrega `.env`, não injeta assistente e não simula os geradores ou as respostas das APIs locais. A chamada direta de navegação em E2E-01 verifica especificamente o contrato público de `openGenerator`; as demais ações usam os controles existentes.

## Reprodução

Executar na raiz deste checkout, com Node compatível com o projeto (20.19+; ambiente verificado: Node 24.19.0, npm 11.17.0, Windows x64):

```powershell
npm.cmd ci
node node_modules/@playwright/test/cli.js install chromium
npm.cmd run test:e2e
```

O script invoca diretamente o executor de `@playwright/test`, evitando a ambiguidade do binário `playwright` com a CLI de agente. Dependências exatas: `@playwright/test@1.64.1` estável e `@playwright/cli@0.1.23`, preservada da instalação anterior. A CLI mantém sua dependência alpha transitiva separada. O navegador instalado pelo executor nesta máquina foi Chrome for Testing 156.0.8078.4, revisão Chromium 1248. Não apontar a suíte para um Chrome arbitrário do sistema.

Para preservar relatórios de rodadas distintas:

```powershell
try {
  foreach ($e2eRunId in @('run-1', 'run-2', 'run-3')) {
    $env:FUTURE_G_E2E_RUN = $e2eRunId
    npm.cmd run test:e2e
    if ($LASTEXITCODE -ne 0) { throw "Falha E2E: $e2eRunId" }
  }
} finally {
  Remove-Item Env:FUTURE_G_E2E_RUN -ErrorAction SilentlyContinue
}
```

Por padrão, relatórios ficam em `artifacts/e2e/latest/`; repetir o mesmo identificador substitui a saída dessa rodada. `FUTURE_G_E2E_RUN` aceita letras, números, hífen e underscore. Use novos identificadores para preservar evidências anteriores. A porta padrão é 4175 e pode ser ajustada com `FUTURE_G_E2E_PORT` (1024–65535). O runner rejeita servidor já ativo na porta, em vez de testar silenciosamente outra instância.

## Isolamento e diagnóstico

- Contexto novo por teste, sem perfil persistente; o teste de preferências comprova ainda um segundo contexto independente. Nenhum storage do navegador pessoal é acessado ou apagado.
- Um worker e zero retries, para evitar concorrência entre operações do clipboard real. Permissões de leitura/escrita são concedidas apenas aos contextos de teste.
- Locale `pt-BR`, fuso `America/Sao_Paulo`, movimento reduzido e service workers bloqueados. A aleatoriedade e o relógio do produto permanecem reais; asserts verificam estrutura e relação entre resultados, sem fixar números aleatórios.
- Recursos opcionais conhecidos de Bootstrap/fontes são respostas vazias no harness offline. Outros pedidos externos e erros JavaScript/console fazem o teste falhar. Isso não verifica a integração com CDN nem a tipografia final com fontes remotas carregadas.
- Downloads reais são lidos e comparados com os dados gerados; clipboard não é substituído por mock. As fixtures usam somente dados sintéticos, sem documentos reais do usuário.
- Relatórios JSON/HTML por rodada; trace e screenshot em falhas. A depuração inicial comprovou a retenção desses arquivos. Não há vídeo, snapshots aprovados ou retries automáticos.

Configuração: [`playwright.config.cjs`](../../playwright.config.cjs). Fluxos: [`smoke.spec.cjs`](../../tests/e2e/smoke.spec.cjs). O build existente usa allowlist; `artifacts/`, `tests/`, docs, configuração e relatórios ficam fora de `.generated-public`. A fronteira pública foi conferida após o build. Os arquivos do runtime foram comparados com o commit de origem, sem diferenças.

## Evidências desta entrega

| Verificação | Resultado | Tempo de parede |
| --- | --- | ---: |
| E2E `run-1` | 10/10; exit 0 | 12,606 s |
| E2E `run-2` | 10/10; exit 0 | 12,370 s |
| E2E `run-3` | 10/10; exit 0 | 12,433 s |
| `npm test` | 120/124; exit 1; quatro falhas XSD preexistentes | 19,224 s |
| `npm run build` | Exit 0 | 0,810 s |
| `npm run audit:browser` | Exit 0 | 7,584 s |

Tempos são desta máquina, não limites de desempenho. Logs e relatórios locais, ignorados pelo Git:

- `artifacts/e2e/three-clean-runs.json` e `run-1/`, `run-2/`, `run-3/`: saída do executor, HTML, JSON e status independentes.
- `artifacts/e2e/verification/`: logs Node/build/auditoria, resultados e validações OpenSpec.
- `artifacts/e2e/development-1/`: falhas de desenvolvimento com traces e screenshots. Uma era uma hipótese incorreta do teste sobre a sidebar inicial mobile, corrigida apenas no teste; a outra expôs BASE-11.
- `artifacts/e2e/cli/`: quatro PNGs da Home, script exploratório, log e `captures.json`, com painel, ambiente, tema, viewport, sidebar e user agent conferidos antes de capturar.

A exploração usou a CLI local 0.1.23, sessão isolada `future-g-phase2`, Chrome headless 156 e servidor temporário 4176. As quatro capturas da Home (1280 × 900 e 390 × 844, claro/escuro) foram abertas e inspecionadas. A sidebar foi configurada pelos controles existentes: expandida no desktop e recolhida na largura mobile. A largura do documento coincide com o viewport nas quatro amostras; nenhum erro de página foi observado. Aqui mobile significa redimensionamento de viewport; a emulação de toque pertence aos projetos Playwright Test. Essas imagens são diagnósticas, com recursos externos omitidos; não são baselines visuais aprovadas.

Para uma nova exploração, iniciar o servidor do harness com porta 4176, abrir a CLI e usar seus comandos `snapshot`, `run-code` e `screenshot`. Exemplo da sessão usada (em outro terminal com o servidor em execução):

```powershell
node node_modules/@playwright/cli/playwright-cli.js -s=future-g-phase2 open http://127.0.0.1:4176 --browser=chrome
node node_modules/@playwright/cli/playwright-cli.js -s=future-g-phase2 snapshot
node node_modules/@playwright/cli/playwright-cli.js -s=future-g-phase2 close
```

O script exploratório original é evidência local ignorada, não uma segunda suíte obrigatória. Não houve atualização automática de snapshots. A matriz completa da Fase 0 permanece histórica; não foi repetida nesta entrega de infraestrutura.

## Pendências e riscos de regressão

1. **Fiscal:** as mesmas quatro falhas de `fiscal-xsd.test.cjs` impedem aprovação global. A divergência de bytes dos schemas também ocorre no checkout oficial; não foi corrigida nem mascarada. Manutenção específica deve verificar origem e fins de linha antes de tocar em hashes.
2. **Composer mobile (BASE-11):** o chip de XML anexado pode obstruir Enviar em 390 × 844. O fluxo atual verifica envio por Enter, já suportado. Os dez testes verdes não comprovam o clique com anexo nem resolvem essa falha visual.
3. **OpenSpec legado:** a nova change e a especificação E2E passam individualmente. A validação global estrita continua falhando em `ai-assistant`, `app-shell`, `navigation` e `ui-system`, por avisos sobre texto de requisitos acima de 500 caracteres. Nenhum requisito legado foi alterado.
4. **Cobertura:** não cobre todas as combinações de tema/ambiente, CT-e completo, XSD em navegador, `file://`, Firefox/WebKit, teclado virtual, dispositivo físico, leitor de tela, CDN online, carga ou segurança completa. A CLI e o Test têm árvores de dependência distintas; manter a invocação explícita e o lockfile evita troca acidental de executor.

Não foram adicionados CI, axe, fast-check, lint, recursos de QA, mudanças de design ou migração de stack. O próximo trabalho é uma change específica para as pendências priorizadas; esta entrega não declara a release integralmente aprovada.

## OpenSpec e reversão

Capacidade canônica: `openspec/specs/browser-smoke-testing/spec.md`. Change encerrada em `openspec/changes/archive/2026-11-02-add-e2e-smoke-tests/`, com resultados e limites explícitos. A validação usou `@fission-ai/openspec@1.16.0` via npx, sem adicionar dependência ao produto, com telemetria desativada. A CLI requer Node 22.12+, separado do mínimo do produto.

Rollback remove somente `test:e2e`, `@playwright/test`, configuração e `tests/e2e/`, ajustando o lockfile e as entradas de ignore. Preservar a CLI instalada anteriormente, os documentos históricos e o storage do usuário. Não alterar arquivos do produto para reverter esta infraestrutura.
