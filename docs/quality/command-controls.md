# Etapa 3 — teclado da busca e composer com anexo

Entrega local em 03/11/2026, checkout `future-g-e2e`, preservando o working tree anterior. Change `fix-command-controls`; BASE-03 e BASE-11 resolvidos. Sem commit, push, PR ou deploy.

## Correções e regressões

O handler global executava a seleção ao receber Enter de qualquer controle da busca. Agora somente Enter originado no campo, fora de composição de texto, ativa a seleção. Fechar e opções conservam ativação nativa e handlers de click existentes. Enter/Espaço no fechamento devolvem o foco sem navegar nem gerar. Tab, Escape e Enter no campo continuam cobertos.

O chip foi movido para uma linha própria dentro do formulário existente. O nome trunca sem comprimir Remover. Enviar mantém largura de 44 px e a mensagem deixa de disputar espaço com o arquivo. IDs, callbacks, anexos, parser, geração, armazenamento e rolagem foram preservados.

Antes da correção, o teste Node falhou porque Enter em Fechar era interceptado; o E2E confirmou foco/navegação indevidos. O teste responsivo encontrou somente 8 px no campo com anexo longo. A primeira iteração após mover o chip ainda tinha 79 px em 320 px; fixar o botão em 44 px corrigiu esse caso sem reduzir o critério do teste.

## Verificação

- **139/139 Node**, sem falhas ou skips; inclui a suíte fiscal existente.
- **18/18 E2E**, Chromium desktop/mobile, sem retries. E2E-08 cobre fechamento por Enter/Espaço, ativação no campo e na opção focada, Tab e Escape. E2E-09 cobre upload real, nome longo, clique, erro, consulta local e remoção.
- Composer medido e capturado em **320, 390, 768 e 1440 px**, claro/escuro; capturas revisadas. Enviar fica dentro do formulário/viewport, chip separado e campo com ao menos 80 px. São capturas diagnósticas, sem aprovação de snapshots ou leitor de tela real.
- Build e auditoria existente de navegador aprovados.
- Skill `design-taste-frontend` aplicada aos componentes existentes, sem nova direção visual. Inspector adicional no build: **2 FAIL e 1 WARN preexistentes na Home** (estrela classificada como emoji, textos de 10 px e margem de 14 px). Lint dos arquivos completos: **1 FAIL e 21 WARN** (o FAIL é o `✓` existente). Não houve alteração dessas áreas nem aprovação visual global. Rótulos e estilos anteriores também conferidos no commit `a2c8fef`.

Evidências ignoradas e fora do build público: `artifacts/command-keyboard-before.log`, `command-controls-before.log`, `command-controls-node.log`, `command-controls-build.log`, `command-controls-audit.log`, `command-controls-e2e.log`, `command-controls-inspect.log`, `command-controls-lint.log`, e `artifacts/e2e/command-controls-final/`.

Arquivos funcionais desta etapa: `assets/js/productivity.js`, `assets/css/evolucao.css`, `index.html`. Testes: `tests/e2e/command-controls.spec.cjs`, regressão Node em `tests/projeto.test.cjs` e envio por clique com anexo no E2E-05 existente.

Permanecem BASE-02/04/08/09/10 e avisos OpenSpec legados de requisitos longos em `ai-assistant` e `ui-system`. Nenhum outro item foi iniciado. Reversão deve restaurar somente os incrementos desta change, testes e requisitos, preservando o trabalho anterior e o storage do usuário.
