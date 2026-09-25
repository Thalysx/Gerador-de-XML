# Histórico de versões e arquivos legados

O repositório usa `main` como única fonte ativa. Versões concluídas são identificadas por tags Git e Releases; cópias completas do aplicativo não devem ser mantidas em subpastas paralelas.

## Linha de versões

| Tag | Marco |
| --- | --- |
| `v2.0.0` | Layout vertical e linha visual anterior à consolidação |
| `v2.1.0` | Melhorias de interface, acessibilidade e Assistente |
| `v2.1.1` | Publicação e verificação visual da linha 2.x |
| `v3.0.0-alpha.1` | Fundação FUTURE G, shell unificado e seletor de ambientes |

## Snapshots importados

As cópias que existiam fora do Git foram compactadas antes da limpeza:

- `legacy-root.zip`: gerador legado mantido na raiz antiga.
- `visual-lab.zip`: laboratório visual anterior.
- `layout-release.zip`: pacote de uma entrega visual.
- `github-update.zip`: pacote temporário preparado para atualização.
- `github-copy-current.zip`: cópia intermediária do repositório.
- `refactor-ui-evidence.zip`: baseline, capturas e evidências da refatoração.

Os ZIPs têm manifesto SHA-256 publicado junto da Release `legacy-snapshots-2026-09`. Eles não contêm `.env` reais. Use esses arquivos apenas para consulta ou recuperação; novas alterações devem partir de `main`.

## Convenções

- Produto: **FUTURE G**.
- Repositório e pacote: `future-g`.
- Arquivos e diretórios: `kebab-case`.
- Interface e documentação do produto: português do Brasil.
- Código legado em português permanece com nomes estáveis quando renomear criaria risco funcional sem benefício arquitetural.
- Chaves persistidas e contratos externos não são renomeados sem migração compatível.
