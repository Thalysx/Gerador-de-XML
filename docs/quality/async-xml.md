# Etapa 2 — estados assíncronos de XML

Entrega local de 02/11/2026 na branch `fix/async-xml-workflows`, checkout `future-g-e2e`. BASE-05, BASE-06 e BASE-07 foram tratados em três changes sequenciais; cada uma foi reproduzida, corrigida, verificada e arquivada antes da seguinte. O working tree das entregas anteriores foi preservado; sem commit, push, PR ou deploy.

## BASE-05 — upload substituído

Antes: com FileReader pendente, validar texto colado invalidava a versão do upload. Seu finally não liberava mais o seletor e a entrada permanecia ocupada. O teste anterior à correção falhou com `disabled=true` após a substituição.

Agora, `iniciarAnaliseValidacaoXml` centraliza a transição: invalida a análise anterior, libera a entrada e redefine o status de upload. Uma nova leitura válida ocupa os controles novamente; somente a versão atual publica e libera os controles ao concluir. A versão também é conferida logo após ler o arquivo, antes de iniciar XSD obsoleto. Não há cancelamento novo de requisições XSD já iniciadas.

Dois testes Node adicionais verificam substituição por texto, gerador, negativo, seleção recusada e limpeza, além de duas leituras em ordens diferentes. E2E-06 usa FileReader real com resolução adiada no harness, valida texto pelos controles e volta a selecionar um arquivo por filechooser real. Nenhum parser ou resultado de geração é simulado nesse E2E.

## BASE-06 — vagas da API XSD

Antes: duas requisições com corpo parcial ainda não incrementavam o contador. Uma terceira requisição completa passava pela admissão; a reprodução no servidor real recebeu **HTTP 200 em vez de 429**. O teste isolado revelou ainda que erros síncronos antes da instalação do finally do motor podiam deixar vagas ocupadas.

Agora a reserva é síncrona, depois das verificações de método/conteúdo/origem e antes de ler o corpo. O handler libera a vaga em falhas preliminares e transfere a responsabilidade para a Promise do motor. Timeout da resposta não devolve a vaga de trabalho ainda ativo. Preservados: limite de duas vagas por instância, quinze segundos da validação, limites de bytes, códigos, payloads e headers, inclusive Retry-After.

Quatro testes em `tests/fiscal-concurrency.test.cjs` cobrem: HTTP real com corpos parciais; JSON/payload inválido e leitura interrompida; erro síncrono/rejeição do motor; timeout e liberação posterior. Os casos de motor/tempo carregam o código real do handler em contexto isolado com dependências controladas. Não constituem teste de carga de produção ou execução WASM sob estresse. Requisições admitidas aguardando corpo contam no limite; não se introduziu fila, timeout novo para o corpo ou cancelamento do motor.

## BASE-07 — destino e descarte das importações

Antes: o callback usava `editorGrupoAtivo` no instante em que terminava. Os quatro primeiros testes falharam por atribuição ao grupo errado, reaparecimento após reset/limpeza e falta de conclusão de lote com erro.

Agora cada lote guarda seu grupo inicial e seus leitores em memória. A troca de grupo não cancela a importação, mas sua conclusão não troca a seleção atual. Limpar um grupo cancela somente suas operações; reset cancela todas e aborta leitores que ainda estão lendo. Eventos atrasados de operações descartadas não inserem arquivos. Cada arquivo conclui uma vez em sucesso, XML inválido, erro, abort ou exceção de `readAsText`, preservando o restante do lote.

Cinco testes Node novos cobrem destino fixo, callback duplicado, reset seguido de nova importação, limpeza com outro grupo ativo/pendente e lotes mistos. O caso adicional de grupo vazio foi reproduzido durante a revisão: a limpeza não pode reiniciar toda a sessão se outro grupo ainda tiver leitura pendente, mesmo sem arquivos prontos. E2E-07 usa FileReader real com callback adiado no harness; importa XML sintético, seleciona Novo Grupo e confirma destino original, seleção preservada e acesso pelo grupo correto.

## Verificação por incremento

| Change | Node | E2E desktop/mobile | Build / auditoria |
| --- | ---: | ---: | --- |
| `fix-validation-upload-state` | 129/129 | 12/12 | Aprovados |
| `fix-xsd-slot-reservation` | 133/133 | 12/12 | Aprovados |
| `fix-editor-import-ownership` | 138/138 | 14/14 | Aprovados |

Nenhum teste final falhou ou foi ignorado; E2E com zero retries e zero resultados flaky. A suíte fiscal existente continua íntegra após a correção dos bytes dos schemas. Nenhuma dependência foi instalada e nenhum teste fiscal foi enfraquecido.

Evidências locais, ignoradas pelo Git e fora do build público:

- `artifacts/async-xml/base-05-before.log`, `base-06-before.log`, `base-07-before.log`: regressões vermelhas antes de cada correção.
- `base-05-after.log`, `base-06-after.log`, `base-07-after.log` e `base-07-empty-group-before.log`: verificações dirigidas e caso de borda.
- `base-05-results.json`, `base-06-results.json`, `base-07-results.json` e logs correspondentes: resultados completos e durações medidas por incremento.
- `artifacts/e2e/base-05/`, `base-06/`, `base-07/`: HTML/JSON do executor; trace/screenshot seriam retidos em falhas.
- `artifacts/async-xml/final-verification.json`: hashes fiscais, integridade do núcleo preservado e resumo final.

Scripts de reprodução na raiz do checkout:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run audit:browser
$env:FUTURE_G_E2E_RUN = 'async-xml-repeat'
try { npm.cmd run test:e2e } finally { Remove-Item Env:FUTURE_G_E2E_RUN }
```

Os testes usam dados sintéticos. O harness controla somente o instante de leitura/conclusão necessário para reproduzir corridas; as verificações completas mantêm os geradores, parser, servidor e downloads reais. Não se usaram sleeps arbitrários para ordenar callbacks.

## Preservação e limites

Arquivos funcionais alterados nesta etapa: `assets/js/validacao-xml.js`, `scripts/fiscal-validation-api.cjs` e `assets/js/editor-xml.js`. Mesmos endpoints, contratos JSON, IDs, handlers de entrada, formatos de histórico/exportação, modelos fiscais, catálogo único, CSS e regras de rolagem. Somente o fluxo de admissão/publicação/cancelamento foi corrigido. Os doze XSDs continuam com os hashes do manifesto.

Sem novo redesign, matriz visual completa, aprovação de snapshots, teste de carga de produção, leitor de tela real ou implantação. Os E2E novos executam nos dois projetos existentes; a auditoria cobre o shell e estados de tema já configurados. Nenhuma alegação de acessibilidade completa, validação oficial ou autorização SEFAZ.

Os avisos globais de requisitos longos em `ai-assistant` e `ui-system` permanecem fora desta etapa. BASE-02/03/04/08/09/10/11 continuam no backlog; a próxima etapa é teclado e composer mobile (BASE-03/11), sem iniciar automaticamente esse trabalho.

Arquivos OpenSpec: `openspec/changes/archive/2026-11-02-fix-validation-upload-state/`, `2026-11-02-fix-xsd-slot-reservation/` e `2026-11-02-fix-editor-import-ownership/`. As três decisões foram incorporadas a `openspec/specs/xml-validation/spec.md`. Reversão deve restaurar código, testes e specs de cada incremento como conjunto, sem apagar storage ou desfazer a restauração dos schemas.
