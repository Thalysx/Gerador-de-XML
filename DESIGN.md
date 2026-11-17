# Design vigente do FUTURE G

Referência da interface integrada, atualizada em **17/11/2026**. A reformulação dos temas claro e escuro usa uma área de trabalho contínua, ferramentas compactas e navegação recolhível em tablet/celular. A disponibilidade das ferramentas está no [README](README.md#áreas-disponíveis).

## Identidade e linguagem

O FUTURE G é uma aplicação de geração de dados sintéticos para desenvolvimento e QA. O objetivo principal do Início é levar a pessoa a escolher uma ferramenta, gerar um resultado e copiá-lo ou baixá-lo para usar em testes. O título “Gere dados para seus testes.” e a orientação imediatamente abaixo explicitam esse percurso na primeira dobra. Ferramentas configuráveis, como XML fiscal, abrem seu espaço de preparação; geradores diretos executam a geração ao serem escolhidos. O sucesso desse fluxo é obter um resultado utilizável, com cópia ou download disponível.

O produto se chama **FUTURE G**, em caixa alta e com espaço. A assinatura do shell é **Dados sintéticos para testes**. A interface usa português brasileiro, nomes concretos de ferramentas e mensagens que deixam claro o caráter sintético dos dados. Formato ou dígitos válidos não significam cadastro oficial ou autorização fiscal.

O símbolo é o G modular existente. Usar os arquivos de [marca](assets/brand), com símbolo/nome na navegação expandida e símbolo na navegação compacta/favicon. Os logos light/dark e mono têm versões SVG/PNG em `assets/brand`; `npm run brand:export` recria os PNGs. Use a variante adequada ao fundo, sem girar, distorcer, adicionar sombras fortes ou trocar o azul por cores de alerta. TheGenerator é nomenclatura histórica; IDs e chaves `thegenerator:*` permanecem por compatibilidade, sem renomeação ou limpeza automática.

Há um catálogo único para ferramentas gerais e portuárias. Categorias, rótulos e tipos de ficha distinguem seu uso. A estrutura e os nomes das sete áreas vêm do [registry](assets/js/generator-registry.js); não criar uma segunda navegação ou separar temas por domínio.

## Cores e temas

As superfícies são neutras nos dois temas; azul indica ação, seleção, links e foco. Verde, âmbar e vermelho comunicam sucesso, aviso e erro acompanhados de texto/ícone. Preservar a hierarquia existente de superfícies e bordas, sem gradientes decorativos, glow ou caixas aninhadas em cada campo do resultado.

Valores vigentes em [base.css](assets/css/base.css). Quando o tema escuro não redefine um token, ele herda o valor claro.

| Token | Claro | Escuro |
| --- | --- | --- |
| `--background` | `#eef1f5` | `#101113` |
| `--sidebar` | `#eef1f5` | `#101113` |
| `--surface` | `#ffffff` | `#181a1e` |
| `--surface-elevated` | `#f5f7fa` | `#202328` |
| `--surface-hover` | `#e8edf3` | `#2a2e35` |
| `--border` | `#e5e9f0` | `#2c3037` |
| `--border-strong` | `#a4afbf` | `#697483` |
| `--text-primary` | `#182232` | `#f0f3f8` |
| `--text-secondary` | `#596779` | `#a9b3c1` |
| `--text-muted` | `#596779` | `#a9b3c1` |
| `--primary` | `#2563eb` | `#2563eb` |
| `--primary-hover` | `#1d4ed8` | `#1d4ed8` |
| `--primary-soft` | `#eaf1ff` | `#172554` |
| `--link` | `#1d4ed8` | `#7db6ff` |
| `--border-focus` | `#2563eb` | `#7db6ff` |
| `--success` | `#167344` | `#4ade80` |
| `--warning` | `#895b08` | `#fbbf24` |
| `--danger` | `#b42332` | `#ff8993` |

Usar os tokens semânticos em vez de copiar cores por ferramenta. Aliases antigos como `--bg`, `--text`, `--accent` e `--error` são resolvidos no `body` para acompanhar o tema. `--ai`/`--ai-soft` roxos permanecem como tokens históricos, sem superfície remota ativa; Comandos locais usa a interação azul compartilhada. Cores específicas de artefatos impressos, como crachá/código de barras, mantêm sua função existente.

## Tipografia, medidas e movimento

Inter é a fonte da interface e dos títulos; DM Mono/monospace atende identificadores, códigos e XML. O `body` usa tamanho base de `1rem`, entrelinha `1.6` e espaçamento de letras `-.01em`; componentes possuem escalas próprias. O HTML carrega Inter e DM Mono externamente e mantém fallbacks; uma captura offline não comprova a integração com as fontes online.

| Família de tokens | Valores vigentes | Uso |
| --- | --- | --- |
| `--ui-space-0` a `--ui-space-6` | 4, 8, 12, 16, 24, 32, 48 px | Ritmo de espaçamento compartilhado |
| `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg` | 6, 10, 16 px | Raios de componentes |
| `--ui-control` | 44 px | Altura-base dos controles compartilhados |
| `--motion-fast`, `--motion-base` | 160, 220 ms | Feedback e transições existentes |

Esses valores são a base, não uma afirmação de que todo alvo da interface já mede 44 px. Preservar nomes acessíveis, foco visível e leitura dos textos menores ao revisar cada componente. Não usar cor isolada para transmitir estado. Movimento reduzido deve continuar respeitado; geração síncrona não recebe espera ou spinner artificial. Upload/rede podem informar processamento real.

As áreas entram com uma transição de opacidade de 220 ms. Cada atualização do resultado individual recebe um deslocamento de 4 px e opacidade suave por 220 ms; gerar novamente cancela o efeito anterior, mantendo o novo valor disponível imediatamente. Copiar apresenta um check com entrada de 160 ms e confirmação textual por 1,5 s; cliques repetidos renovam a confirmação e restauram o rótulo original. Botões de geração respondem à pressão com 1 px, e cartões sobem 2 px no hover de mouse. Menus entram em 160 ms; opções e lote expandem/recolhem em 220 ms nos navegadores com suporte a `interpolate-size`. Navegação, foco e controles nativos permanecem operacionais durante as transições. A preferência de movimento reduzido desativa os efeitos CSS e cancela a animação de resultado em andamento.

O Início usa Inter 600, título de 26 px (24 px no celular) e texto de apoio de 15 px. Oito ferramentas formam duas linhas de quatro colunas, com intervalo de 12 px. XML fiscal mantém o mesmo tamanho das outras opções; o destaque fica na ação textual. Até 1100 px há duas colunas; até 480 px, uma lista compacta com descrição, seta de ação e favorito. A busca mantém rótulo visível e empilha até 900 px. `/` foca a busca local e `Ctrl+K` abre a busca global. A ordem visual acompanha o DOM e o teclado.

O cabeçalho mede no mínimo 72 px no desktop e 64 px em tablet/celular. O menu tem controle no cabeçalho, rótulos de 14 px e seleção neutra; a área de trabalho fica em uma folha com borda discreta e sem sombra. O claro usa moldura cinza azulada e folha branca; o escuro usa superfícies neutras em níveis de luminosidade. O tema inicial é claro, mantendo a preferência já salva. Azul sólido fica nas ações principais de geração. Até 1000 px, a navegação inicia recolhida fora da tela, com fundo para fechar ao clicar, Escape e recolhimento após escolher uma área; o conteúdo usa a largura disponível.

Setas de ação avançam 4 px no hover ou foco em 160 ms; movimento reduzido elimina a transição. Favoritos usam SVG local, com preenchimento associado a `aria-pressed`. Dados cadastrais usa uma lista lateral de 248 px no desktop e resultado na coluna maior. No celular, campos estruturados mantêm valor e botão de copiar na mesma linha; o botão mostra só o ícone e preserva seu nome acessível. O endereço apresenta seus seis campos. Fontes, marca e ícones existentes foram preservados, sem dependências novas.

## Hierarquia e superfícies

**XML fiscal preservado:** manter os formulários NF-e/CT-e, a ordem dos campos, a prévia e os fluxos existentes. Cenários salvos e NCMs manuais usam seções expansíveis; Baixar documentos reúne os dois arquivos acima da configuração, sem sobrepor os cenários. Preservar campos identifica os valores mantidos com rótulo e ícone, inclusive nos produtos, após regeneração e recarga.

`ui-primary`, `ui-secondary`, `ui-ghost` e `ui-danger` expressam ações principais, complementares, discretas e destrutivas. O resultado vazio permanece visível; ações que dependem de resultado ficam desabilitadas quando não há valor. Copiar fica próximo do resultado; em Dados cadastrais, Baixar TXT e as demais ações complementares ficam em Mais ações. A prévia pode ser limitada, mas cópia/download/histórico mantêm o conteúdo integral.

| Área | Organização vigente |
| --- | --- |
| Início | Busca, ferramentas e recentes; categorias/favoritos/resumo acessíveis em suas seções |
| Dados cadastrais | Oito acessos rápidos; busca/categoria cobrem o catálogo completo, também disponível em Ver todos; configuração junto do resultado; lote após o resultado e antes do histórico |
| Cadastro geral | Tipo de ficha/grupos para geração; resultado e edição dos campos existentes, com histórico do tipo correto |
| XML fiscal | Documento, geração e campos aplicáveis diretamente disponíveis; cenários e NCMs expansíveis, downloads agrupados e prévia com suas ações |
| Editor XML | Uma entrada compacta de arquivos, grupos/abas, revisão e exportação de cópias; foco acompanha a abertura pelo gerador |
| Validação XML | Entrada com aviso de processamento e editor amplo; teste negativo em cartão próprio; relatório único com Resumo/XML/Validação, severidades e cobertura explícitas |
| Comandos locais | Conversa central, sugestões antes do composer inferior, mensagem/anexo/enviar acessíveis; catálogo/favoritos/máscara/nova conversa em opções |

Disclosures reutilizam `details/summary`. Recolher não apaga valores nem desabilita controles necessários. As opções de lote têm controles na própria seção, sincronizados com as preferências existentes; seu tipo não faz aparecer opções irrelevantes no gerador individual. Em telas de até 1000 px, escolher um gerador recolhe o seletor e leva o foco ao título da configuração sem rolar a página. O seletor permanece acessível para trocar a escolha. O modelo único do crachá fica interno; a opção de código de barras continua disponível. A organização fiscal restaurada substitui a proposta antiga de esconder todos os campos XML em gavetas. Limpar lote preserva configuração e resultado individual.

## Estados, teclado e leitura

- Preservar rótulos explícitos, foco visível, nomes de ações somente com ícone, anúncio live de mensagens e tooltips quando necessários. Erros devem identificar o problema e a ação possível.
- `/` atende a busca existente; `Ctrl+K` abre a busca global. A paleta contém o foco, permite setas/Escape e devolve o foco ao fechar. Enter no campo, fora de composição, ativa a seleção; botões preservam sua ativação nativa por teclado.
- Gerar continua disponível por clique; `Ctrl+Enter` é opcional. Ferramentas diretas usam os motores existentes; ferramentas configuráveis mantêm suas opções. Placa e crachá preservam a geração direta já implementada.
- No composer, Enter envia e Shift+Enter cria uma linha; envio vazio é bloqueado. Sugestões e favoritos preenchem para revisão. Erros locais preservam rascunho e anexo; não existe mudança automática para modo remoto.
- O anexo pendente ocupa uma linha própria. Nomes longos podem truncar, mantendo Remover e Enviar alcançáveis e espaço útil para a mensagem.

A rolagem tem três contratos: trocar de área retorna a página ao topo; renderizar novo resultado documental reinicia o scroll interno do resultado e preserva a posição da página; a conversa acompanha atualizações quando o usuário está perto do fim e preserva a leitura manual acima dele. Não substituir esses comportamentos por um reset global a cada ação.

O composer executa **comandos locais**, sem enviar mensagens/anexos a provedores de IA ou acionar chat/status remotos. A conversa mantém até dez trocas nesta aba; anexos permanecem até remoção ou Nova conversa. Favoritos de comandos guardam somente textos, com limite unificado de vinte. A tela de Validação XML tem uma etapa separada de XSD no servidor da aplicação; seguir seu [aviso e escopo](docs/xml-validation.md).

## Responsividade e implementação

Preservar os dois temas e a sidebar expansível/recolhida. A navegação deve permanecer alcançável em janelas baixas e zoom; conteúdo empilha/quebra linha nos pontos existentes, e rolagem horizontal intencional de uma área técnica não deve cortar controles da página. A matriz atual exercita 360, 768, 1280 e 1920 px, mais estados com opções abertas; o composer também teve verificação dirigida em 320 px. São evidências específicas, não promessa de aprovação em todo dispositivo.

Há seis folhas CSS proprietárias. Alterar a regra no arquivo responsável, sem criar uma nova camada de overrides:

| Arquivo | Responsabilidade |
| --- | --- |
| [base.css](assets/css/base.css) | Tokens, tipografia, shell, controles, feedback, foco e movimento |
| [documentos.css](assets/css/documentos.css) | Descoberta/configuração documental, resultado e lote |
| [cadastro.css](assets/css/cadastro.css) | Formulário, perfil e resultado do Cadastro |
| [evolucao.css](assets/css/evolucao.css) | Home, XML fiscal, comandos e seus estados |
| [editor-xml.css](assets/css/editor-xml.css) | Importação, arquivos e ferramentas do Editor |
| [validacao-xml.css](assets/css/validacao-xml.css) | Entrada e relatório da Validação |

O runtime usa HTML e scripts clássicos, Lucide vanilla empacotado e Bootstrap para componentes existentes. Manter IDs, handlers, contratos, chaves locais, resultados e formatos de exportação. shadcn/ui depende de compatibilidade com a stack; o guia não introduz React/Tailwind nem uma segunda base de componentes. Detalhes em [arquitetura da interface](docs/ui-architecture.md).

## Referências e verificação

As specs vigentes de [shell](openspec/specs/app-shell/spec.md), [interface](openspec/specs/ui-system/spec.md), [navegação](openspec/specs/navigation/spec.md), [comandos locais](openspec/specs/ai-assistant/spec.md) e [acessibilidade/exportação](openspec/specs/export-accessibility/spec.md) preservam os contratos. Versões anteriores permanecem no histórico Git; este guia descreve os contratos atuais.

Mudanças futuras de UI devem verificar os fluxos afetados, temas, teclado e recortes relevantes. Capturas devem ter estado e origem conferidos no [manifesto da auditoria](docs/quality.md). Estado e geometria corretos não aprovam automaticamente pixels, contraste efetivo ou fontes. A escuta com leitor de tela continua pendente.

O procedimento de testes, auditoria e manutenção está no [guia de verificação](docs/quality.md). Alterações exclusivamente documentais não constituem nova aprovação visual.
