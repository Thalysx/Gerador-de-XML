# Plano de evolução visual

## Direção aprovada

Manter roxo/preto no escuro, branco/roxo no claro e navegação vertical. Melhorar organização, legibilidade e uso no celular. Implementações começam localmente e precisam de revisão visual antes da publicação.

## 1. Identidade — concluída no produto

- [x] Escolher o nome definitivo: **TheGenerator**, aprovado pelo usuário em 23/09/2026.
- [x] Fazer triagem pública preliminar de marca e domínio para os três finalistas. As grafias exatas não retornaram marcas no INPI; BaseFicta e FictaBase tiveram o menor risco aparente, enquanto DadoMatriz encontrou sinais ativos com “MATRIZ” na classe 42 e “DADO” na classe 35. Os seis domínios consultados não tinham registro RDAP encontrado em 23/09/2026.
- [x] Repetir a pesquisa para o nome escolhido antes da aplicação: não houve coincidência exata de TheGenerator no INPI; há três marcas compostas com “Generator” em vigor na classe 42; `thegenerator.com` está registrado e `thegenerator.com.br` não tinha registro RDAP encontrado. Existe ainda um software estrangeiro chamado “The Generator”. A triagem e seus limites estão em `IDENTIDADE.md`.
- [x] Criar e documentar três conceitos de logo: geométrico, minimalista e tecnológico. O painel comparativo está em `assets/brand/conceitos-logo.jpg` e os critérios em `IDENTIDADE.md`.
- [x] Escolher o conceito geométrico, decisão delegada pelo usuário e aplicada como um “G” modular.
- [x] Adaptar o símbolo ao nome final e revisar sua leitura em tamanhos de 16 a 512 px.
- [x] Produzir versões clara, escura, monocromática, favicon e símbolo independente em SVG e PNG.
- [x] Definir assinatura, tipografia e regras de uso: “Dados de teste. Do seu jeito.”, Inter e DM Mono.

## 2. Base visual e acessibilidade — em andamento

- [x] Primeira revisão local de tipografia, espaçamento, foco e controles de toque.
- [x] Menu vertical expansível com nomes no celular, Escape e transferência de foco.
- [x] Consolidar os tokens de cores, bordas, sombras e foco em `base.css`, removendo paletas concorrentes de `visual-lab.css`, `portus.css` e `usabilidade.css`. A identidade final permanece roxa/preta e branca/roxa.
- [x] Medir contraste dos pares principais nos dois temas, incluindo texto, apoio, roxo, sucesso, erro e foco. Todos superam 4,5:1 e estão protegidos por teste; transparências, bordas e herança ainda dependem de inspeção no navegador.
- [x] Conferir a navegação por teclado: o Chromium percorreu 165 paradas de foco nas seis telas; todas estavam visíveis, nomeadas e com contorno de foco. Menu, Escape e retorno do foco também foram exercitados.
- [x] Conferir a árvore de acessibilidade nativa do Chromium nas seis telas: todos os controles focáveis expostos têm função e nome; a região de resultados da validação recebeu um nome após a auditoria detectar a ausência.
- [ ] Conferir com leitor de tela real. A estrutura acessível e os nomes estão cobertos por navegador e testes, mas a leitura auditiva ainda depende dessa etapa manual.
- [x] Conferir zoom de 200%: uma janela física de 1280 × 900 com escala 2 deixou 640 × 450 px CSS; as seis telas ficaram sem rolagem horizontal e sem elementos ultrapassando o viewport.
- [x] Conferir movimento reduzido: a preferência foi emulada no Chromium e todos os componentes amostrados ficaram sem animação relevante, além da proteção estática existente.
- [x] Validar 360, 768 e 1440 px: as seis telas foram medidas no navegador real, sem largura excedente ou rolagem horizontal; capturas dos temas claro e escuro foram inspecionadas.

## 3. Navegação e descoberta

- [x] Agrupar tarefas em Gerar, Trabalhar com XML e Assistente sem quebrar navegação por teclado.
- [x] Avaliada a página inicial: manter entrada direta no gerador e oferecer Meus atalhos como seção opcional recolhida, evitando uma etapa adicional.
- [x] Dar nomes e descrições consistentes às ferramentas. O menu e os cabeçalhos usam XML fiscal, Dados cadastrais, Cadastro geral, Editor XML, Validação XML e Assistente de geração, com descrição contextual por tela.
- [x] Implementar favoritos e as três últimas ferramentas utilizadas, salvos no navegador, sem duplicações e com transferência de foco ao navegar.

