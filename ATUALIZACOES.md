# FUTURE G 3.0.0-alpha.3 — 30/09/2026

- A fase 13A incorporou validação XSD first-party para NF-e 4.00 e CT-e 4.00 com schemas oficiais versionados, hashes de integridade, cobertura explícita e fallback para o relatório local.
- A aplicação da empresa cadastrada à NF-e agora oferece “Todas as opções”, preenchendo Emitente, Destinatário e Transportadora em uma única ação.
- O refinamento de interface foi formalizado no roadmap/OpenSpec como FUTURE 12; a trilha de validação fiscal foi renumerada para FUTURE 13A/13B/13C.

- O painel Resultado passou a apresentar objetos estruturados em grid semântico, com labels amigáveis e fallback seguro para texto livre.
- A interface mantém o texto completo separado da projeção visual para Copiar, Baixar TXT, detalhes e restauração do histórico.
- Resultados extensos possuem rolagem interna; cada nova geração retorna ao topo após renderizar sem deslocar a página.
- A suíte passou a 107 testes; build, auditoria real do resultado e matriz de 128 combinações foram aprovados.

# FUTURE G 3.0.0-alpha.2 — 30/09/2026

- Corrigidos os ativos de marca e PWA no servidor local, mantendo a lista pública restrita.
- NF-e e CT-e passaram a existir no estado, prévia e downloads somente em seus ambientes correspondentes.
- O resumo de CT-e usa o destinatário real; testes distinguem explicitamente `dest` de `rem`.
- Trocas de tela retornam ao topo e a sidebar possui rolagem vertical em zoom ou viewport baixa.
- Movimento, transições, tooltips, link de salto e quebra de identificadores receberam correções de robustez.
- A auditoria passou a verificar foco dentro da viewport e alcance vertical da navegação.
- A suíte passou a 105 testes; build, auditoria de 200% e matriz de 128 combinações foram aprovados.
- O roadmap consolidado foi incorporado e a fase 13A foi aberta apenas para especificar validação fiscal local determinística.

# FUTURE G 3.0.0-alpha.1 — 25/09/2026

