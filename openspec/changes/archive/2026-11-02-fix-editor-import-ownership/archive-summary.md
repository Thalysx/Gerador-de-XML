# Encerramento — BASE-07 / etapa 2

02/11/2026. Quatro testes vermelhos reproduziram grupo errado, arquivo reaparecendo após reset/limpeza e lote sem conclusão por erro. O grupo passa a pertencer ao lote desde o início. Limpeza cancela apenas seu grupo; reset cancela todas as leituras e eventos antigos são ignorados. Conclusão única preserva arquivos válidos em erros/abort/exceções. Um quinto teste cobre grupo vazio com importação pendente em outro grupo; essa condição não reinicia a sessão.

E2E-07 usa FileReader real com callback adiado para comprovar grupo original, seleção atual preservada e XML-fonte intacto. E2E-06 da change anterior continua comprovando liberação do seletor e novo filechooser. Resultado final: 138/138 Node, build e auditoria aprovados, 14/14 E2E desktop/mobile, zero retries/skips/flaky. Os doze hashes fiscais continuam corretos e modelos/geradores/schema/contratos JSON/persistência/CSS/scroll permanecem preservados.

Especificação canônica sincronizada; change e spec validadas antes de arquivar. Evidências em `artifacts/async-xml/base-07-*` e `artifacts/e2e/base-07/`; relatório `docs/quality/async-xml.md`. Sem nova dependência, commit/push, PR ou deploy. Os avisos globais de requisitos longos em `ai-assistant` e `ui-system` permanecem fora do escopo.

Esta change foi iniciada após arquivar BASE-06; a etapa 2 encerra BASE-05/06/07. A etapa 3 (teclado e composer mobile) não foi iniciada.
