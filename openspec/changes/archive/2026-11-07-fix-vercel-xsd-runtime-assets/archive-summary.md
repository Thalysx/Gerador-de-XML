# Encerramento — 07/11/2026

Falha de empacotamento XSD encontrada ao verificar a alpha.8 em produção: HTTP 503/-1. Reproduzida em pacote isolado sem `xmllint.wasm`; includeFiles agora declara os recursos da dependência, mantendo Worker e binário disponíveis. Motor, schemas, hashes, limites e contratos preservados.

146/146 Node e build aprovados após a correção; 20/20 E2E executados na preparação da versão. Nova regressão executa a dependência real fora do node_modules original, com XML positivo e negativo. Produção: 58 ativos com hashes do build, endpoints antigos 410, XSD negativo reprovado e NF-e positiva aprovada pelo fluxo do navegador; CPF, lotes e comando local também conferidos sem erros de console/JavaScript.

Spec canônica sincronizada e validações estritas da change/spec aprovadas. Dois avisos globais legados permanecem. Registros e limites em `docs/releases/3.0.0-alpha.8.md`; evidências em `artifacts/release-alpha8/`. Exclusões feitas na main preservadas. Não houve novo schema, dependência, credencial ou integração SEFAZ.