- A fonte ativa foi consolidada em um único repositório; cópias antigas passaram a ser preservadas por tags e pacotes versionados para Releases.
- O OpenSpec foi movido para a raiz versionada do projeto.
- Produto, pacote, manifesto, documentação e arquivos de marca passaram a usar a nomenclatura FUTURE G / `future-g`.
- O shell recebeu a fundação azul-marinho/azul e o seletor persistente Geradores Gerais / QA Portuário.
- Chaves locais `thegenerator:*` foram mantidas para compatibilidade com preferências existentes.
- A versão foi validada com testes, build e auditoria responsiva antes da publicação.
- A fase de Geradores Gerais começou com RG paulista e CNH validados por dígito, seguida de Nome fantasia, Endereço completo, CEP sintético e RENAVAM no registry, na geração individual e no lote.
- Utilitários de desenvolvimento adicionaram UUID v4, IPv4/IPv6 reservados para documentação e MAC unicast administrado localmente, sem gerar credenciais ou endereços públicos arbitrários.
- Finanças sintéticas adicionaram valor em BRL, chave Pix EVP não registrada e ID de transação com marcador `TESTE`, sem cartões, contas, boletos ou pagamentos reais.
- Cadastro Geral passou a gerar uma ficha com seleção independente de Identificação, Documentos, Contato, Endereço e Dados profissionais, mantendo compatibilidade com históricos anteriores.
- O novo gerador de crachá cria cartões funcionais sintéticos com avatar, código, empresa, função, matrícula, validade, status e código de barras ilustrativo opcional, inclusive em lote e exportação estruturada.
- O OpenSpec 6 foi concluído com uma matriz final dos 14 novos geradores em busca, favoritos, recentes, ambientes, lote e exportações JSON/CSV/TXT.
- O OpenSpec 7 evoluiu o mesmo validador XML para achados estruturados com Erro, Aviso e Informação, incluindo tag, valor, caminho e posição de sintaxe quando disponíveis.
- Relatórios de NF-e/CT-e agora possuem visões Resumo, XML e Validação, navegação acessível por abas e exportação JSON sem o conteúdo-fonte.
- A Validação XML cria sete variantes negativas explicitamente identificadas para QA: CPF, CNPJ ou chave inválida; campo ausente; formato ou tag inválida; e XML malformado. O documento-base permanece intacto.
- Geradores Gerais agora mostra exclusivamente dados gerais e NF-e, com a paleta roxa anterior; QA Portuário mostra exclusivamente dados portuários e CT-e, mantendo a paleta azul. Home, busca, lote, XML, validação, anexos e sugestões do Assistente acompanham a troca.
- O Cadastro completo em lote deixou de incluir contêiner e lacre no objeto gerado.
- O QA Portuário passou a reunir perfis de Motorista, Operador, Visitante e Pessoa; cinco entidades empresariais; cavalo, carreta e conjunto; contêineres ISO 6346; quatro modalidades de carga; NCM manual; CT-e, chave CT-e, Booking, DI, DUIMP, DU-E, lacre e documento de carga.
- Os novos geradores usam o mesmo registry, busca, favoritos, recentes, histórico, lote, exportação e Assistente, respeitando a separação completa entre NF-e no Geral e CT-e no Portuário.
- A biblioteca do QA Portuário recebeu dez cenários de teste, com IDs estáveis e relações coerentes entre processo, agendamento, motorista, transportadora, veículo, contêiner, carga e etapas operacionais.
- Os cenários oferecem modos Válido, Inválido intencional e Aleatório, histórico local, restauração, cópia e download JSON sem misturar o ambiente Geradores Gerais.
- `Ctrl+K` agora abre busca global por ferramentas e áreas do ambiente ativo, com setas, Enter, Escape, retorno e contenção de foco.
- Cada ambiente recebeu indicadores e atividade recente próprios. O resumo persiste somente identificador, ambiente, ação, quantidade e horário, descartando resultados e campos extras.
- Exportações de lote JSON, CSV e TXT passaram a usar nomes contextuais e continuam incluindo todos os registros, mesmo quando a prévia mostra apenas 50.
- A revisão foi fechada com 102 testes, build aprovado e auditoria das oito telas em 200%, com 244 passos de teclado e nenhum overflow, controle sem nome ou foco inválido.
- O polimento final corrigiu a quebra do botão de teste negativo em 360 px e repetiu uma matriz de 128 combinações de painel, tema, largura e sidebar sem overflow ou elementos excedentes.
- O runtime local do Lucide passou a conter somente os 49 ícones utilizados, caindo de 433.756 para 11.467 bytes (redução de 97,4%) sem alterar a API consumida pela interface.
- O upload da Validação XML agora expõe `aria-busy`, status ao vivo e bloqueio temporário durante a leitura local. O auditor também reprova erros, avisos ou exceções de console, falhas na busca global e estouros de orçamento de recursos.
- O roadmap FUTURE G foi encerrado localmente com 104 testes, build aprovado, console limpo e auditorias normal e responsiva aprovadas. Não houve deploy nesta etapa.

# Nova experiência inicial compacta — 24/09/2026

- A aplicação agora abre em uma tela **Início** com busca, filtros e oito geradores principais. O catálogo completo aparece ao buscar ou escolher uma categoria.
- O cabeçalho ficou compacto e reúne marca, ambiente, contexto da ferramenta, tema e configurações.
- A sidebar pode ser recolhida no desktop; a preferência é mantida no navegador. Em telas menores, continua usando o menu responsivo com nomes completos.
- Cards da página inicial executam os geradores reais de CPF, nome, CNPJ, empresa, placa, telefone, NF-e e cadastro completo. Os demais tipos ficam disponíveis pela busca e pelos filtros.
- Favoritos e recentes passaram para a página inicial. O armazenamento local guarda somente identificadores dos tipos, nunca os valores gerados.
- O resultado ganhou painel próprio com gerar, copiar, regenerar, expandir, limpar e abrir a ferramenta completa.
- Foram adicionados feedback temporário de cópia, skeleton durante a geração, toasts, estados vazios, tags de configuração, tooltips e transições discretas.
- Os atalhos `/` para busca e `Ctrl + Enter` para geração funcionam na página inicial.
- A geração em lote informa antecipadamente quantos registros serão criados.
- A experiência usa os mesmos temas roxo/preto e branco/roxo e preserva todos os fluxos especializados existentes.
- Nenhum recurso do FUTURE G foi implementado nesta etapa.

