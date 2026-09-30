# Change: Corrigir apresentação e comportamento do painel Resultado

## Motivation

Resultados compostos já são gerados como objetos, mas a interface os achata em linhas `chave: valor` e os apresenta como saída técnica. Um novo resultado também pode herdar a posição de rolagem do conteúdo anterior.

## Scope

- Renderizar objetos estruturados como pares semânticos de label e valor.
- Converter identificadores internos em labels amigáveis.
- Manter fallback seguro para texto livre.
- Preservar o texto integral usado por Copiar, TXT e histórico.
- Restaurar o topo do painel somente após a renderização de um novo resultado.
- Cobrir desktop, mobile, textos extensos e restauração pelo histórico.

## Out of Scope

- Alterar valores ou algoritmos de geração.
- Alterar APIs, prompts de IA, XML ou validações fiscais.
- Reprojetar Cadastro Geral, lotes, cenários ou relatórios XML.
- Adicionar dependências ou criar implementação exclusiva para Motorista.

## Constraints

- Evoluir o painel compartilhado existente em `Dados cadastrais`.
- Manter ações Gerar novamente, Copiar, Baixar TXT, Ver detalhes e Limpar.
- Não usar HTML não confiável para renderizar valores.
- Não alterar o scroll geral da página quando houver rolagem interna do resultado.
