# FUTURE G 02 — arquitetura de geradores

> Nota posterior: a separação de produto foi endurecida em 27/09/2026. Geradores Gerais passou a conter somente geradores gerais e NF-e; QA Portuário, somente geradores portuários e CT-e. As referências abaixo a itens compartilhados registram a decisão histórica desta fase, não o contrato atual.

## Escopo concluído

A fase consolida a arquitetura que as próximas entregas usarão, sem adicionar novos geradores de domínio. O catálogo, a navegação e as projeções por ambiente passam a ter uma fonte canônica, enquanto os motores existentes de geração, validação, histórico e exportação permanecem inalterados.

## Mapa da arquitetura

| Responsabilidade | Proprietário | Consumidores |
| --- | --- | --- |
| Ambientes, navegação, rotas e ícones | `assets/js/generator-registry.js` | shell e cabeçalho |
| IDs, categorias, busca, capacidades e adaptadores | `assets/js/generator-registry.js` | Home, workspace, lote, API e histórico |
| Troca de ambiente e navegação por teclado | `assets/js/interface.js` | todos os painéis |
| Descoberta, categorias, favoritos e recentes | `assets/js/home-dashboard.js` | Home |
| Seleção, configuração e abertura por ID | `assets/js/generator-workspace.js` | Dados cadastrais e destinos XML/Cadastro |
| Geração e exportação em lote | `assets/js/geracao-dados.js` e `assets/js/chat.js` | workspace e Assistente |
| Regras de negócio | scripts de domínio existentes | adaptadores do registry |

## Decisões

- `APP_NAVIGATION` define ordem, grupo, nome, descrição, ícone e ambientes das rotas. O HTML continua contendo os painéis por compatibilidade, mas não mantém uma segunda fonte de metadados em JavaScript.
- Cada entrada de `GENERATORS` declara `environments`, `route`, `keywords` e `capabilities`. Os campos `tool` e `TIPOS_DADOS` continuam disponíveis para os consumidores legados.
- Projeções compartilhadas filtram Home, categorias, workspace e lote. Não há cópia de algoritmos nem uma segunda engine por ambiente.
- Favoritos e recentes continuam armazenando somente IDs. Itens incompatíveis são omitidos da visualização ativa, sem apagar a preferência.
- Ao trocar de ambiente, uma seleção incompatível retorna à Home e conserva resultado e histórico. Restaurar um registro histórico muda para o ambiente compatível antes de abrir a ferramenta.
- Cadastro geral é exclusivo de Geradores Gerais. Ferramentas logísticas existentes são exclusivas de QA Portuário. Documentos e XML usados nos dois contextos permanecem compartilhados.

## Arquivos criados ou modificados

- `assets/js/generator-registry.js`
- `assets/js/interface.js`
- `assets/js/home-dashboard.js`
- `assets/js/generator-workspace.js`
- `assets/js/chat.js`
- `assets/js/historico.js`
- `tests/projeto.test.cjs`
- `docs/ui-architecture.md`
- `docs/future-g-02-generator-architecture.md`
- `openspec/changes/future-g-02-generator-architecture/proposal.md`
- `openspec/changes/future-g-02-generator-architecture/specs/generator-registry/spec.md`
- `openspec/changes/future-g-02-generator-architecture/specs/navigation/spec.md`
- `openspec/changes/future-g-02-generator-architecture/tasks.md`

## Verificações

- `npm test`: 66/66 testes aprovados.
- `npm run build`: distribuição pública criada com sucesso em `.generated-public`.
- `npm run audit:browser`: sete painéis, árvore de acessibilidade, percurso de teclado, identidade e movimento reduzido aprovados; nenhuma rolagem horizontal ou controle sem nome.
- `AUDIT_MATRIX=1 node scripts/audit-browser.cjs`: 112 capturas em temas, larguras e estados da sidebar, sem falhas; Telefone permaneceu alcançável com e sem filtro anterior.
- `openspec validate future-g-02-generator-architecture --strict`: mudança válida.
- `git diff --check`: nenhuma inconsistência de whitespace; apenas avisos de conversão LF/CRLF do Git no Windows.

## Riscos e limites restantes

- Esta fase classifica somente as ferramentas já existentes. Pessoas, empresas, conjuntos veiculares, cargas e fluxos portuários adicionais pertencem a `future-g-08-port-qa`.
- NF-e, CT-e, editor, validação e Assistente permanecem compartilhados para manter compatibilidade. Uma separação adicional exige requisito de produto explícito e teste de regressão.
- Não foram encontrados regressões funcionais nos testes, build ou auditoria de navegador.
- A próxima mudança OpenSpec não foi iniciada.
