# Decisões

- Contexto visível único `unified`; os metadados `general`/`port` permanecem como classificação legada de domínio, úteis para ler atividade/histórico e manter os nomes de exports. Não são filtros da interface.
- Funções e evento legados de ambiente permanecem compatíveis, mas não reativam ambientes. Preferência `futureg:environment` antiga é ignorada na apresentação e não apagada.
- O seletor existente `cad-port-tipo` é movido para fora do formulário especializado e ganha `perfil` como opção inicial. As funções existentes escolhem os motores pelo tipo de ficha, sem trocar contexto global. Restaurar histórico escolhe o tipo correto.
- Favoritos de geradores já usam IDs globais: remover apenas a projeção. Comandos usam uma lista `unified`, inicialmente com a união distinta das duas listas legadas; limite global 20 para acomodar ambas. As listas antigas permanecem intactas; uma remoção na lista unificada não reaparece após reload.
- Atividade aceita metadados históricos das duas origens e novos itens `unified`, apresentando-os juntos. A ação de limpeza é explicitamente global.
- Reutilizar cores, tipografia, controles e layout existentes. O plano visual futuro passa a partir deste catálogo único.

Riscos: preferências antigas, histórico de fichas, expectativas de testes/auditor sobre ambientes e volume maior de opções. Mitigação: testes de migração e persistência, filtros por categoria, XML intacto, revisão desktop/mobile e claro/escuro. As quatro falhas fiscais anteriores são contabilizadas separadamente.
