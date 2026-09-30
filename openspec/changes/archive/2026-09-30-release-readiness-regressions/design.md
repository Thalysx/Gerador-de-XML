# Design: Release Readiness Regressions

## Approach
Corrigir os pontos na arquitetura atual, sem criar implementações paralelas. O gerador mantém os dois modelos internamente, mas projeta, guarda, oferece para download e expõe somente o documento fiscal do ambiente ativo. A troca de ambiente regenera essa projeção.

O servidor local usa uma lista restrita de extensões e caminhos públicos para entregar HTML, CSS, JavaScript, manifesto e ativos de marca sem permitir acesso a scripts internos, testes, configuração ou segredos.

A navegação reseta o scroll da página em toda troca de painel. A sidebar fixa recebe rolagem vertical própria. O auditor considera visível apenas o foco renderizado dentro da viewport e reprova navegação vertical sem mecanismo de acesso.

## Compatibility
Campos editados, histórico, cenários, editor, validação e downloads permanecem compatíveis. Chaves de armazenamento existentes não mudam.

## Validation
Executar a suíte completa, build, auditoria de 200%, matriz de 128 combinações e `git diff --check`. Cobrir por HTTP manifesto, logos e favicons; por DOM a projeção fiscal de cada ambiente; e por regressão o destinatário de CT-e distinto do remetente.
