# Desenho — smoke tests no navegador

## Decisões

- Configuração CJS compatível com os scripts existentes. `test:e2e` invoca diretamente a CLI de `@playwright/test`, evitando ambiguidades com a dependência da CLI de agente.
- Versões exatas, Chromium empacotado do executor e um worker: o clipboard é compartilhado e paralelismo entre cópias pode produzir interferência.
- Porta própria 4175, configurável por `FUTURE_G_E2E_PORT`; servidor existente nunca é reutilizado silenciosamente.
- Contexto Playwright novo por teste; o teste de preferências abre ainda outro contexto independente.
- Sem mocks das APIs locais ou dos geradores. Apenas Bootstrap/fontes externos opcionais são recursos vazios nesta trilha offline, como no auditor existente.
- Abertura por `openGenerator` é o único comando de navegação chamado diretamente para testar o contrato distinto de ativação; o restante dos fluxos usa os controles existentes. Leituras de estado sustentam asserts, sem substituir motores.
- Saídas ficam em `artifacts/e2e/<run>`, ignoradas e fora do build. Zero retries; evidências só são retidas quando há falha. Capturas exploratórias da CLI não são baselines visuais aprovadas.

## Riscos e reversão

Rede externa/fonte, aleatoriedade e versões de navegador afetam screenshots; não comparar pixels sem fixtures e revisão. A alpha da CLI permanece isolada do executor estável. As quatro falhas XSD são reportadas e não corrigidas nem ignoradas por esta change.

Rollback: remover apenas configuração, testes, scripts e dependências adicionados nesta entrega; manter a documentação da baseline e os dados do usuário.