A suíte completa passou com **58 testes aprovados**. A auditoria em Chromium aprovou as sete telas em escala de 200%, com 190 paradas de teclado, sem rolagem horizontal, controles sem nome, foco invisível ou foco sem contorno. Esta revisão permanece somente local, sem deploy e sem envio ao GitHub.

# Interface mais intuitiva e minimalista — 24/09/2026

- A gaveta de atalhos, favoritos e recentes foi removida do cabeçalho para deixar somente a navegação principal e o tema.
- A seleção de arquivos da Validação XML agora usa uma área clicável igual à do Editor, sem exibir o botão nativo do navegador.
- A área inicial do Editor XML ficou menor e perdeu a gaveta explicativa.
- Cenários salvos e todos os campos da NF-e ficam visíveis diretamente; textos explicativos e gavetas desses formulários foram retirados.
- Botões, campos, cards, tabelas e mensagens agora usam uma hierarquia visual única em todas as telas.
- Somente a ação principal de cada tarefa recebe preenchimento roxo; ações secundárias e destrutivas ficaram mais discretas.
- Bordas, sombras e superfícies internas foram reduzidas para melhorar leitura e espaço visual.
- Os cartões introdutórios repetidos do XML fiscal foram removidos; a ação principal agora é “Gerar novos dados”.
- Documento e cenários salvos foram reunidos em uma grade compacta antes do formulário.
- Os 15 geradores foram organizados em categorias recolhíveis, com apenas Pessoas e documentos aberta inicialmente.
- Geração em lote e histórico ficam recolhidos até serem solicitados.
- Dados cadastrais usa uma coluna central quando ainda não há resultado e abre a segunda coluna somente após a geração.
- Cadastro geral passou para uma coluna ampla e moveu o histórico recolhido para baixo do formulário.
- Editor, Validação e Assistente tiveram controles secundários agrupados ou recolhidos para destacar a tarefa principal.
- O escopo ficou restrito ao produto atual; nenhuma funcionalidade do FUTURE G foi adicionada.

A suíte completa passou com **54 testes aprovados**. A auditoria em Chromium aprovou as seis telas sem rolagem horizontal, controles sem nome, foco invisível ou foco sem contorno em 155 paradas de teclado. Esta revisão permanece somente local.

# Revisão visual e de acessibilidade — 21/09/2026

A interface foi reorganizada sem trocar a identidade roxa aprovada. O tema escuro usa preto e tons de roxo; o claro usa branco e roxo. A navegação vertical continua sendo a base do produto e passa a agrupar as ferramentas por tarefa, com menu responsivo, favoritos e últimas ferramentas usadas.

## Principais mudanças

- **Identidade:** o produto passou a se chamar **TheGenerator**, com símbolo “G” geométrico, assinatura “Dados de teste. Do seu jeito.”, versões para fundos claro e escuro, monocromáticas, favicon e manifesto da aplicação.
- **Dados cadastrais:** busca sem diferença de acentos, quatro categorias, opções contextuais, ações padronizadas, lotes de até 500 registros e histórico filtrável.
- **XML fiscal:** seleção entre NF-e, CT-e ou ambos sem perder campos; detalhes avançados recolhidos; prévia fixa durante a rolagem; copiar, baixar, validar e abrir no editor.
- **Validação XML:** contadores e filtros por gravidade, localização por linha/coluna ou caminho do campo, relatório completo para exportação e encaminhamento ao editor.
- **Editor XML:** busca em produtos e volumes, indicação de arquivo alterado e revisão acessível dos campos modificados, adicionados e removidos.
- **Assistente:** listas, tabelas e código renderizados com escape; cartões de arquivos; anexos XML; sugestões revisáveis; estados de conexão, análise, ferramentas executadas, sucesso, falha e limite; início explícito de nova conversa.
- **Acessibilidade:** foco visível, áreas de toque maiores, retorno do foco no menu, mensagens em região ao vivo, contraste principal acima de 4,5:1 e suporte a `prefers-reduced-motion`.
- **Responsividade:** as seis telas foram verificadas em 360, 768 e 1440 px sem rolagem horizontal. O painel de resultado acompanha a página em telas largas e volta ao fluxo normal em telas menores.

