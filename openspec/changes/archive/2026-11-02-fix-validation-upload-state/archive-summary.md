# Encerramento — BASE-05

02/11/2026. Reproduzido antes da correção por teste Node: colar XML durante leitura deixava controles desabilitados. O início comum invalida a análise anterior, libera sua entrada e redefine o status. Upload atual ocupa os controles novamente; leituras obsoletas não iniciam XSD nem publicam relatório.

Regressões cobrem texto, gerador, negativo, seleção recusada, limpeza e duas leituras concluídas fora de ordem. E2E-06 usa FileReader real com conclusão adiada, controles existentes e filechooser real para confirmar que outro arquivo pode ser selecionado depois da substituição.

Validação: 129/129 Node; build e auditoria aprovados; 12/12 E2E desktop/mobile, zero retries. Evidências: `artifacts/async-xml/base-05-*` e `artifacts/e2e/base-05/`. Spec canônica sincronizada e change validada antes do arquivamento. Nenhuma regra fiscal, API, persistência, ID ou scroll alterado. Pedidos XSD já iniciados continuam com o contrato existente; apenas sua publicação obsoleta é descartada.
