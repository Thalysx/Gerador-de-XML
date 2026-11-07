# Decisões

O handler global de Enter deve executar a seleção somente quando a origem for o campo de busca. Botões conservam a ativação nativa pelo navegador e os handlers de click existentes, inclusive o índice próprio de cada opção. Composição de texto não deve ativar uma seleção.

O chip do anexo passa para uma linha própria dentro do mesmo formulário, antes da linha Adicionar/Mensagem/Enviar. IDs, callbacks e conteúdo permanecem. O nome pode truncar, mas Remover e Enviar não podem encolher. A identidade e os tokens atuais são preservados; não há nova direção visual.

Testes de navegador usam teclado, uploads e cliques reais. Medidas verificam área útil da mensagem e controles dentro do formulário; capturas são diagnósticas, sem snapshots aprovados.
