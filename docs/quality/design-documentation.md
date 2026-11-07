# BASE-10 — documentação de design vigente

Entrega local de 07/11/2026 no checkout `future-g-e2e`. Change `consolidate-current-design-docs`; entregas anteriores preservadas.

[DESIGN.md](../../DESIGN.md) consolida o padrão já implementado: FUTURE G, assinatura do shell, catálogo único, superfícies neutras, azul de interação, cores semânticas, Inter/DM Mono, medidas compartilhadas, seis folhas CSS, hierarquia de ações, disclosures, estados, responsividade, teclado e contratos distintos de rolagem. Os valores vieram de `base.css`; comportamentos e organização foram conferidos no HTML, registry, interface e comandos existentes.

O guia distingue tokens roxos/nomes antigos de compatibilidade da interface atual; não escolhe uma nova direção artística. Comandos locais não têm modo remoto, streaming de IA ou recuperação de sessão de provedor. A etapa de rede XSD continua separada na Validação XML, conforme o aviso já corrigido em BASE-02.

`IDENTIDADE.md` foi alinhado à assinatura do shell e aos tokens atuais. `docs/ui-architecture.md` deixou de descrever recuperação de chat remoto e esclarece anexos, chip em linha própria e retenção dos comandos. README, inventário e planos apontam para a referência vigente. `PLANO-VISUAL.md`, `REVISAO-FRONT.md`, `AUDITORIA-VISUAL.md`, a revisão alpha.4 e a proposta visual do catálogo são identificados como históricos; suas evidências e contagens anteriores permanecem associadas à época.

O roteiro de leitor de tela foi atualizado para o checkout/versão em avaliação, as sete áreas, catálogo único e comandos locais. Todos os itens continuam **pendentes**, sem preencher um resultado auditivo por inferência. Nenhuma URL de deploy histórico é apresentada como versão atual; a execução manual deve registrar URL e commit/estado local.

## Verificação

- **145/145 testes Node**, sem falhas, skips ou cancelamentos; build aprovado. Nenhum teste foi adicionado, alterado ou enfraquecido para acompanhar as frases.
- **18 tokens e 36 valores de cor** da tabela do guia conferidos contra `:root` e `body.dark` em `base.css`, incluindo herança dos tokens não redefinidos.
- **138 links/âncoras locais em 17 documentos** conferidos, incluindo a imagem de identidade; nenhum destino ou âncora ausente. A captura histórica `future-g-contextual-editor.png` não existe neste checkout: seu link foi convertido em referência histórica explícita, sem recriar a imagem ou atribuir uma captura nova à execução antiga.
- Hashes de **104 arquivos** de aplicação, ativos, infraestrutura, testes, schemas e configuração iguais aos registrados no início desta etapa. Nenhuma alteração de HTML, CSS, JavaScript, marca, modelo fiscal, API, armazenamento ou dependência.
- Change aprovada no OpenSpec estrito. `skip_specs: true` foi aceito pela CLI por não haver mudança de comportamento em specs; o guia referencia os requisitos canônicos existentes. A validação global conserva somente os avisos legados de requisitos longos em `ai-assistant` e `ui-system`.
- E2E, auditor e matriz visual não repetidos por se tratar de documentação. Os 20 E2E e as auditorias de BASE-08 permanecem resultados daquela entrega; esta etapa não aprovou novos pixels, fontes, contraste global, leitor de tela ou teclado virtual.

Evidências ignoradas pelo Git e fora do build público:

- `artifacts/base-10-node.log`, `base-10-build.log` e `base-10-openspec-global.json`.
- `artifacts/base-10-tokens.cjs` e `base-10-tokens.json`.
- `artifacts/base-10-links.cjs`, `base-10-links.json` e `base-10-links-before-fix.json` (referência histórica ausente antes do ajuste).
- `artifacts/base-10-source-before.json`, `base-10-source-integrity.cjs` e `base-10-source-verification.json`.

Change arquivada em `openspec/changes/archive/2026-11-07-consolidate-current-design-docs/`. BASE-01 a BASE-11 estão encerrados nos registros locais; avisos OpenSpec e verificações manuais permanecem separados e não foram ignorados. Sem novo commit, push, PR ou deploy. Nenhuma fase posterior de implementação foi iniciada.