## Verificação

A suíte completa passou com **53 testes** e o build de produção foi aprovado. A revisão em Chromium confirmou alternância dos seis painéis, persistência do tema, menu por teclado, rolagem dos resultados e ausência de erros no console. Uma auditoria adicional em 200% percorreu 165 paradas de foco nas seis telas, sem foco invisível, sem nome, sem contorno ou rolagem horizontal. A árvore de acessibilidade do Chromium também expôs todos os controles focáveis com função e nome após a correção da região de resultados da validação XML. As evidências e limites estão em [AUDITORIA-VISUAL.md](AUDITORIA-VISUAL.md).

## Itens ainda em decisão

A identidade TheGenerator foi aprovada depois de uma nova triagem pública. Não houve coincidência exata no INPI, mas existem marcas compostas com “Generator” na classe 42, o domínio `.com` já está registrado e há um software estrangeiro com o mesmo nome separado; esses limites estão documentados em `IDENTIDADE.md`. A versão final foi publicada no GitHub e na Netlify em 23/09/2026 no commit `e6856b9`; HTML, símbolo e manifesto públicos coincidiram por SHA-256 com o build local. Permanece pendente apenas a validação auditiva manual com leitor de tela real.

# Preparação da IA pública — 19/09/2026

Adicionados adaptadores Groq/OpenAI, rotas Vercel, sessões Redis, cookies assinados e cotas por visitante, IP e aplicação. O chat informa o provedor, exclui a sessão no servidor ao limpar e aplica tempo limite também à consulta inicial. O build separa arquivos públicos do backend.

A ativação real foi concluída na Netlify e o fluxo principal com Groq foi verificado em produção. Consulte [ATIVACAO-IA.md](ATIVACAO-IA.md), [PLANO-IA-PUBLICA.md](PLANO-IA-PUBLICA.md) e [VERIFICACAO-PRODUCAO.md](VERIFICACAO-PRODUCAO.md). A concorrência isolada e a expiração real dos scripts Redis continuam pendentes e não são cobertas pela suíte simulada.

# Atualização — geradores, chat e fluxo XML

Data: 18/09/2026 · Versão do projeto: 2.0.0

## O que mudou

### Novo layout com navegação lateral

A proposta aprovada da `visual-lab` agora é a interface principal. A navegação permanece vertical, com rótulos no desktop e ícones com nomes acessíveis em telas menores. As setas para cima e para baixo também navegam entre as ferramentas.

A estrutura se inspira no Portus, mantendo a identidade do gerador: branco e roxo no tema claro, preto e tons de roxo no escuro. O tema escuro é o padrão para novos acessos, respeitando preferências já salvas. O cabeçalho acompanha a ferramenta ativa e os resultados continuam acompanhando a rolagem nas telas com duas colunas.

Estilos em `assets/css/visual-lab.css` e `assets/css/portus.css`; comportamento do cabeçalho em `assets/js/visual-layout.js`. A entrada publicada continua sendo `index.html`.

### Ajuste de rolagem dos resultados

Nas telas com duas colunas, os resultados de documentos, cadastro e a prévia XML acompanham a rolagem para cima e para baixo, respeitando os limites da seção. Painéis maiores que a janela têm rolagem interna para manter todos os resultados acessíveis. Em telas estreitas, os blocos permanecem no fluxo normal para não cobrir o formulário.

A identidade visual original foi mantida. As imagens fornecidas serviram como referência para a organização dos painéis, a prévia de XML e o chat, sem adotar o nome ou a marca do outro projeto.

