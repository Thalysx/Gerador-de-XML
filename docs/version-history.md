# Histórico de versões e arquivos legados

O repositório usa `main` como única fonte ativa. Versões concluídas são identificadas por tags Git e Releases; cópias completas do aplicativo não devem ser mantidas em subpastas paralelas.

## Linha de versões

| Tag | Marco |
| --- | --- |
| `v2.0.0` | Layout vertical e linha visual anterior à consolidação |
| `v2.1.0` | Melhorias de interface, acessibilidade e Assistente |
| `v2.1.1` | Publicação e verificação visual da linha 2.x |
| `v3.0.0-alpha.1` | Fundação FUTURE G, shell unificado e seletor de ambientes |
| `v3.0.0-alpha.2` | Correções de prontidão, isolamento fiscal, ativos PWA e acessibilidade |
| `v3.0.0-alpha.3` | Resultado estruturado reutilizável e rolagem reiniciada por nova geração |

## Snapshots importados

As cópias que existiam fora do Git foram compactadas antes da limpeza:

- `legacy-root.zip`: gerador legado mantido na raiz antiga.
- `visual-lab.zip`: laboratório visual anterior.
- `layout-release.zip`: pacote de uma entrega visual.
- `github-update.zip`: pacote temporário preparado para atualização.
- `github-copy-current.zip`: cópia intermediária do repositório.
- `refactor-ui-evidence.zip`: baseline, capturas e evidências da refatoração.

Os ZIPs têm manifesto SHA-256 e estão preparados para a Release `legacy-snapshots-2026-09`. Eles não contêm `.env` reais. Use esses arquivos apenas para consulta ou recuperação; novas alterações devem partir de `main`.

## Estado da publicação

O commit consolidado e as tags foram criados localmente. O primeiro envio foi recusado pelo GitHub com HTTP 403 porque a credencial disponível não possui acesso de escrita ao repositório remoto. Até a autenticação do proprietário ser corrigida, o histórico completo permanece preservado no bundle `future-g-all.bundle`, ao lado dos ZIPs e do manifesto. Não considerar tags ou Releases remotas como publicadas antes de um `git push` bem-sucedido.

## Convenções

- Produto: **FUTURE G**.
- Repositório e pacote: `future-g`.
- Arquivos e diretórios: `kebab-case`.
- Interface e documentação do produto: português do Brasil.
- Código legado em português permanece com nomes estáveis quando renomear criaria risco funcional sem benefício arquitetural.
- Chaves persistidas e contratos externos não são renomeados sem migração compatível.
