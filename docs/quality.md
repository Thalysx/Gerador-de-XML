# Verificação e manutenção

Execute os comandos na raiz do projeto, após `npm ci`, usando Node.js 20.19 ou superior.

## Testes e build

```sh
npm test
npm run build
```

Os testes Node cobrem geração, catálogo, persistência, exportações, comandos, API, relatórios XML, estados assíncronos, integridade dos schemas e o empacotamento Worker/WASM para Vercel. O build recria o runtime Lucide local e a distribuição em `.generated-public/`. Confira o resumo da execução atual; contagens antigas não substituem os resultados do checkout.

## Regressões no navegador

```sh
node node_modules/@playwright/test/cli.js install chromium
npm run test:e2e
npm run audit:browser
```

A suíte E2E usa Chromium desktop e mobile, com servidor e dados de teste isolados conforme [playwright.config.cjs](../playwright.config.cjs). Resultados e relatórios ficam nos diretórios locais ignorados pelo Git.

A auditoria cobre zoom de 200%, teclado, foco, nomes acessíveis, overflow, movimento reduzido, console e orçamentos de recursos. Para a matriz de sete painéis, dois temas, quatro larguras e dois estados da sidebar, execute no PowerShell:

```powershell
$env:AUDIT_MATRIX='1'
npm run audit:browser
Remove-Item Env:AUDIT_MATRIX
```

A matriz inclui 112 combinações básicas, 28 estados com opções abertas e casos do Editor carregado em celular. Antes de salvar cada PNG, o executor verifica o estado e registra painel, tema, catálogo, viewport, sidebar, recorte e hash no manifesto da execução. Considere somente imagens listadas em um manifesto completo, junto do relatório e exit code. Evidências ficam em `artifacts/`.

Capturas diagnósticas não aprovam automaticamente pixels, contraste efetivo ou fontes. Testes em Chromium não substituem escuta com leitor de tela nem dispositivo físico; essas verificações continuam manuais.

## Revisões direcionadas

Mudanças visuais seguem [DESIGN.md](../DESIGN.md) e devem conferir temas, teclado e recortes afetados. Mudanças fiscais seguem o [guia XML](xml-validation.md), preservando os bytes dos schemas. Testes de empacotamento devem validar a dependência real, incluindo Worker/WASM, fora da árvore de desenvolvimento.

Ao publicar, confira o commit do deploy, arquivos estáticos e os fluxos afetados. Para XSD, verifique tanto um documento compatível aprovado quanto um documento reprovado; HTTP 200 isoladamente não prova aprovação fiscal. A aplicação não executa autorização SEFAZ.

Mantenha guias e especificações atuais no Git. Relatórios por execução e propostas arquivadas permanecem locais; versões já publicadas continuam recuperáveis pelo histórico Git e pelas tags.
