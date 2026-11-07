# Decisões

Separar a guarda de captura num pequeno módulo Node reutilizado pelo auditor. O chamador declara o estado esperado; a guarda lê DOM e viewport reais por Runtime.evaluate, recusa divergências antes de pedir a imagem e só então grava PNG e retorna metadados/hash. Não corrigir um estado incorreto silenciosamente dentro da guarda, nem deduzir a expectativa do estado observado.

Exigir um único painel visível e ativo e uma única aba selecionada, todos correspondentes ao painel esperado. Tema deriva de body.dark e catálogo de body.dataset.environment. Comparar largura/altura/sidebar quando o chamador os declarar. Registrar ainda título, escala e scroll para tornar o recorte inspecionável.

Todas as capturas salvas do auditor padrão e matriz usam a guarda. Leituras de aquecimento sem arquivo não são evidências. O manifesto começa vazio/incompleto e é atualizado a cada imagem; só termina completo quando o roteiro termina. Arquivos antigos que sobraram no diretório não fazem parte desse manifesto. Preservar referências históricas e não apagar imagens antigas automaticamente.

Home escura deve executar switchTab('home'), assegurar tema escuro e scroll no topo antes de conferir e capturar. O resultado CPF muda de future-g-home-result-dark.png para future-g-docs-result-dark.png. Manter os outros nomes existentes, com painel explícito no manifesto. Nenhuma aprovação de pixels ou alteração de layout é inferida do estado correto.

Testes da guarda controlam apenas os adaptadores de leitura/captura, verificando que erro impede captura e gravação e que sucesso associa o arquivo ao estado/hash. Auditor e matriz exercitam a leitura no DOM e a imagem de um navegador real. A matriz pode revelar falhas geométricas existentes; relatá-las sem enfraquecer seus critérios ou alterar a aplicação nesta etapa.
