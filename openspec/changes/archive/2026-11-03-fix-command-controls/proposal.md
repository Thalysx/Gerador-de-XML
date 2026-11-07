# Correção dos controles de busca e comandos

## Why

BASE-03: Enter no botão Fechar da busca global executa o resultado selecionado.
BASE-11: o chip do anexo ocupa a linha da mensagem e obstrui Enviar no mobile.

## What Changes

Corrigir somente o roteamento de Enter e a disposição do anexo no composer existente. Preservar navegação, foco de retorno, atalhos, comandos, anexos, geradores, temas, persistência e rolagem.

## Riscos e aceite

Verificar Enter/Espaço no fechamento, Enter no campo e em uma opção focada, Escape e Tab. Verificar envio por clique com anexo, preservação do rascunho em erro, remoção, nomes longos e ausência de sobreposição em desktop/mobile. Registrar regressões antes da correção; executar Node, E2E, build e auditoria. Sem dependências, redesign, publicação ou correções das demais pendências.
