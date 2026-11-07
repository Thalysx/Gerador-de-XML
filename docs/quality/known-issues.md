# Problemas conhecidos antes da evolução de qualidade

Data da baseline: 02/11/2026. Estes registros não são regressões da Fase 0 e não foram corrigidos por ela.

| ID | Evidência | Estado | Encaminhamento |
| --- | --- | --- | --- |
| BASE-01 | Quatro falhas em `tests/fiscal-xsd.test.cjs`; sete hashes divergentes por normalização LF/CRLF | **Resolvido em 02/11/2026**, após a unificação do catálogo | Bytes restaurados dos ZIPs oficiais com hashes idênticos aos já registrados; manifesto/testes intactos, atributos Git e checkout/archive conferidos. Ver [integridade fiscal](fiscal-schema-integrity.md) |
| BASE-02 | `index.html:834` promete ausência de envio e de XSD; `validacao-xml.js:242` envia o XML à API first-party | Contradição confirmada por leitura de código | Correção de comunicação em change própria, preservando API e escopo fiscal |
| BASE-03 | Enter no botão de fechar da busca executava a opção selecionada | **Resolvido em 03/11/2026**, com regressão Node e teclado real | Enter limitado ao campo; botões usam ativação nativa. Ver [etapa 3](command-controls.md) |
| BASE-04 | IPv4 oferece 762 valores e mantém até 2.000 recentes; o segundo lote de 500 pode falhar | Reproduzido anteriormente nesta conversa; regras atuais inspecionadas | Change de robustez, com contrato de não repetição por lote preservado |
| BASE-05 | Upload substituído por outra análise mantinha seletor desabilitado | **Resolvido em 02/11/2026**, com regressão vermelha antes da correção | Propriedade da análise e controles corrigida; Node e E2E com FileReader/filechooser reais. Ver [etapa 2](async-xml.md) |
| BASE-06 | Vaga XSD ocupada só depois da leitura permitia ultrapassar admissão | **Resolvido em 02/11/2026**, reproduzido por HTTP real | Reserva anterior ao await, liberação segura e timeout sem devolver vaga prematuramente; sem alegação de carga de produção. Ver [etapa 2](async-xml.md) |
| BASE-07 | Conclusão de FileReader usava grupo ativo e podia reintroduzir arquivo descartado | **Resolvido em 02/11/2026**, com regressões de grupo/reset/erros | Grupo capturado por lote, cancelamento por propriedade e conclusão única; E2E com leitura real adiada. Ver [etapa 2](async-xml.md) |
| BASE-08 | `scripts/audit-browser.cjs:582` salva Dados cadastrais em `future-g-home-dark.png` | Código e captura conferidos | Validar painel/tema/ambiente antes de cada captura; usar matriz na baseline |
| BASE-09 | README/roadmap/plano citam cenários operacionais; teste e runtime atuais confirmam sua ausência | Confirmado por inventário e suíte atual | Corrigir inventário documental; não criar tela ou gerador ausente implicitamente |
| BASE-10 | Documentos visuais históricos ainda mencionam TheGenerator, roxo e chat remoto | Confirmado por leitura | Consolidar DESIGN.md na Fase 1, preservando identidade e contratos atuais |
| BASE-11 | Chip de XML anexado estreitava a textarea e obstruía Enviar no mobile | **Resolvido em 03/11/2026**, com upload/clique reais e nomes longos | Chip em linha própria; medidas e capturas em 320/390/768/1440 px, claro/escuro. Ver [etapa 3](command-controls.md) |

As reproduções anteriores estão registradas localmente em `artifacts/analysis/reproductions.json` e `artifacts/analysis/relatorio.md`. São apoio histórico, não substituem os logs da Fase 0. Os arquivos originais permanecem sem alteração segundo SHA-256.

Atualização E2E de 02/11/2026: BASE-01 também ocorre no checkout oficial, no commit `a2c8fef`; não é uma divergência exclusiva do ZIP. `npm test` continua com 120/124 aprovados e as mesmas quatro falhas fiscais. A validação OpenSpec global estrita ainda rejeita quatro especificações legadas por avisos de requisitos acima de 500 caracteres: `ai-assistant`, `app-shell`, `navigation` e `ui-system`. A nova capacidade E2E é validada separadamente; os requisitos legados não foram reescritos para ocultar os avisos.

## Limites de interpretação

- CT-e gerado em 3.00 tem validação local legada; o pacote XSD atende 4.00. O teste positivo adapta a fixture no próprio teste. Não confundir isso com geração nativa 4.00.
- Os modelos do formulário fiscal e os comandos usam valores distintos de `tpAmb`. Nenhuma emissão ou autorização real foi testada ou implementada.
- Alvos menores que o padrão interno de 44 px são oportunidades de UX; tamanho sozinho não comprova falha de conformidade.
- Regiões live, cores forçadas e teclado virtual exigem investigação. Não há resultado auditivo de leitor de tela real.

## Política da próxima entrega

Atualização de 03/11/2026 — etapa 3: **139/139 Node e 18/18 E2E aprovados**; BASE-03/11 encerrados. Build/auditoria aprovados. Permanecem BASE-02/04/08/09/10, avisos OpenSpec legados e achados gerais de estilo fora deste escopo. Ver [teclado e composer](command-controls.md). Os parágrafos seguintes preservam o histórico das etapas anteriores.

Atualização após a unificação do catálogo: os requisitos alterados de ambientes foram alinhados com a decisão do usuário. A validação OpenSpec estrita mantém avisos em duas specs legadas, `ai-assistant` e `ui-system`, por comprimento de requisitos não modificados. Os quatro testes fiscais continuam falhando; os demais 123 testes Node passaram. Ver [relatório atual](../unified-catalog.md).

Atualização posterior — etapa 1: **127/127 testes Node aprovados**, incluindo os oito fiscais existentes; BASE-01 encerrado. Os registros e contagens anteriores acima descrevem a baseline, não o estado após a restauração. As demais pendências e os avisos OpenSpec continuam separados desta correção.

Atualização posterior — etapa 2: **138/138 Node e 14/14 E2E aprovados**; BASE-05/06/07 encerrados em três changes sequenciais. Build/auditoria aprovados e hashes fiscais preservados. BASE-02/03/04/08/09/10/11 e os avisos OpenSpec legados continuam separados; ver [estados assíncronos](async-xml.md).

Não transformar estes itens em testes ignorados ou em exceções genéricas para deixar uma pipeline verde. Relatar falhas existentes pelo nome; qualquer falha nova bloqueia a entrega. Uma correção futura precisa de escopo, teste de regressão e evidência próprios. Screenshots capturam comportamento existente, mas não legitimam um defeito conhecido como requisito desejado.
