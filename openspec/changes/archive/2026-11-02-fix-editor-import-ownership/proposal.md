# BASE-07 — destino estável da importação no Editor

## Why
FileReader conclui usando o grupo ativo naquele instante, não o grupo escolhido no início. Troca de grupo, limpeza ou reset durante leitura pode atribuir arquivos ao destino errado ou recriar conteúdo descartado. Falhas de leitura também deixam o lote sem conclusão.

## What Changes
- Capturar o grupo de destino por lote e manter a seleção atual se o usuário trocar de grupo.
- Cancelar importações pendentes do grupo limpo ou de toda a sessão reiniciada; callbacks atrasados não recriam arquivos.
- Concluir o lote em sucesso, XML inválido, erro, abort e falha síncrona, preservando arquivos válidos.
- Cobrir com leitores controlados e importação real adiada em E2E.

## Impact
Somente ciclo de importação do Editor, testes e documentação. Mesmos IDs, grupos, parser, exportações, modelos/XML Fiscal e persistência; sem mudanças de scroll ou geração.
