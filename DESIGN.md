# Design vigente do FUTURE G

Referência local em **07/11/2026**, consolidada na correção BASE-10. Este guia descreve a identidade e os contratos já implementados. Não introduz redesign, funcionalidades ou publicação. A disponibilidade das ferramentas está no [inventário atual](docs/current-capabilities.md).

## Identidade e linguagem

O produto se chama **FUTURE G**, em caixa alta e com espaço. A assinatura do shell é **Dados sintéticos para testes**. A interface usa português brasileiro, nomes concretos de ferramentas e mensagens que deixam claro o caráter sintético dos dados. Formato ou dígitos válidos não significam cadastro oficial ou autorização fiscal.

O símbolo é o G modular existente. Usar os arquivos de [marca](assets/brand), com símbolo/nome na navegação expandida e símbolo na navegação compacta/favicon. [IDENTIDADE.md](IDENTIDADE.md) detalha as aplicações. TheGenerator é nomenclatura histórica; IDs e chaves `thegenerator:*` permanecem por compatibilidade, sem renomeação ou limpeza automática.

Há um catálogo único para ferramentas gerais e portuárias. Categorias, rótulos e tipos de ficha distinguem seu uso. A estrutura e os nomes das sete áreas vêm do [registry](assets/js/generator-registry.js); não criar uma segunda navegação ou separar temas por domínio.

## Cores e temas

As superfícies são neutras nos dois temas; azul indica ação, seleção, links e foco. Verde, âmbar e vermelho comunicam sucesso, aviso e erro acompanhados de texto/ícone. Preservar a hierarquia existente de superfícies e bordas, sem gradientes decorativos, glow ou caixas aninhadas em cada campo do resultado.

Valores vigentes em [base.css](assets/css/base.css). Quando o tema escuro não redefine um token, ele herda o valor claro.

| Token | Claro | Escuro |
| --- | --- | --- |
| `--background` | `#f7f8fa` | `#090d14` |
| `--sidebar` | `#f0f2f5` | `#0d131d` |
| `--surface` | `#ffffff` | `#111925` |
| `--surface-elevated` | `#f0f3f7` | `#16202e` |
| `--surface-hover` | `#e8edf3` | `#1d2a3b` |
| `--border` | `#dce2ea` | `#243044` |
| `--border-strong` | `#a9b6c7` | `#465973` |
| `--text-primary` | `#172033` | `#f8fafc` |
| `--text-secondary` | `#526176` | `#a8b5c7` |
| `--text-muted` | `#526176` | `#a8b5c7` |
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
| `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg` | 8, 12, 16 px | Raios de componentes |
| `--ui-control` | 44 px | Altura-base dos controles compartilhados |
| `--motion-fast`, `--motion-base` | 160, 220 ms | Feedback e transições existentes |

Esses valores são a base, não uma afirmação de que todo alvo da interface já mede 44 px. Preservar nomes acessíveis, foco visível e leitura dos textos menores ao revisar cada componente. Não usar cor isolada para transmitir estado. Movimento reduzido deve continuar respeitado; geração síncrona não recebe espera ou spinner artificial. Upload/rede podem informar processamento real.

## Hierarquia e superfícies

`ui-primary`, `ui-secondary`, `ui-ghost` e `ui-danger` expressam ações principais, complementares, discretas e destrutivas. O resultado vazio permanece visível; ações que dependem de resultado ficam desabilitadas quando não há valor. Manter Copiar/Baixar próximos do resultado e ações complementares em Mais ações. A prévia pode ser limitada, mas cópia/download/histórico mantêm o conteúdo integral.

