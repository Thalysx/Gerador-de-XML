# Catálogo único FUTURE G

## Why
O usuário substituiu explicitamente a divisão Geral/QA Portuário por um catálogo único, com filtros por categoria, antes de definir o próximo plano visual.

## What Changes
- Retirar o seletor global de ambientes e disponibilizar juntos os geradores existentes em Home, Dados, busca, lotes e comandos.
- Manter categorias e IDs do registry, sem duplicar motores nem incluir ferramentas ocultas/legadas no catálogo.
- Usar um único seletor de tipo no Cadastro: Perfil pessoal e as entidades completas existentes.
- Exibir favoritos/recentes/atividade em conjunto. Consolidar favoritos de comandos sem apagar as chaves legadas ou perder os até dez itens de cada origem.
- Atualizar especificações e testes que exigiam separação, com cobertura de migração e restauração.

## Impact
Shell, projeções do registry, apresentação do Cadastro, favoritos de comandos, testes, auditoria e documentação. Motores, modelos/XML Fiscal, schemas, APIs, conteúdo/formato dos exports, chaves dos históricos e comportamento de rolagem permanecem preservados. Sem redesign amplo, novas dependências, CI ou correções de bugs independentes.
