# Proposta — baseline de qualidade

## Why

O plano de qualidade requer uma baseline antes de novas dependências, testes E2E e mudanças de UX. O histórico de auditorias contém marcos de versões anteriores e não substitui medir a cópia atual.

## What Changes

- Registrar ambiente, versões, scripts, limites de Git e ferramentas.
- Executar testes, build e auditoria padrão/matriz sem modificar funcionalidade.
- Preservar logs, métricas e capturas fora do build público.
- Inventariar cobertura e problemas preexistentes separadamente.
- Preparar uma proposta pequena para E2E, sem iniciar sua implementação.

## Capabilities

Nenhuma capacidade de produto adicionada ou alterada. `skip_specs: true`: diagnóstico e documentação sem delta de comportamento, seguindo o precedente de manutenção documental do repositório.

## Impact

Novos documentos em `docs/quality/` e artefatos locais ignorados em `artifacts/quality/baseline/`. Nenhuma dependência instalada, nenhum arquivo original alterado, nenhum deploy.

Esta cópia não tem `.git`; branch/PR são operações não executáveis aqui sem recuperar um checkout real. O diagnóstico local permanece útil e não cria histórico artificial.