### Geração com mais possibilidades

- Nomes combinam o catálogo anterior com novos primeiros nomes e sobrenomes, usando de um a três sobrenomes distintos.
- Empresas combinam marcas fictícias, sobrenomes, setores, regiões e siglas de três ou quatro letras em seis estruturas de composição.
- CPF e CNPJ numérico continuam gerando bases aleatórias com dígitos verificadores, rejeitando bases de dígitos todos iguais.
- CNPJ alfanumérico permite letras e números nas **12 primeiras posições**, inclusive na identificação do estabelecimento; os dois últimos caracteres são dígitos verificadores.
- Placas Mercosul continuam usando todas as letras e dígitos admitidos pelo padrão de geração existente. Placa antiga ganhou botão próprio; “Gerar novamente” preserva o tipo escolhido.
- Telefones podem ser celulares ou fixos, com filtro de UF na geração individual e em lote. O XML agora gera telefone com DDD da UF do endereço.
- E-mails ganham diferentes composições e usam `example.com`, `example.org` e `example.net` para dados de teste.
- A fonte aleatória usa `crypto.getRandomValues`, com rejeição para evitar viés de módulo. Há fallback para `Math.random` em ambientes sem essa API.
- Nomes, empresas, CPF, CNPJ, placas Mercosul, telefones, e-mails, booking e DU-E mantêm uma janela de até **2.000 valores recentes por tipo**, durante a sessão. O controle não persiste após recarregar a página.
- Em cada lote, os registros são comparados e regenerados em caso de repetição. Para cadastros compostos, a comparação do lote considera o registro completo; campos compartilhados também se beneficiam da janela de seus geradores.

A ampliação não altera arbitrariamente os formatos para criar mais números: CPF e placas, por exemplo, já usavam suas bases completas. As melhorias nesses casos estão na fonte aleatória, no reaproveitamento das regras e no controle de repetição.

### Novos botões e documentos

- Nome de pessoa e razão social, gerados individualmente.
- RG para testes no padrão de São Paulo e CNH com regras explícitas de dígitos verificadores, disponíveis também em lote e na conferência automática.
- Nome fantasia, endereço completo, CEP sintético e RENAVAM foram adicionados ao catálogo de Geradores Gerais e às exportações em lote.
- Booking: referência fictícia `BK` + data local `AAAAMMDD` + oito dígitos, sem representar padrão universal de armadoras.
- DU-E: ano + `BR` + nove dígitos de sequência aleatória + verificador módulo 11. A máscara acrescenta hífen antes do dígito. A numeração não é registrada no Siscomex.
- Conferência automática de CPF, CNPJ, placa, contêiner e IMO ao digitar. Para placa, verifica o formato; para os demais tipos suportados, verifica os dígitos correspondentes. Não consulta existência ou titularidade.

### Geração em lote

A área **Dados cadastrais → Gerar em lote** permite escolher tipo e quantidade entre 1 e 500.

Inclui documentos individuais, nomes, empresas, motoristas e cadastros completos. Os filtros de máscara e telefone são aplicados ao lote. A tela mostra até 50 registros; copiar e exportar incluem todos eles.

Formatos de saída:

- **TXT:** texto legível, separado por registro.
- **JSON:** registros com tipo, rótulo e valor; cadastros preservam seus campos estruturados.
- **CSV:** separador ponto e vírgula, cabeçalho, UTF-8 com BOM e campos entre aspas. Cadastros são separados em colunas; valores que poderiam ser interpretados como fórmulas recebem proteção.

### Chat de geração em português

Nova aba **Chat de geração**, com sugestões, máscara, cópia, exportação e limpeza da conversa.

Exemplos aceitos:

```text
3 CPFs e 2 CNPJs
5 contêineres com lacre
dados para um motorista
2 cadastros completos
4 bookings sem máscara
três nomes e duas empresas
5 telefones fixos UF SP
10 CNPJs alfanuméricos
3 placas antigas
```

