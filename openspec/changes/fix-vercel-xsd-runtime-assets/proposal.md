# Incluir recursos do motor XSD no pacote da Vercel

## Why
A publicação alpha.8 teve build/deploy concluídos e ativos públicos idênticos ao build, mas `/api/validate-xml` respondeu HTTP 503 com código -1 em uma validação XSD real. A biblioteca usa um Worker que carrega `xmllint.wasm` por caminho dinâmico; o includeFiles atual não declara esses recursos de runtime.

## What Changes
- Reproduzir o carregamento de um pacote isolado do motor usando os arquivos declarados na configuração.
- Incluir explicitamente os recursos de `xmllint-wasm` na função Vercel.
- Cobrir validação positiva/negativa no pacote isolado e conferir o endpoint publicado.

## Impact
Configuração de empacotamento, regressão de runtime e documentação da publicação. Sem mudar biblioteca, regras, schemas/hashes, limites, contratos JSON ou acesso externo. A limpeza de documentação feita na main permanece preservada. Sem ampliar credenciais ou desativar proteção.
