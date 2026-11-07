# Proposta — cinco fluxos E2E

## Why

A baseline da Fase 0 tem testes Node e uma auditoria geométrica extensa, mas não uma suíte Playwright Test persistente com contexto novo por teste e traces de falha. A versão alpha transitiva da CLI não deve definir a versão do executor.

## What Changes

- Playwright Test estável 1.64.1, preservando a CLI 0.1.23 já instalada pelo usuário.
- Cinco fluxos reais em Chromium desktop/mobile, sem alteração da aplicação.
- Servidor importado de `scripts/serve.cjs` em loopback, sem carregar `.env`.
- Rede externa opcional omitida explicitamente; erros da aplicação e tráfego inesperado falham.
- Storage isolado, zero retries, downloads e clipboard reais, trace/screenshot em falhas.
- Documentação e evidências separadas das quatro falhas fiscais preexistentes.

## Capabilities

Nova capacidade de desenvolvimento `browser-smoke-testing`; nenhum contrato de produto modificado.

## Impact

Dependências de desenvolvimento, config, testes, ignore e documentação. Sem alterações de HTML, CSS, scripts de produção, schemas, persistência, APIs ou scroll. Sem CI, axe, fast-check ou comparação visual bloqueante nesta entrega.
