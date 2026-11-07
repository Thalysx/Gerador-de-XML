# BASE-06 — reserva de vagas da API XSD

## Why
O limite é verificado antes da leitura assíncrona do corpo, mas a vaga só é ocupada depois. Requisições simultâneas passam pela checagem com o mesmo contador e podem exceder o limite documentado.

## What Changes
- Reproduzir com servidor real: duas requisições com corpos pendentes e uma terceira completa.
- Reservar a vaga antes do primeiro await e liberá-la em qualquer falha anterior ao motor.
- Transferir a responsabilidade de liberação para a conclusão real do motor; timeout da resposta não libera trabalho ainda ativo.
- Testar falhas de corpo, interrupção, motor e timeout sem mudar endpoint ou payloads.

## Impact
Controle de recursos interno da API, testes e documentação; sem alteração de XML, schemas, regras fiscais, limites existentes, JSON de sucesso/erro, headers, persistência ou interface.
