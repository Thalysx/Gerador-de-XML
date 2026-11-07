# BASE-05 — liberar entrada após substituir upload

## Why
A leitura assíncrona usa a versão do relatório para descartar resultados antigos, mas também condiciona a liberação dos controles a essa versão. Colar XML ou iniciar outra análise invalida o upload sem liberar a entrada.

## What Changes
- Reproduzir o bloqueio por leitura controlada antes da correção.
- Centralizar o início de uma análise: invalidar a anterior, liberar controles pertencentes ao upload anterior e redefinir seu status.
- Evitar iniciar XSD de uma leitura que já foi substituída; conclusões antigas não alteram relatórios ou controles de uma operação nova.

## Impact
Somente ciclo de estado da Validação, testes e documentação. Sem mudar limites, XML, regras fiscais, endpoint, persistência, IDs ou scroll. BASE-06 e BASE-07 entram em changes posteriores desta etapa.
