# Revisão do front — 20/09/2026

Primeira etapa local da revisão de design e acessibilidade, mantendo menu vertical e temas branco/roxo e preto/roxo.

## Alterações

- Hierarquia de títulos mais clara, textos auxiliares maiores e campos com fonte de 16 px.
- Mais espaço entre painéis e grupos de campos; ações XML empilhadas no celular.
- Nomes das ferramentas preservados em tablets; no celular, menu vertical expansível com nomes visíveis e largura completa para o conteúdo.
- Botão do menu com estado acessível, fechamento por Escape e transferência de foco para a ferramenta selecionada.
- Indicador de foco opaco e destacado, controles maiores e respeito à preferência de movimento reduzido.
- Cartões descritivos redundantes ocultos em telas pequenas para priorizar a tarefa.

Arquivos: `assets/css/usabilidade.css`, `assets/js/visual-layout.js` e `index.html`.

## Limites e próximos passos

### Verificação integrada — 21/09/2026

Após as mudanças, a suíte completa passou com 52 testes e o build foi concluído. A cobertura inclui geradores e diversidade, CPF/CNPJ, XML, editor, validação, históricos, persistência, downloads, chat local, adaptador de IA, limites, armazenamento e funções Netlify. No navegador, os botões de download foram acionados e o tema escuro permaneceu salvo ao reabrir a página. A verificação pública será repetida somente após a publicação desta revisão.

### Contraste dos tokens — 21/09/2026

Foram recalculados 13 pares opacos nos temas claro e escuro: texto principal, apoio, roxo, botão, sucesso, erro e foco. O menor resultado foi 4,78:1. As razões estão em `AUDITORIA-VISUAL.md` e um teste exige no mínimo 4,5:1. Transparências, bordas e herança efetiva ainda dependem da inspeção visual.

### Consolidação da paleta — 21/09/2026

As três paletas concorrentes foram reunidas em uma única fonte de tokens em `base.css`. `visual-lab.css`, `portus.css` e `usabilidade.css` deixaram de sobrescrever fundo, superfícies, texto, bordas, roxo, foco e sombras. Os valores efetivos finais foram preservados. Um teste garante que somente `base.css` declare o token principal de fundo. A suíte completa passou com 51 testes e o build foi concluído.

### Preferências contextuais — 21/09/2026

Gerar nome junto aparece somente para CPF e CNPJ; Aplicar máscara aparece para formatos compatíveis; UF e tipo de telefone aparecem quando o resultado individual ou o lote selecionado é telefone. As preferências continuam valendo ao gerar novamente. Cinco testes direcionados passaram e o build foi concluído. Também foram corrigidos dois textos que tinham perdido acentuação em uma transformação anterior.

### Campos essenciais e avançados — 21/09/2026

NF-e e CT-e deixam identificação principal, empresas e valores comerciais visíveis. Chaves calculadas, código de recinto, transportador e dados fiscais dos itens ficam em seções expansíveis, com exemplos e explicação de uso. Campos recolhidos continuam participando normalmente da geração e dos cenários. Três testes direcionados passaram e o build foi concluído.

### Localização na validação XML — 21/09/2026

Erros de sintaxe mostram linha e coluna quando o analisador do navegador as fornece, ou declaram que a posição não foi informada. Campos obrigatórios, chave, modelo e itens mostram o caminho correspondente dentro do XML. A localização também integra o relatório JSON exportado. Três testes direcionados passaram e o build foi concluído.

### Revisão de alterações do editor — 21/09/2026

A revisão agora resume campos alterados, adicionados e removidos. Cada linha informa a situação, caminho do campo, valor original e valor atual. A tabela ganhou legenda para leitores de tela, cabeçalhos com escopo e região navegável por teclado. O arquivo continua exibindo o rótulo textual Alterado nas abas. Três testes direcionados passaram e o build foi concluído.

### Nomes das ferramentas — 21/09/2026

Os rótulos do menu foram alinhados aos títulos contextuais: XML fiscal, Dados cadastrais, Cadastro geral, Editor XML, Validação XML e Assistente de geração. Cada seleção continua atualizando o título e a descrição da página. O teste do menu agora também protege os dois rótulos que foram alterados.

### Movimento reduzido — 21/09/2026

As entradas e transições existentes usam durações curtas. A folha carregada por último contém uma regra global para `prefers-reduced-motion: reduce`, removendo animações, transições e rolagem suave de todos os componentes. Um teste estático protege essa regra; a preferência real do sistema ainda deve ser conferida no navegador.

### Estados vazios — 21/09/2026

Os históricos de documentos e cadastros explicam como criar o primeiro registro e oferecem a ação correspondente. O estado vazio do editor abre a seleção de XML. A ação do histórico de documentos move foco e rolagem para a busca dos geradores, respeitando movimento reduzido. Somados à recuperação de mensagens do chat e às orientações da validação, os principais estados vazios e falhas têm um próximo passo textual. Três testes direcionados passaram e o build foi concluído.

### Feedback textual — 21/09/2026

Foi conferido que copiar e salvar produzem mensagens textuais visíveis e anúncios em região ao vivo, além das mudanças visuais. Botões de cópia alteram temporariamente o próprio rótulo; falhas orientam a cópia manual ou informam que a preferência ficou apenas na sessão. Um teste dedicado comprova sucesso e entrada vazia sem depender de cor.

### Entrada do assistente — 21/09/2026

As sugestões agora preenchem o pedido e aguardam confirmação do usuário. O anexo XML pode ser colado, carregado do gerador ou selecionado do computador; a interface informa seu estado, limita o arquivo a 100 KB e permite removê-lo antes do envio. A ação do cabeçalho passou a se chamar Nova conversa. Quatro testes direcionados passaram e o build foi concluído.