| Área | Organização vigente |
| --- | --- |
| Início | Busca, ferramentas e recentes; categorias/favoritos/resumo acessíveis em suas seções |
| Dados cadastrais | Busca e categoria acima da configuração/resultado; opções essenciais visíveis; lote após o resultado e antes do histórico |
| Cadastro geral | Tipo de ficha/grupos para geração; resultado e edição dos campos existentes, com histórico do tipo correto |
| XML fiscal | Documento, geração, cenários XML salvos, NCMs e campos aplicáveis diretamente disponíveis; prévia com suas ações |
| Editor XML | Uma entrada compacta de arquivos, grupos/abas, revisão e exportação de cópias; foco acompanha a abertura pelo gerador |
| Validação XML | Aviso de processamento antes da entrada; relatório único com Resumo/XML/Validação, severidades e cobertura explícitas |
| Comandos locais | Conversa central, sugestões antes do composer inferior, mensagem/anexo/enviar acessíveis; catálogo/favoritos/máscara/nova conversa em opções |

Disclosures reutilizam `details/summary` e os controles originais. Recolher não apaga valores, clona campos ou desabilita controles necessários. A organização fiscal restaurada substitui a proposta antiga de esconder todos os campos XML em gavetas. Limpar lote preserva configuração e resultado individual.

## Estados, teclado e leitura

- Preservar rótulos explícitos, foco visível, nomes de ações somente com ícone, anúncio live de mensagens e tooltips quando necessários. Erros devem identificar o problema e a ação possível.
- `/` atende a busca existente; `Ctrl+K` abre a busca global. A paleta contém o foco, permite setas/Escape e devolve o foco ao fechar. Enter no campo, fora de composição, ativa a seleção; botões preservam sua ativação nativa por teclado.
- Gerar continua disponível por clique; `Ctrl+Enter` é opcional. Ferramentas diretas usam os motores existentes; ferramentas configuráveis mantêm suas opções. Placa e crachá preservam a geração direta já implementada.
- No composer, Enter envia e Shift+Enter cria uma linha; envio vazio é bloqueado. Sugestões e favoritos preenchem para revisão. Erros locais preservam rascunho e anexo; não existe mudança automática para modo remoto.
- O anexo pendente ocupa uma linha própria. Nomes longos podem truncar, mantendo Remover e Enviar alcançáveis e espaço útil para a mensagem.

A rolagem tem três contratos: trocar de área retorna a página ao topo; renderizar novo resultado documental reinicia o scroll interno do resultado e preserva a posição da página; a conversa acompanha atualizações quando o usuário está perto do fim e preserva a leitura manual acima dele. Não substituir esses comportamentos por um reset global a cada ação.

O composer executa **comandos locais**, sem enviar mensagens/anexos a provedores de IA ou acionar chat/status remotos. A conversa mantém até dez trocas nesta aba; anexos permanecem até remoção ou Nova conversa. Favoritos de comandos guardam somente textos, com limite unificado de vinte. A tela de Validação XML tem uma etapa separada de XSD no servidor da aplicação; seguir seu [aviso e escopo](docs/quality/validation-processing-copy.md).

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

As specs vigentes de [shell](openspec/specs/app-shell/spec.md), [interface](openspec/specs/ui-system/spec.md), [navegação](openspec/specs/navigation/spec.md), [comandos locais](openspec/specs/ai-assistant/spec.md) e [acessibilidade/exportação](openspec/specs/export-accessibility/spec.md) preservam os contratos. Planos e relatos antigos mantêm cores, nomes e contagens da época; não substituem este guia.

Mudanças futuras de UI devem verificar os fluxos afetados, temas, teclado e recortes relevantes. Capturas devem ter estado e origem conferidos no [manifesto da auditoria](docs/quality/audit-capture-state.md). Estado e geometria corretos não aprovam automaticamente pixels, contraste efetivo ou fontes. A escuta com leitor de tela continua pendente; o arquivo do roteiro anterior foi removido na limpeza da documentação.

Esta consolidação não executou nova matriz visual nem aprovou snapshots. [Relatório BASE-10](docs/quality/design-documentation.md) registra os checks documentais e a preservação do código. Os resultados anteriores continuam vinculados às respectivas entregas.
