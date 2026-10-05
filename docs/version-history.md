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
| `v3.0.0-alpha.4` | Sistema visual compartilhado, telas simplificadas, ações contextuais e geração por clique |
| `v3.0.0-alpha.5` | Crachá automático e restauração da organização anterior do XML Fiscal |
| `v3.0.0-alpha.6` | Placa automática com preservação do padrão escolhido |

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

O primeiro envio do histórico consolidado foi recusado pelo GitHub com HTTP 403. O bundle `future-g-all.bundle`, os ZIPs e o manifesto preservam aquele histórico. Em 05/10/2026, o envio das versões `3.0.0-alpha.4`, `3.0.0-alpha.5` e `3.0.0-alpha.6` à `main` foi concluído e a integração Git publicou as atualizações na Vercel. Consulte `VERIFICACAO-PRODUCAO.md` para o deploy e suas limitações. Tags e Releases remotas devem ser consideradas publicadas somente após a confirmação de seu envio.

## Convenções

- Produto: **FUTURE G**.
- Repositório e pacote: `future-g`.
- Arquivos e diretórios: `kebab-case`.
- Interface e documentação do produto: português do Brasil.
- Código legado em português permanece com nomes estáveis quando renomear criaria risco funcional sem benefício arquitetural.
- Chaves persistidas e contratos externos não são renomeados sem migração compatível.
