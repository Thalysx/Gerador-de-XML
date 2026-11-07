# BASE-04 — evitar esgotamento dos IPv4 de documentação

## Why
Os três blocos usados pelo gerador, com hosts de 1 a 254, oferecem 762 valores. O histórico compartilhado de até 2.000 recentes nunca libera um IPv4 antes de esgotar esse domínio. Um segundo lote de 500 falha, embora o contrato exija unicidade somente dentro de cada lote.

## What Changes
- Reproduzir a falha de lotes consecutivos com o motor real.
- Escolher IPv4 diretamente entre os endereços fora de uma janela de 500 recentes, sem tentativas aleatórias por rejeição.
- Preservar hosts, blocos, formato, limite de 500, unicidade no lote, interfaces e exportações.
- Cobrir lotes consecutivos, geração individual, aleatoriedade adversa e pedidos mistos, incluindo geração/exportação no navegador.

## Impact
Somente o gerador IPv4, testes, requisito e documentação da correção. O helper compartilhado e os demais geradores permanecem intactos. Sem novos dados de rede, persistência, dependências, redesign, API ou publicação. Trabalho anterior de BASE-02 preservado.
