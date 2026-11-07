# BASE-09 — alinhar o inventário documental ao runtime

## Why
README, roadmap e plano mestre apresentam a antiga biblioteca de fluxos portuários como disponível. O runtime atual tem sete áreas, não carrega o motor dessa biblioteca e mantém um teste explícito de ausência. Cenários XML salvos continuam disponíveis e não devem ser confundidos com fluxos operacionais relacionados.

## What Changes
- Criar um inventário atual com origem verificável no registry, HTML, motores e testes existentes.
- Corrigir README e separar a configuração XML salva da biblioteca operacional ausente.
- Alinhar o estado vigente do roadmap e do plano mestre, mantendo os marcos históricos identificados.
- Marcar os relatórios antigos de cenários/produtividade como históricos, com ligação para o inventário vigente.
- Corrigir a spec de produtividade para refletir catálogo, favoritos, atividade conjunta e limpeza já implementados, sem massas de cenário.

## Impact
Somente Markdown e especificações. Não criar ou restaurar telas, scripts, modelos de cenário, integração ou geradores; não alterar aplicação, armazenamento, testes, APIs ou dependências. Preservar as entregas anteriores e o conteúdo dos arquivos OpenSpec arquivados. BASE-10 e avisos legados ficam fora do escopo.