O interpretador normaliza acentos e reconhece quantidades em algarismos e de um a dez por extenso. Ele rejeita pedidos incompletamente reconhecidos, quantidades fracionárias, negativas, zero e totais acima de 500.

Esses comandos continuam disponíveis no modo **Comandos locais (sem IA)**, sem API ou chave, com as últimas dez interações em memória. O modo padrão agora é **Assistente IA**, descrito abaixo.

### Assistente IA e ferramentas

- Integração real com OpenAI Responses API no servidor; chave em `.env`, nunca no navegador. Modelo configurável, padrão `gpt-5-mini`.
- Conversa com contexto: a IA escolhe quando gerar dados, criar NF-e/CT-e ou ler e validar XMLs da conversa.
- As ferramentas executam as mesmas funções do projeto. Documentos e dígitos não dependem de números inventados pelo modelo.
- Artefatos com exportação TXT/CSV/JSON e XML, validação e abertura de cópia no editor.
- Anexo explícito de XML colado ou carregado do gerador, até 100 KB. Nada é anexado automaticamente.
- Modo local preservado; ausência de chave, falhas e tempo limite são informados sem simular uma resposta de IA.
- Sessões em memória, até 20 pedidos, expiração após 30 minutos inativas; limite de chamadas e operações por pedido. Servidor restrito ao computador local.
- A criação de XML por ferramenta aceita NF-e/CT-e e quantidade de produtos. Personalizações de campos são feitas no editor; não há emissão fiscal ou edição autônoma de arquivos do computador.

Configuração e tratamento das conversas estão no [README.md](README.md). A integração foi testada com provedor simulado; não foi executada chamada real porque não há chave configurada.

### Nova tela de validação XML

- Importação por seleção/arraste, conteúdo colado ou documento atual do gerador; até 10 arquivos UTF-8, 5 MB cada.
- Sintaxe, namespaces (incluindo prefixos), estrutura básica NF-e/CT-e, campos essenciais, chave e protocolo, CNPJs, itens e totais.
- Relatórios por arquivo com erros, avisos e cobertura; exportação JSON sem incluir o conteúdo original do XML.
- Abertura de cópia no editor, preservando o relatório analisado.
- XMLs desconhecidos recebem apenas análise sintática. DTD e entidades declaradas são rejeitados.
- Análise local, sem XSD, assinatura digital, regras fiscais completas ou consulta SEFAZ.

### XML fiscal e editor

- Painel com prévia de NF-e/CT-e, seleção do documento e botão de cópia.
- **Editar este XML:** abre uma cópia no editor sem baixar/importar. A edição não altera o XML do gerador. CT-e abre na estrutura completa; as abas especializadas continuam voltadas à NF-e.
- Geração passa a variar os CNPJs e nomes das empresas da NF-e e do CT-e; o bloqueio continua preservando os campos protegidos.
- Adição e remoção de produtos no gerador, entre 1 e 50 itens, com renumeração e preservação dos demais campos.
- Ajustes de consistência: `cDV` atualizado nos documentos, UF da chave da NF-e alinhada ao município do emitente, preço unitário recalculado a partir de total/quantidade e peso mantido em quilogramas quando a unidade comercial muda para tonelada.
- URLs temporárias dos downloads são liberadas ao regenerar os arquivos.
- Verificações básicas de estrutura, formato/dígito da chave, correspondência com identificação/emitente, CNPJs, presença de produtos, valores, quantidades e soma dos produtos.
- **Revisar alterações:** compara campos e atributos com o XML inicialmente aberto, exibindo original e atual, inclusive elementos adicionados/removidos. Elementos repetidos são comparados pela posição, não por identidade semântica.

### Cadastro e cenários

No cadastro geral, **Usar a empresa na NF-e** aplica razão social e CNPJ ao emitente, destinatário ou transportadora. Não transfere automaticamente endereço ou dados pessoais. O modelo fiscal atual exige CNPJ numérico para essa integração.

**Cenários salvos** guardam nome, campos do formulário, quantidade de produtos e os dados dinâmicos da NF-e. É possível salvar até 20, carregar e excluir. São armazenados no navegador; não há sincronização entre computadores. Se o armazenamento for bloqueado, a interface informa que o cenário permanece apenas na sessão.

