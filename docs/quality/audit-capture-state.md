# BASE-08 — identidade das capturas da auditoria

Entrega local de 07/11/2026 no checkout `future-g-e2e`, preservando BASE-02 e BASE-04. Change `fix-audit-capture-state`.

O auditor padrão mantinha Dados cadastrais ativo e a página rolada após uma fixture estruturada longa. Em seguida gravava `future-g-home-dark.png`. A imagem anterior foi preservada e aberta: mostrava o resultado sintético e histórico de Dados cadastrais, sem Home. O roteiro agora seleciona Home, assegura tema escuro e volta ao topo antes dessa captura. O arquivo seguinte, que contém CPF em Dados cadastrais, foi renomeado de `future-g-home-result-dark.png` para `future-g-docs-result-dark.png`.

## Guarda e manifesto

Toda imagem salva pelo auditor padrão, matriz ou modo baseline passa por `scripts/audit-capture.cjs`. O chamador declara a expectativa; o módulo lê o DOM real e exige um único painel visível, um único painel ativo e uma única aba selecionada, correspondentes ao destino. Tema e catálogo também devem corresponder. Largura, altura e sidebar são comparados quando declarados. Uma divergência interrompe o roteiro antes de solicitar o PNG ou escrever seu arquivo.

`capture-manifest.json` registra nome do arquivo, expectativa, estado observado, título, viewport/escala, sidebar, scroll e SHA-256 dos bytes gravados. Começa vazio/incompleto ao iniciar a sequência e é atualizado a cada imagem salva. Só recebe `complete: true` ao terminar a sequência. Esse marcador informa conclusão das capturas, não aprovação de layout: o exit code e o relatório da auditoria continuam necessários.

Arquivos antigos não são apagados nem incluídos automaticamente. O antigo nome de resultado CPF pode permanecer em diretórios já usados, mas não integra o novo manifesto. Capturas de aquecimento sem arquivo não são evidências e não entram na contagem. Os nomes genéricos anteriores de XML escuro e Home clara foram preservados; seu painel é explícito no manifesto.

## Verificação

- **145/145 testes Node**, sem falhas, skips ou cancelamentos. Três testes novos verificam onze divergências de estado sem solicitar/gravar imagem, preservação de arquivo anterior, ordem leitura→captura, associação do hash e ausência de expectativa obrigatória. Esses testes controlam os adaptadores de transporte; não simulam aprovação de layout.
- A guarda foi exercitada no auditor real durante a implementação: a expectativa inicial de tema claro a 200% divergiu do tema escuro existente e bloqueou a captura, deixando manifesto vazio/incompleto. O roteiro passou a assegurar explicitamente o tema escuro dessas imagens antes da conferência.
- **Auditor padrão aprovado**, com **19 imagens** e manifesto completo. Home escura tem painel/aba Home, título Início e scroll Y zero. A amostra Home escura e o resultado CPF renomeado foram abertos e inspecionados.
- **Matriz aprovada nos critérios geométricos existentes**: 112 combinações de sete painéis, dois temas, quatro larguras e dois estados de sidebar; 28 estados com opções abertas; duas imagens auxiliares de Telefone/sidebar. **142 imagens**, zero divergências de identidade e zero falhas geométricas. Amostras Home clara mobile/sidebar recolhida e XML escuro desktop/sidebar expandida foram abertas e inspecionadas.
- Os **161 PNGs** das duas execuções tiveram identidade e hashes conferidos contra os manifestos; foram copiados por nome declarado para um diretório de evidência isolado, sem incluir arquivos antigos remanescentes.
- **20/20 E2E** desktop/mobile, zero retries; build aprovado. Não houve alteração da aplicação ou das regressões de BASE-02/04.
- Change e spec `browser-smoke-testing` aprovadas no OpenSpec estrito. A validação global mantém os dois avisos legados por requisitos longos em `ai-assistant` e `ui-system`.

Evidências locais ignoradas pelo Git e fora do build público:

- `artifacts/base-08-before/future-g-home-dark.png`: reprodução visual anterior.
- `artifacts/base-08-state-guard.log` e `base-08-before/incomplete-manifest.json`: bloqueio real por tema divergente durante a implementação.
- `artifacts/base-08-node.log`, `base-08-e2e.log`, `base-08-build.log`, `base-08-audit.log`, `base-08-matrix.log`.
- `artifacts/base-08-verified/standard/` e `matrix/`: somente PNGs declarados nos manifestos completos e os respectivos manifestos.
- `artifacts/base-08-verify-manifests.cjs`, `base-08-manifest-verification.json`: roteiro e resultado de conferência das 161 imagens.
- `artifacts/e2e/base-08/`: relatórios da suíte existente; `artifacts/base-08-openspec-global.json`: avisos globais.

Arquivos de implementação: `scripts/audit-browser.cjs`, `scripts/audit-capture.cjs` e `tests/audit-capture.test.cjs`. Requisito sincronizado em `openspec/specs/browser-smoke-testing/spec.md`; change arquivada em `openspec/changes/archive/2026-11-07-fix-audit-capture-state/`. Nenhuma dependência instalada ou teste fiscal enfraquecido.

As imagens são diagnósticas. A conferência de estado e a geometria não aprovam pixels, fontes, legibilidade de todos os controles, leitor de tela ou teclado virtual. Nenhuma baseline visual foi aprovada automaticamente. Sem novo commit, push, PR ou deploy. BASE-09/10 e avisos OpenSpec legados permanecem; nenhum outro item foi iniciado. Reversão deve restaurar somente esta infraestrutura, seus testes e documentação, preservando os incrementos anteriores e os dados do usuário.
