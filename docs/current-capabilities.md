# Funcionalidades atuais do FUTURE G

Inventário do checkout local `future-g-e2e` em 07/11/2026. Descreve o runtime existente, incluindo as correções locais ainda sem publicação; não é uma verificação do site em produção. Este inventário e as specs atuais devem orientar a leitura dos relatórios e planos históricos.

## Áreas disponíveis

O catálogo é único. Ferramentas gerais e portuárias aparecem juntas, com filtros por categoria; não há alternância global entre Geradores Gerais e QA Portuário.

| Área | ID de navegação | Disponível no runtime |
| --- | --- | --- |
| Início | `home` | Descoberta, busca, ferramentas, favoritos, recentes e resumo da atividade |
| XML fiscal | `xml` | NF-e/CT-e, campos, produtos, NCMs, preservação de campos, cenários XML salvos, prévia e downloads |
| Dados cadastrais | `docs` | Geradores gerais/portuários por categoria, resultado individual, lotes de até 500 e exportações compatíveis |
| Cadastro geral | `cadastro` | Perfil pessoal por grupos e fichas completas por tipo; edição e restauração do histórico |
| Editor XML | `editor` | Importação por grupos, edição de cópias e exportação de XML |
| Validação XML | `validacao` | Sintaxe/regras locais, XSD pela API da aplicação para versões suportadas, relatórios e cópias negativas |
| Comandos locais | `chat` | Geração, lotes, consultas e validação local de XML, anexos, favoritos e repetição de comandos |

Fontes: [`APP_NAVIGATION` e registry](../assets/js/generator-registry.js), [HTML](../index.html), [catálogo unificado](unified-catalog.md). Os tipos de Cadastro escolhem a ficha; não mudam o catálogo global. O valor técnico `chat` é mantido por compatibilidade e identifica os comandos locais atuais.

## Dois significados de cenário

| Recurso | Estado atual | Evidência |
| --- | --- | --- |
| Cenários XML salvos | Disponível em XML fiscal | Controles `cenario-nome`/`cenario-lista`; funções `salvarCenarioXml`, `carregarCenarioXml` e `excluirCenarioXml` |
| Biblioteca de fluxos operacionais portuários | Ausente do runtime atual | Sem rota/painel `scenarios`, função `gerarCenarioTeste` ou carregamento de `assets/js/test-scenarios.js` |

Um cenário XML salvo guarda nome, campos do formulário, quantidade de produtos e dados dinâmicos da NF-e. O navegador conserva até 20 configurações em `gerador:cenarios_xml`, com carregar/excluir. É uma configuração reutilizável do gerador XML, sem criar um processo operacional ligado a Gate, agendamento, veículo, contêiner ou carga. Fonte: [workflow XML](../assets/js/xml-workflow.js).

A antiga biblioteca de dez fluxos portuários, modos Válido/Inválido/Aleatório, modelo `future-g.test-scenario.v1` e histórico `gerador:cenarios_teste` aparecem em [relatório histórico da fase 09](future-g-09-test-scenarios.md). Essas descrições não indicam disponibilidade atual. O arquivo de implementação e a spec `test-scenarios` citados naquele relatório não existem no inventário vigente. Não há restauração dessa biblioteca nesta entrega nem trabalho de implementação iniciado para ela.

As variantes negativas da Validação XML e as cópias XML dos comandos locais permanecem disponíveis; não são a antiga biblioteca de fluxos operacionais. A validação XSD usa a API da aplicação e não autoriza documentos na SEFAZ; veja [cobertura fiscal](future-g-13a-local-fiscal-validation.md).

## Produtividade disponível

Busca `Ctrl+K`, favoritos, recentes e atividade usam o catálogo inteiro. O resumo da Home mostra ferramentas, favoritos, atividades e lotes recentes. A atividade aceita somente geração individual, XML, lote e exportação; não contabiliza massas da biblioteca operacional ausente.

`futureg:activity-v1` guarda até 50 entradas normalizadas com identificador, ambiente, tipo, quantidade e horário. Os rótulos legados `general`/`port` continuam legíveis como metadados; as entradas aparecem juntas. Limpar atividade remove essa lista inteira e preserva favoritos e históricos detalhados. O resumo não guarda valores gerados, prompts, anexos ou segredos. Fontes: [produtividade](../assets/js/productivity.js) e [spec vigente](../openspec/specs/history-favorites/spec.md).

## Histórico e verificação

O teste existente `Cenários de teste não fazem parte da navegação nem do runtime público` confirma a ausência da biblioteca operacional. Outros testes exercitam cenários XML salvos, catálogo/favoritos unificados e preservação/limpeza da atividade legada. Fontes: [suíte Node](../tests/projeto.test.cjs) e [relatório BASE-09](quality/capability-inventory.md).

Marcos arquivados preservam decisões e verificações da época. Para o estado vigente, consulte este inventário e o [roadmap atualizado](roadmap-consolidado.md); para os detalhes de unificação, consulte [catálogo único](unified-catalog.md). A consolidação documental BASE-10 está em [DESIGN.md](../DESIGN.md), sem alterar a interface ou iniciar outra revisão visual.