### Revisão dos lotes — 21/09/2026

As ações agora se chamam Baixar JSON, Baixar CSV e Baixar TXT. Quando um lote passa de 50 itens, o status explica que a prévia foi limitada e que copiar ou baixar ainda inclui todos os registros. Limpar lote remove a prévia e devolve o foco ao tipo de dado. Três testes direcionados passaram e o build foi concluído.

### Ações da prévia XML — 21/09/2026

A prévia agora reúne Copiar XML, Baixar XML, Validar XML e Abrir cópia no editor. Download e validação usam NF-e ou CT-e conforme a seleção atual; a validação abre a tela correta e transfere o foco para o relatório. Quatro testes direcionados passaram e o build foi concluído.

### Filtro do histórico — 21/09/2026

O histórico de documentos agora pode ser filtrado por Pessoas e documentos, Empresas, Contato ou Transporte e exportação. Categoria e busca textual funcionam em conjunto, inclusive para registros antigos que não armazenavam a categoria. A filtragem não altera os índices usados por Restaurar e Copiar. Os testes direcionados e o build passaram.

### Download do resultado individual — 21/09/2026

O painel de resultado dos documentos ganhou a ação Baixar TXT ao lado de Gerar novamente e Copiar. O arquivo usa o valor exatamente como aparece na tela, preservando a máscara, e inclui nome ou razão social quando esse complemento estiver visível. Três testes direcionados passaram e o build foi concluído.

### Correções de interação — 21/09/2026

Corrigida uma exceção dos atalhos quando um observador pendente executava após o encerramento da página no JSDOM. Os 41 testes voltaram a passar sem as exceções antes impressas no console. No editor, a seleção de arquivo agora usa um botão nativo, separado do botão Fechar, com estado pressionado e recuperação do foco após a atualização do componente. Três testes direcionados de XML/editor/inicialização passaram após essa alteração; a operação real por teclado ainda precisa de revisão no navegador.

### Atalhos pessoais — 21/09/2026

Meus atalhos oferece favoritos e as três ferramentas mais recentes em uma seção recolhida. A entrada continua diretamente no gerador. Preferências ficam neste navegador; nomes desconhecidos são descartados na leitura e falhas ao salvar favoritos são informadas. Navegar por um atalho transfere o foco para a ferramenta. A suíte passou com 41 testes, incluindo persistência, remoção de favoritos, recentes sem duplicação e foco. Build concluído. A nova tentativa de iniciar o navegador de revisão falhou antes de abrir uma página, portanto a verificação visual continua pendente.

### Formulário dos produtos — 21/09/2026

Campos comerciais permanecem visíveis; identificação e tributação de cada item ficam em uma seção expansível com orientação. Os mesmos campos e valores continuam disponíveis para geração, cenários e edição, inclusive com a seção fechada. Após a alteração, passaram os testes direcionados de inicialização, alternância dos documentos e fluxo de produtos/cenários/bloqueio/editor. Build concluído. A inspeção visual de densidade e espaçamento permanece pendente.

### Recuperação no chat — 21/09/2026

Espera, conclusão, erro e limite atingido passam a ter rótulos textuais. Durante o envio, o botão mostra Aguardando e a conversa informa aria-busy. Recuperar mensagem devolve o pedido ao campo para revisão, sem reenviar automaticamente e sem substituir outro rascunho. O anexo deve ser conferido antes do novo envio. Uma sessão expirada (HTTP 410) deixa de ser reutilizada no próximo pedido. Três testes direcionados passaram, incluindo espera controlada e limite simulado; build concluído. Não há indicação fictícia de ferramenta em execução: as operações são mostradas quando a API devolve a resposta.

### Arquivos do assistente — 21/09/2026

Cartões identificam cada arquivo com um título acessível e mostram ações de download com verbos explícitos. XMLs oferecem validação e abertura de cópia no editor. Listas de dados ficam em uma seção expansível, mantendo as ações de exportação visíveis. A suíte completa passou com 39 testes, incluindo nomes de arquivos maliciosos, conteúdo recolhido e preservação dos botões. Build concluído; revisão visual permanece pendente.

### Relatórios XML — 21/09/2026

Cada arquivo analisado agora mostra contadores de erros, avisos e verificações sem erro. O filtro por gravidade reduz a lista exibida sem alterar os dados exportados ou a cópia aberta no editor. Uma mensagem orienta a voltar a Todas quando a categoria estiver vazia. Limpar a análise restaura o filtro inicial. Passaram os três testes direcionados de inicialização, filtro e validação XML; o build também foi concluído.

### Organização dos geradores — 21/09/2026

Os 15 geradores foram agrupados em quatro categorias, substituindo dez títulos fragmentados. A seleção de categoria funciona junto da busca por nome; limpar a busca também restaura todas as categorias. Cada grupo tem um título associado para tecnologias assistivas. A ordem dos rótulos dos filtros foi ajustada para acompanhar os respectivos controles.

Validação local: 37 testes aprovados e build concluído. Os testes conferem a presença das 15 opções, os quatro grupos, seus rótulos acessíveis e a combinação de busca e categoria. Isso não substitui a inspeção visual das dimensões e espaçamentos.

O navegador integrado não pôde ser inicializado, mas a revisão foi retomada com Chromium local. As seis telas passaram em 360, 768 e 1440 px sem rolagem horizontal, com capturas nos dois temas. O painel fixo e o menu móvel foram verificados durante rolagem e teclado. Leitor de tela real, zoom real de 200% e validação pública após a publicação continuam pendentes.

Próxima etapa: revisar a densidade dos formulários XML, a apresentação das respostas do chat e a clareza dos estados vazios/erros com base no uso real. Esta revisão ainda não foi enviada ao GitHub nem publicada.