## 4. Documentos — primeira tela de trabalho

- [x] Busca local de geradores por nome, sem diferença entre maiúsculas e acentos.
- [x] Contagem de opções encontradas, estado vazio e botão para limpar busca.
- [x] Organizar os 15 geradores em quatro categorias: Pessoas e documentos, Empresas, Contato e Transporte e exportação. Reduzidos os títulos repetidos e adicionado filtro combinado com a busca.
  - Estrutura e comportamento verificados nos testes; altura efetiva e apresentação responsiva ainda precisam de revisão no navegador.
- [x] Mostrar opções específicas apenas quando pertinentes ao documento ou lote atual: nome para CPF/CNPJ, máscara para formatos aplicáveis e UF/tipo para telefone.
- [x] Padronizar o resultado individual com ações para gerar novamente, copiar e baixar TXT. O arquivo preserva o valor exibido, inclusive máscara, e inclui nome ou razão social quando visível.
- [x] Aprimorar lotes, filtros e busca no histórico. A busca ignora acentos, mostra contagem e preserva restauração/cópia; o histórico de documentos filtra pelas quatro categorias. Lotes informam quando a prévia está limitada a 50, mantêm exportação dos registros completos, usam ações explícitas e podem ser limpos com retorno do foco.

## 5. Formulários e XML

- [x] Separar campos essenciais e avançados com exemplos próximos aos controles. Produtos mantêm descrição, quantidade, unidade e valor visíveis; código, NCM, quantidade tributária e CFOP ficam recolhidos. Chaves calculadas, recinto e transportador também ficam em seções avançadas com orientação, sem sair da geração.
- [x] Alternar entre NF-e e CT-e sem perder valores editados; opção de mostrar ambos e prévia sincronizada.
- [x] Preservar o resultado que acompanha a rolagem em telas largas. O navegador confirmou XML fixo a 16–18 px do topo ao descer/subir e retorno à posição original; documentos acompanham a rolagem até o limite do conteúdo, sem sobrepor o histórico. Painéis recebem foco e nomes acessíveis.
- [x] Padronizar a prévia com Copiar XML, Baixar XML, Validar XML e Abrir cópia no editor. A validação acompanha o documento selecionado e transfere o foco ao relatório.
- [x] Validação: contadores e filtro por gravidade, orientação quando não há itens e localização do problema quando disponível. Sintaxe informa linha/coluna fornecida pelo navegador; campos e produtos informam o caminho dentro do XML. O filtro preserva o relatório completo para exportação e edição.
- [x] Editor: buscas de produtos e volumes com rótulos, comparação sem acentos, contagem e estado vazio; arquivos alterados recebem texto “Alterado”; revisão mostra totais de campos alterados/adicionados/removidos e tabela acessível com situação, valor original e atual.

## 6. Chat

- [x] Renderizar listas simples, tabelas e blocos de código com escape de todo conteúdo; HTML e links ativos não são aceitos. Teste de conteúdo malicioso aprovado.
- [x] Cartões de arquivos nomeados, botões Baixar JSON/CSV/TXT, Validar XML e Abrir cópia no editor; registros recolhidos em Ver registros para reduzir a altura da conversa.
- [x] Diferenciar conexão, análise, execução de ferramenta, sucesso, erro e limite atingido. O botão e a região ao vivo mostram conexão e processamento; cada resposta lista as ferramentas realmente executadas com nomes legíveis; conclusão, falha e limite HTTP 429 têm estados próprios. Falhas permitem recuperar o pedido sem sobrescrever um rascunho. A API retorna as ferramentas somente ao concluir a resposta e não transmite progresso intermediário em tempo real.
- [x] Melhorar anexos, sugestões iniciais e início de nova conversa. Sugestões preenchem o campo para revisão antes do envio; XML pode ser colado, carregado do gerador ou selecionado como arquivo, com tamanho/estado visíveis e ação para remover; Nova conversa substitui o rótulo ambíguo de limpeza.

