# Decisões

Enumerar os mesmos 762 endereços em uma lista imutável. Reutilizar o Set em memória de `recentesGerados` somente para o tipo IPv4, limitando-o aos últimos 500. Filtrar o domínio pelo Set e selecionar um candidato com `pick`, que já usa a fonte aleatória compartilhada. Após inserir o valor, remover somente o mais antigo quando a janela exceder 500.

Há sempre pelo menos 262 candidatos antes da escolha, inclusive depois de milhares de gerações. A seleção termina mesmo com uma fonte que devolve sempre o mesmo índice. Como os últimos 500 valores não são candidatos, qualquer lote de até 500 fica sem duplicatas; pedidos mistos ou fracionados do mesmo tipo também preservam essa propriedade. Valores podem reaparecer entre lotes após sair da janela, o que é necessário num domínio finito. Não prometer unicidade por sessão nem ampliar os hosts para .0/.255.

Manter `semRepeticaoRecente` e `gerarLoteDados` intactos evita mudar regras de outros tipos. O custo da filtragem é limitado a 762 verificações por IPv4 e a memória do histórico continua limitada a 500 valores. Não criar novos parâmetros ou estado persistido.

Testes dirigidos carregam os módulos reais no VM com os metadados mínimos e um adaptador de registro de uso; o gerador, a aleatoriedade normal e o motor de lote são reais. Apenas o teste adverso controla `rand` no contexto isolado. Um E2E pelos controles confirma lotes consecutivos e exportação completa. Nenhum teste pode exigir ausência de repetição entre todos os lotes.
