# Change: Release Readiness Regressions

## Motivation
Corrigir falhas reais de integridade, navegação e acessibilidade encontradas no navegador depois do encerramento do roadmap 01–11.

## Scope
Ativos públicos do servidor local; isolamento NF-e/CT-e; resumo de CT-e; scroll entre telas; sidebar em viewport baixa; movimento, transições e tooltips; quebra de valores; auditoria e regressão.

## Out of Scope
Novos geradores, XSD, assinatura digital, integração oficial, regras tributárias completas e mudanças no provedor de IA.

## Constraints
- Preservar os fluxos existentes e as preferências locais.
- Manter NF-e exclusiva de Geradores Gerais e CT-e exclusiva de QA Portuário.
- Não expor arquivos internos pelo servidor local.
- Validar a aplicação no servidor real usado pelo desenvolvimento, além do auditor isolado.
