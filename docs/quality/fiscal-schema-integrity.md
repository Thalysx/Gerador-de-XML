# Etapa 1 — integridade dos schemas fiscais

Concluída localmente em **02/11/2026**, após a entrega do catálogo único. Branch `fix/fiscal-schema-integrity`, checkout `future-g-e2e`. As alterações anteriores foram preservadas no working tree; não houve commit, push, PR ou deploy nesta manutenção.

**Resultado: BASE-01 resolvido, 127/127 testes Node aprovados.** A tabela original previa 124 testes; a suíte passou a ter 127 após os testes de migração do catálogo. Nenhum teste foi desabilitado, enfraquecido ou renomeado para ocultar as falhas fiscais.

## Diagnóstico e origem

Sete dos doze XSDs haviam sido normalizados para LF no próprio histórico Git, enquanto seus hashes registrados correspondiam aos bytes CRLF dos arquivos de origem. Esse bloqueio fazia `verifySchemas()` recusar o pacote antes de executar o motor XSD. Não era necessário mudar regras fiscais ou atualizar o pacote.

Os dois ZIPs foram novamente baixados das URLs já registradas no manifesto:

| Pacote | Fonte oficial | SHA-256 do ZIP, idêntico ao manifesto existente |
| --- | --- | --- |
| NF-e `PL_010f_v1.04` | [Portal NF-e — pacote incorporado](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=8ITFuBLltXs=) | `b8589490a58a09a993a80e6ac4d7ed10f20892061ecfc56719337098d4b95998` |
| CT-e `PL_CTe_400_NT2026.002_RTC_1.01_corr` | [Portal CT-e — pacote incorporado](https://www.cte.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=qGIe20MvWf4=) | `e17c24816d3483e472e5c0750e99fa40d6c17af38f50c153fb79b66cfd79942c` |

Cada um dos onze arquivos marcados como oficiais foi encontrado no ZIP correto com o SHA-256 esperado. O décimo segundo é o wrapper derivado `nfe/4.00/procNFe_v4.00.xsd`, que já estava íntegro e permaneceu intacto. Antes de escrever, foi comprovado que a diferença dos sete arquivos locais era exclusivamente de fins de linha. A comparação que remove CR antes de LF foi somente diagnóstica; o verificador de produção continua comparando os bytes brutos.

## Alterações

Foram restaurados diretamente dos ZIPs verificados, por cópia binária:

- NF-e: `nfe_v4.00.xsd` e `xmldsig-core-schema_v1.01.xsd`.
- CT-e: `cteTiposBasico_v4.00.xsd`, `cte_v4.00.xsd`, `procCTe_v4.00.xsd`, `tiposGeralCTe_v4.00.xsd` e `xmldsig-core-schema_v1.01.xsd`.

Os outros cinco XSDs permaneceram intactos. O diff dos schemas ignorando fim de linha é vazio. Não houve decodificação/reencoding, parse/serialização, trim ou formatação dos arquivos oficiais.

A nova regra em `.gitattributes` é:

```gitattributes
schemas/fiscal/**/*.xsd -text whitespace=-blank-at-eol,cr-at-eol
```

`-text` desabilita a conversão automática de fim de linha somente nesses arquivos vendorizados. Não se impõe LF ou CRLF a todos: cada arquivo conserva os bytes determinados pelo seu hash. Os atributos de whitespace reconhecem CRLF e permitem os espaços finais já presentes no pacote oficial, evitando sugerir uma limpeza que quebraria a integridade. A verificação SHA-256 existente continua rejeitando qualquer alteração, inclusive espaços.

Permaneceram intactos: `manifest.json` e todos os seus hashes; `scripts/fiscal-xsd.cjs`; os oito testes fiscais existentes; modelos e geradores XML; endpoints e limites; fontes HTML/CSS/JS da interface; persistência; dependências e comportamento de rolagem. Esta manutenção não implementa correções assíncronas ou qualquer outra etapa da tabela.

## Verificações e evidências

| Verificação | Resultado | Tempo |
| --- | --- | ---: |
| `npm test` | **127/127**, zero falhas/ignorados; os oito fiscais passaram | 19,831 s |
| `npm run build` | Aprovado | 0,726 s |
| `npm run audit:browser` | Aprovado | 7,665 s |
| `npm run test:e2e` | **10/10**, desktop/mobile, zero retries/skips/flaky | 12,763 s |
| Git com `autocrlf=true`, `false`, `input` | Os doze hashes preservados em cada checkout isolado | Não medido |
| ZIP de `git archive` | Os doze hashes preservados | Não medido |
| Verificador real em cópia isolada | Aceita o pacote íntegro e recusa um byte acrescentado com `schema-integridade` | Não medido |
| Navegador → servidor → XSD → relatório | NF-e sintética aprovada e XML incompleto reprovado; ambos HTTP 200, sem erros de página | Não medido |

O index do repositório real e as configurações globais do Git não foram alterados. A simulação usa um repositório de teste dentro de artefatos ignorados; não substitui o checkout oficial. A prova de adulteração foi executada em cópia descartável, em processo novo, usando o mesmo código do verificador. A política não se apoia em mocks de sucesso do XSD.

A confirmação positiva pelo navegador foi feita pela ação existente **Validar XML do gerador**, com resposta da API real e cobertura XSD aprovada na tela. Um conteúdo sintético incompleto enviado pela ação **Validar conteúdo** recebeu cobertura reprovada e três achados XSD. A screenshot foi aberta e inspecionada; não é aprovação de design. CT-e 4.00 continua coberto pela fixture adaptada já existente no teste; não foi feita migração do gerador legado 3.00 para 4.00.

Evidências locais, ignoradas pelo Git e fora do build público:

- `artifacts/xsd-integrity/provenance-before.json` e `provenance.json`: origem dos arquivos, hashes de pacote/arquivo e prova de diferença apenas em fins de linha.
- `packaging.json` e `archive-integrity.json`: index isolado, três checkouts e archive; recusa de adulteração e index real preservado.
- `results.json`, `node.log`, `build.log`, `audit.log` e `e2e.log`: resultados e durações.
- `browser.json`, `browser.log` e `nfe-xsd-approved.png`: fluxo real pelo navegador e cobertura.
- `artifacts/e2e/xsd-integrity/`: relatórios E2E HTML/JSON.

Os ZIPs oficiais ficam somente nos artefatos locais para auditoria; não se adicionou download em runtime ou dependência nova. O build público mantém sua allowlist e não inclui schemas, relatórios, scripts de diagnóstico ou pacotes ZIP.

## Reprodução e limites

Com as dependências e o Chromium do executor já instalados:

```powershell
node -e "require('./scripts/fiscal-xsd.cjs').verifySchemas()"
npm.cmd test
npm.cmd run build
npm.cmd run audit:browser
$env:FUTURE_G_E2E_RUN = 'xsd-integrity-repeat'
try { npm.cmd run test:e2e } finally { Remove-Item Env:FUTURE_G_E2E_RUN }
```

Não atualize o manifesto se um checkout falhar na integridade: verificar atributos, origem e bytes primeiro. Uma atualização fiscal futura exige outra change e revisão dos pacotes. Voltar apenas os sete arquivos para LF reintroduz BASE-01; os atributos não consertam retroativamente um blob errado.

Sem execução de CI remota, deploy, leitor de tela real, nova matriz visual ou nova aprovação de screenshots. A UI não mudou nesta etapa. As pendências BASE-02 a BASE-11 permanecem separadas; inclusive a mensagem de privacidade contraditória na Validação e o composer com anexo no mobile. A validação OpenSpec global ainda tem avisos legados em `ai-assistant` e `ui-system`, fora deste incremento.

Change: `openspec/changes/archive/2026-11-02-restore-fiscal-schema-bytes/`. As etapas seguintes continuam no backlog; a próxima trata estados assíncronos em mudanças menores e sequenciais. A aprovação destes testes demonstra os contratos cobertos, sem alegar assinatura, autorização SEFAZ ou validade jurídica do XML.