## 7. Acabamento e entrega

- [x] Estados vazios orientativos e mensagens de erro com recuperação: históricos levam à geração, editor abre seleção de XML, validação orienta a entrada e chat recupera pedidos com falha sem sobrescrever rascunhos.
- [x] Feedback consistente ao copiar e salvar: mensagens textuais visíveis e região ao vivo para tecnologias assistivas; botões de cópia também alteram o rótulo temporariamente. Falhas orientam copiar manualmente ou informam quando o navegador não salvou.
- [x] Animações discretas e opcionais, com entradas curtas e regra global `prefers-reduced-motion` que remove animações, transições e rolagem suave.
- [x] Testar geradores locais, IA, downloads, persistência, nomes acessíveis e temas após as mudanças. A suíte completa passou com 53 testes; build aprovado; downloads foram acionados no navegador e seu conteúdo é validado nos testes; tema escuro persistiu ao reabrir a página.
- [x] Atualizar README e histórico de atualização com o estado real da interface, IA, testes e pendências.
- [x] Publicar a revisão intermediária e validar o site público após a implantação. A `main` recebeu o commit `85bd6ab` em 23/09/2026; o Netlify serviu os novos estados do chat e o ajuste de espaçamento; `/api/status` confirmou Groq configurada e uma chamada real executou `gerar_dados`, retornando texto e artefato de registros.

Itens marcados representam implementação local. A identidade TheGenerator foi aprovada e aplicada, mas esta versão ainda precisa passar pela verificação final e publicação.

## Triagem de nomes — atualizada em 23/09/2026

Os cinco nomes iniciais apresentam conflitos públicos próximos ao projeto: Syntro é usado por várias plataformas de software e IA; NexoLab por estúdios de software; Datalume por uma plataforma de análise de dados; Prisma Dados por uma consultoria brasileira de dados e IA; e Molda por uma agência brasileira de software. Eles foram retirados da shortlist.

Uma busca pública preliminar não encontrou produto de software com correspondência direta para **BaseFicta**, **DadoMatriz** ou **FictaBase**. Na busca oficial do INPI, as grafias exatas, unidas ou separadas, também retornaram zero ocorrências. A pesquisa dos elementos centrais mostrou um único pedido antigo “FICTA”, definitivamente arquivado, e nenhuma ocorrência de “Ficta” nas classes 9, 35 ou 42. Em contraste, existem registros “MATRIZ” em vigor na classe 42 e ocorrências de “DADO” em vigor na classe 35, o que enfraquece DadoMatriz na comparação preliminar.

A consulta foi feita em 23/09/2026 na [busca pública de marcas do INPI](https://servicos.busca.inpi.gov.br/marcas), com apoio do [Guia Básico de Marcas](https://www.gov.br/inpi/pt-br/servicos/marcas/guia-basico). Ela reduz conflitos evidentes, mas não comprova disponibilidade jurídica: a análise final depende do conjunto do sinal, da especificação de produtos e serviços e de direitos anteriores. A busca deve ser repetida para o nome escolhido antes da aplicação definitiva.

### Consulta preliminar de domínios — 23/09/2026

Os serviços RDAP oficiais da Verisign (`.com`) e do Registro.br (`.com.br`) responderam HTTP 404 para os seis endereços consultados, indicando ausência de registro encontrado naquele momento:

| Nome | `.com` | `.com.br` | Avaliação de comunicação |
| --- | --- | --- | --- |
| BaseFicta | Sem registro RDAP encontrado | Sem registro RDAP encontrado | Mais claro em português: comunica uma base de dados sintéticos e é fácil de pronunciar. |
| DadoMatriz | Sem registro RDAP encontrado | Sem registro RDAP encontrado | Tem tom técnico, mas não comunica testes com a mesma rapidez. |
| FictaBase | Sem registro RDAP encontrado | Sem registro RDAP encontrado | Tem a mesma ideia de BaseFicta, porém com ordem menos natural em português. |

Uma resposta RDAP 404 não reserva o domínio e pode mudar a qualquer momento. Essa shortlist foi encerrada quando o usuário escolheu **TheGenerator**. A pesquisa específica e as limitações do nome final estão registradas em `IDENTIDADE.md`.