## Limites e decisões desta entrega

- Os dados são sintéticos; nomes, documentos ou telefones podem coincidir com dados existentes. Não há consulta a bases de pessoas/empresas.
- CEPs e endereços são sintéticos, sem garantia de correspondência postal. IEs não têm validação estadual. RG usa o padrão declarado de São Paulo; RG, CNH e RENAVAM têm conferência matemática local, sem consulta de existência, titularidade ou situação em bases oficiais.
- A chave numérica do modelo XML não foi migrada para CNPJ alfanumérico. Esse CNPJ funciona nos geradores, cadastro, chat e lotes.
- A prévia e os avisos **não equivalem a validação fiscal completa**. Não há validação XSD, assinatura digital válida, autorização SEFAZ ou atualização integral de regras tributárias. Datas, protocolos e partes dos modelos fiscais existentes permanecem como exemplos.
- Lotes de documentos/cadastros estão implementados. Geração de múltiplos XMLs em lote e download ZIP ficam para uma próxima etapa, junto da revisão dos modelos fiscais; os downloads individuais continuam disponíveis.
- Os cenários e históricos pertencem ao navegador e à origem usada. Abrir pelo arquivo e abrir pelo servidor local podem utilizar armazenamentos diferentes.
- Bootstrap, ícones e fontes ainda vêm de CDNs. Os geradores e a validação local não usam serviço externo; o modo IA usa a API OpenAI.

## Organização do código

Novos arquivos principais:

| Arquivo | Responsabilidade |
| --- | --- |
| `assets/js/aleatorio.js` | Aleatoriedade e valores recentes |
| `assets/js/catalogos.js` | Vocabulários e DDDs por UF |
| `assets/js/geracao-dados.js` | Geração sem DOM, exportações e novos documentos |
| `assets/js/chat.js` | Interpretador de pedidos e interfaces de chat/lote |
| `assets/js/xml-workflow.js` | Prévia, cenários, integração e comparação |
| `assets/css/evolucao.css` | Estilos dos novos painéis e responsividade |
| `tests/projeto.test.cjs` | Testes automatizados |
| `scripts/serve.cjs` | Servidor local opcional |

Os arquivos anteriores foram ajustados para consumir as regras compartilhadas. Não foi introduzido framework nem etapa de compilação no uso da aplicação.

## Verificação

Execute `npm install` e `npm test` com Node.js 20.19 ou superior. `jsdom` permite testar o DOM e reutilizar o motor do projeto no servidor sem exigir navegador instalado.

A suíte atual tem 53 testes, incluindo ferramentas da IA com provedor simulado, contexto da conversa, tratamento de chave ausente/erros, restrições do servidor, anexos explícitos, escape de respostas, nomes acessíveis dos controles e validação XML com prefixos, arquivos malformados e divergências de protocolo.

Os testes cobrem inicialização, IDs únicos, amostras de 500 CPFs e CNPJs de cada formato, diversidade, telefones filtrados, DU-E, comandos válidos/inválidos, cenários, bloqueio, integração cadastro/XML, edição isolada, persistência, conversão de peso, verificadores das chaves, exportação integral e escape de conteúdo.

Também foram conferidos no Chrome: aparência do XML, chat com pedido misto, chat em largura de 390 px, lote de telefones fixos de SP, abertura de XML no editor e comparação de um campo alterado. Não foi observada falha de execução nesses fluxos.

## Referências técnicas consultadas

- [OpenAI — function calling](https://developers.openai.com/api/docs/guides/function-calling).
- [OpenAI — GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini).

- [Receita Federal — cálculo do dígito verificador do CNPJ alfanumérico](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf).
- [Receita Federal — perguntas e respostas sobre CNPJ alfanumérico](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf).
- [Siscomex — perguntas frequentes de exportação, item 3.25](https://www.gov.br/siscomex/pt-br/informacoes/perguntas-frequentes/perguntas-frequentes-exportacao): estrutura e cálculo do dígito da DU-E.
