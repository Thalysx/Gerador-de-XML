# BASE-02 — comunicação da validação XML

Entrega local de 07/11/2026 no checkout `future-g-e2e`. Change `fix-validation-processing-copy`. A tela afirmava que a análise inteira acontecia no navegador, não validava XSD e não enviava arquivos. O cliente existente envia XML compatível à API da aplicação; a correção alinha o texto a esse fluxo.

O aviso antes da seleção distingue sintaxe/regras no navegador de XSD no servidor da aplicação. Explica que selecionar/arrastar arquivos ou acionar uma validação envia NF-e ou CT-e 4.00 com sintaxe válida e até 4 MiB para essa etapa. A ausência de armazenamento/log refere-se ao conteúdo XML no serviço XSD. A tela também informa o fallback local, CT-e 3.00 sem cobertura XSD e as exclusões de assinatura digital, regras fiscais completas e autorização SEFAZ. O limite de upload de 5 MB por arquivo continua separado do limite XSD.

O resumo superior ficou curto após a inspeção mobile para não alongar uma coluna estreita ao lado das ações. Não houve alteração de CSS ou de controles. README e guia fiscal atual foram alinhados; registros históricos foram preservados.

## Verificação

- **139/139 testes Node**, sem falhas, skips ou cancelamentos, incluindo integridade fiscal e endpoint XSD.
- **18/18 E2E**, Chromium desktop/mobile, zero retries; build e auditoria de navegador aprovados.
- Navegador → POST de mesma origem → motor XSD real → relatório: NF-e sintética obteve HTTP 200 e XSD aprovado, sem eco do XML na resposta. Abrir a tela e digitar não produziram pedido; validar CT-e 3.00 não acionou o endpoint. Bloquear a rede preservou sintaxe aprovada e exibiu XSD indisponível. Nenhum parser ou resultado positivo foi simulado.
- Capturas finais em **320, 390 e 1280 px**, claro/escuro, com sidebar recolhida no mobile; aviso anterior à seleção e sem corte no próprio parágrafo. Amostras revistas visualmente. A primeira coleta com sidebar desktop sobreposta após resize foi corrigida no harness antes da coleta final; não exigiu mudança da aplicação. Capturas diagnósticas, sem aprovação visual global ou leitor de tela real.
- Change e spec `xml-validation` aprovadas pela CLI OpenSpec disponível no cache, em modo estrito, sem instalar dependências. Validação global mantém apenas os avisos legados de requisitos longos em `ai-assistant` e `ui-system`; não está integralmente aprovada.

Evidências ignoradas pelo Git e fora do build público:

- `artifacts/base-02-node.log`, `base-02-e2e.log`, `base-02-build.log`, `base-02-audit.log`.
- `artifacts/e2e/base-02/`: relatórios HTML/JSON da suíte existente.
- `artifacts/base-02-browser.cjs`, `base-02-browser.log`, `base-02-browser/verification.json`: roteiro e resultado do fluxo real; os dados usados são sintéticos.
- `artifacts/base-02-browser/validation-*.png`, `final-captures.json`: captura final após encurtar o resumo superior.
- `artifacts/base-02-openspec-global.json`: avisos globais mantidos.

Não foram adicionados testes que apenas espelham as frases. A verificação usa as suítes existentes e inspeção dirigida do fluxo afetado. Não houve alteração de JavaScript, CSS, modelos, schemas, IDs, handlers, limites, armazenamento, regras de rolagem ou contrato da API. Nenhuma dependência, novo consentimento, push ou deploy.

O requisito foi sincronizado em `openspec/specs/xml-validation/spec.md`; change arquivada em `openspec/changes/archive/2026-11-07-fix-validation-processing-copy/`. Permanecem BASE-04/08/09/10 e os avisos legados. Reversão desta entrega envolve somente os textos e o requisito/documentação correspondentes; não altera os dados do usuário.
