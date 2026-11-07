# Encerramento — 07/11/2026

BASE-04 reproduzido e corrigido. IPv4 seleciona diretamente entre os mesmos 762 endereços fora dos últimos 500 valores; o histórico do tipo fica limitado a 500. Lotes consecutivos de até 500 completam sem duplicatas internas. Reutilização após sair da janela recente é permitida. Helper compartilhado, motor de lote, demais tipos, formatos, opções e exportações preservados.

Três regressões Node e um E2E falharam antes da correção. Resultado final: 142/142 Node e 20/20 E2E desktop/mobile, zero retries; build/auditoria aprovados. Testes incluem geração individual prolongada, índice aleatório constante, pedidos mistos/fracionados e downloads JSON reais de lotes consecutivos na interface e nos comandos. Change e spec de lotes aprovadas no OpenSpec estrito; validação global conserva somente os dois avisos legados.

Requisito canônico sincronizado. Relatório: `docs/quality/ipv4-batches.md`; evidências em `artifacts/base-04-*` e `artifacts/e2e/base-04*/`. BASE-02 e demais alterações anteriores preservadas. Sem novo commit, push, PR ou deploy; BASE-08/09/10 não iniciados.
