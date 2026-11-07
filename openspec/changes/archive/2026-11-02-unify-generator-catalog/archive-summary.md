# Encerramento — catálogo único

02/11/2026. Decisão explícita do usuário: retirar a divisão Geral/QA Portuário e oferecer um catálogo único com categorias antes do plano visual seguinte.

Entregues: shell sem switch de ambientes; registry compartilhado na descoberta/busca/lotes/comandos; seleção de tipo no Cadastro; restauração compatível; favoritos e atividade unificados sem apagar chaves legadas. Cabeçalho do Cadastro adapta nomes/tipos longos ao mobile. Motores, modelos/XML Fiscal, schemas, APIs, formatos de export e funções de scroll preservados conforme diff.

Validação final: 127 Node, 123 aprovados e as mesmas quatro falhas fiscais; build/auditoria aprovados; três rodadas E2E com 10/10 cada, zero retries; matriz 112+28 sem falhas; 16 capturas diagnósticas nos dois temas e larguras desktop/mobile. A inspeção resultou no ajuste do cabeçalho e no teste de seus limites. Dados de teste são sintéticos.

Change validada em modo estrito e decisões incorporadas às specs canônicas. Validação global ainda aponta avisos legados de requisitos longos em `ai-assistant` e `ui-system`, em partes não alteradas. BASE-01 e BASE-11 permanecem registrados; não houve correções fiscais ou do composer com anexo.

Implementação e roteiro visual em `docs/unified-catalog.md`. Evidências ignoradas em `artifacts/unified-catalog/` e `artifacts/e2e/unified-{1,2,3}/`. Branch local `feat/unified-catalog`, base `a2c8fef`; preserva o working tree E2E anterior. Sem commit, push, PR ou deploy. Arquivamento encerra esta change, não o plano mestre nem a aprovação de release.
