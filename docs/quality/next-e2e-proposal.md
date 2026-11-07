# Proposta da próxima entrega — base E2E

Status: **implementada após a Fase 0**, em 02/11/2026. Este documento preserva a proposta original; a implementação, seus resultados e os limites efetivos estão em [Suíte E2E](e2e-smoke.md).

Change: `add-e2e-smoke-tests`, em checkout Git real, branch `test/e2e-smoke`. Registro em `openspec/changes/archive/2026-11-02-add-e2e-smoke-tests/`. Este arquivo é histórico, não uma segunda change em execução.

## Problema

A aplicação possui 124 testes Node e uma auditoria extensa de navegador, mas não uma suíte persistente com Playwright Test, isolamento por contexto e traces por falha. O roteiro próprio já cobre geometria, foco e vários fluxos; duplicá-lo integralmente aumentaria custo sem resolver as lacunas de interação e diagnóstico.

## Escopo de uma entrega pequena

1. Integrar `@playwright/test` como dependência de desenvolvimento, com versão estável selecionada após verificar engines, licença e compatibilidade. A CLI instalada usa uma versão alpha transitiva; não adotar essa versão automaticamente para a suíte.
2. Adicionar `playwright.config.cjs` e `tests/e2e/`, mantendo `node --test` e a ordem de scripts da aplicação. Introduzir apenas `test:e2e` nesta etapa.
3. Usar Chromium e servidor local em loopback, com porta configurada no harness sem modificar `scripts/serve.cjs` nem a API pública. Cada teste recebe contexto novo e storage isolado.
4. Salvar trace e screenshot somente em falhas, em diretórios ignorados e não publicados. Bloquear fontes/CDN de forma explícita na configuração determinística; uma execução separada verifica integração com recursos externos.
5. Executar a nova suíte três vezes em contextos limpos, registrando duração e resultado, sem retries que escondam instabilidade.

## Cinco fluxos iniciais

| ID | Fluxo | Resultado verificável |
| --- | --- | --- |
| E2E-01 | Home, geração simples e resultado | Ativar CPF gera exatamente um resultado e uma entrada de histórico; abrir por `openGenerator` não gera; botão e exportação refletem o resultado |
| E2E-02 | Ambientes e preferências | Busca geral/portuária retorna destinos permitidos; favoritos/tema sobrevivem ao reload no mesmo contexto; outro contexto começa limpo |
| E2E-03 | Cadastro por grupos | Selecionar grupos, gerar, editar e restaurar preserva estrutura e valores; o ambiente correto é recuperado |
| E2E-04 | XML existente e editor | Gerar, abrir cópia, editar e baixar mantém fonte original e XML parseável; não altera modelos, regras fiscais ou API |
| E2E-05 | Comandos locais | Sugestão só preenche; envio explícito gera; texto inválido mantém rascunho/anexo; nenhum pedido alcança chat/status remotos |

Downloads devem ser lidos e comparados com o resultado real, sem salvar dados pessoais externos. Assertions de validade não devem comparar um valor aleatório específico.

## Screenshots: estágio separado da aprovação

A coleta da Fase 0 é referência diagnóstica, não baseline visual aprovada. Na Fase 2, controlar fonte, relógio, animação e dados sintéticos somente no harness de teste, sem substituir a aleatoriedade de produção. Testar claro/escuro em desktop e mobile; reutilizar a matriz própria para larguras/ambientes/sidebar, evitando multiplicação redundante dos mesmos asserts.

Só adicionar `test:visual` bloqueante depois que fixtures e ambiente estiverem estabilizados e as imagens tiverem revisão. Não executar atualização automática de snapshots para esconder diferenças. Toda imagem deve registrar painel, ambiente, tema, viewport e estado antes da captura; impedir a repetição do BASE-08.

## Requisitos OpenSpec propostos

### Requirement: Isolated browser smoke coverage

The development test suite SHALL exercise the five declared workflows in a real browser, with a fresh storage context per test, without changing production generators, contracts, persistence or APIs.

#### Scenario: Run a workflow after another test

- **WHEN** a smoke workflow starts after another workflow
- **THEN** prior favorites, history, theme and generated data are absent unless the workflow explicitly initializes them
- **AND** application behavior is checked through its existing controls.

### Requirement: Inspectable failures

Browser test failures SHALL retain a trace and screenshot outside the public build, without including credentials or user-provided real documents.

#### Scenario: Investigate a failed browser workflow

- **WHEN** an assertion fails
- **THEN** a developer can inspect the failing action and page state
- **AND** evidence is not copied into `.generated-public`.

### Requirement: Honest baseline accounting

The new suite SHALL distinguish the preexisting BASE-01 fiscal failures from new failures. It MUST NOT disable, weaken or relabel failing fiscal tests as successful.

#### Scenario: Run all existing checks

- **WHEN** the smoke suite and existing commands finish
- **THEN** their exit codes are reported independently
- **AND** a release is not declared fully approved while known failing checks remain unresolved.

## Arquivos esperados e exclusões

Permitidos: `package.json`, `package-lock.json`, `playwright.config.cjs`, `tests/e2e/`, regras de ignore específicas, documentação e a própria change. Não modificar HTML/CSS/JS da aplicação, modelos fiscais, schemas, APIs ou regras de scroll nesta entrega de infraestrutura.

Axe, fast-check, CI, ESLint, CodeQL, Dependabot, Lighthouse e novos recursos de QA pertencem às respectivas fases posteriores. Não instalar ferramentas só porque aparecem no plano mestre.

## Aceite e riscos

- Cinco fluxos concluídos em três execuções limpas, com tempos registrados.
- Nenhuma falha nova nos testes existentes; build e auditoria mantidos.
- Isolamento de storage e exclusão dos artefatos do build demonstrados.
- Fontes, aleatoriedade, sistema operacional e versão do navegador registrados nas capturas.
- Baseline fiscal ainda vermelha documentada e tratada por manutenção específica antes de liberação de release.
- Validação OpenSpec executada em ambiente com a CLI disponível; não confundir revisão estrutural com aprovação da ferramenta.

Riscos: duplicação de versões Playwright entre CLI e Test; instabilidade de dados/tempo/fontes; colisão de porta; testes que verificam mocks em vez do produto; alteração involuntária de estado por uso de contexto persistente. Mitigar no harness, mantendo a aplicação intacta.

Rollback: remover apenas dependências/configuração/testes adicionados pela entrega; não apagar storage do usuário, imagens aprovadas ou código de produção.
