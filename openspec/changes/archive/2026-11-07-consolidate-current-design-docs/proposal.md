# BASE-10 — consolidar a documentação de design vigente

## Why
Planos e relatórios visuais antigos ainda prescrevem TheGenerator, paleta roxa, divisão por ambiente e chat remoto. A implementação e as specs atuais usam FUTURE G, superfícies neutras, interação azul, catálogo único e comandos locais. Falta uma referência de design que explicite o estado vigente e preserve os relatos históricos.

## What Changes
- Criar `DESIGN.md` a partir de tokens, componentes e contratos já implementados, com identidade, temas, tipografia, hierarquia, estados, responsividade, teclado e rolagem.
- Alinhar `IDENTIDADE.md`, README, arquitetura e roteiro auditivo ao guia vigente.
- Identificar planos/relatórios visuais antigos como históricos, com ligação para a referência atual.
- Registrar limites das evidências e encerrar BASE-10 sem redesenhar a interface.

## Impact
Somente documentação. Sem alterar código, CSS, assets, dependências, modelos fiscais, armazenamento ou testes. Não introduzir nova direção visual, componentes ou requisitos funcionais. As specs canônicas já descrevem a base vigente e serão referenciadas; `skip_specs: true` segue a convenção documental do projeto. Sem aprovação automática de snapshots, leitor de tela ou publicação.
