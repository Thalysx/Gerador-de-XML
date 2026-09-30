# Design

## Diagnóstico

- `gerarRegistro` entrega objetos em `registro.valor` para geradores compostos.
- `gerarDocumentoComposto` transforma o objeto em texto antes de chamar `setOutput`.
- `#output-val` recebe apenas `textContent`, com tipografia monoespaçada e `white-space: pre-wrap`.
- O histórico salva `estrutura`, mas `restaurarHistoricoDocs` restaura somente `valor`.
- Copiar, TXT e detalhes leem o DOM, acoplando exportação à apresentação.

## Decisão

Separar o estado textual exportável da projeção visual. `setOutput` continuará aceitando texto e passará a aceitar opcionalmente o objeto estruturado. O renderizador criará uma `dl` responsiva com DOM seguro; quando não houver estrutura confiável, manterá uma apresentação textual.

Como compatibilidade, textos com pelo menos dois pares válidos `chave: valor`, sem linhas ambíguas, poderão ser interpretados. Objetos fornecidos pelo gerador são a fonte preferencial.

Campos extensos conhecidos e valores longos ocupam a largura inteira. Labels usam um dicionário pequeno para termos de domínio e uma conversão genérica para novos campos.

Copiar, baixar e detalhes usarão o texto original preservado, não o `textContent` da projeção visual.

## Entregas incrementais

1. Estado, renderização estruturada, fallback, labels, layout e compatibilidade de ações/histórico.
2. Container de rolagem e reset único após cada novo resultado.
3. Regressões automatizadas, auditoria visual e documentação de conclusão.
