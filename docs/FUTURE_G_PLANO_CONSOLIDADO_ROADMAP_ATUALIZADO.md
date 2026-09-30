# FUTURE G --- Plano Consolidado de Evolução

## Objetivo

Documento de referência para OpenSpec/Codex, consolidando as decisões
aprovadas para a evolução do FUTURE G. A implementação deve ser
incremental, verificável e sem regressões.

## 1. Direção do produto

O FUTURE G evolui para uma plataforma modular de apoio a QA,
desenvolvimento e testes, com dois contextos principais: - Geradores
Gerais - QA Portuário

Os ambientes podem compartilhar componentes, serviços, histórico e
identidade visual, mas não devem misturar regras ou dados específicos de
domínio.

Princípios: preservar funcionalidades; evitar reescrita desnecessária;
separar UI, geração, validação e integrações; manter responsividade; não
expor segredos no frontend; validar cada fase antes da próxima; manter
compatibilidade de build/deploy; usar dados sintéticos; projetar para
extensão futura.

## 2. Fase 05 --- UI System

Criar `future-g-05-ui-system` entre as antigas fases 04 e 05.

### shadcn/ui + Lucide

Quando compatíveis com a stack: - shadcn/ui será a base técnica dos
componentes. - Lucide será a biblioteca padrão de ícones. - shadcn não
define a identidade visual final. - adaptar tokens, espaçamentos,
tipografia, bordas e estados à identidade FUTURE G. - evitar aparência
genérica de template, excesso de Cards, caixas e bordas.

Direção visual: azul escuro como base, azuis de interação, branco/cinza,
hierarquia clara, espaçamento consistente,
hover/focus/active/error/success e suporte a claro/escuro.

### Geradores

Geradores simples e determinísticos devem gerar diretamente ao clicar na
opção.

Exemplos: CPF, RG, Nome, CNPJ, Razão Social, Telefone, E-mail e UUID.

Fluxo: `Clique -> geração -> resultado`.

Manter botão `Gerar` separado apenas quando houver configuração prévia,
como tipo/tamanho de contêiner, cenários, geração parcial, opções
avançadas ou lote.

### Busca

Busca e filtros ficam no topo da configuração, antes da coleção de
geradores, e respeitam o ambiente ativo.

### Resultado persistente

O painel de resultado permanece visível desde a abertura. Antes da
primeira geração: \> Nenhum dado gerado ainda. Selecione uma opção para
começar.

Depois, atualizar o mesmo painel. Preservar ações aplicáveis: Copiar,
Gerar novamente, Limpar, Baixar/Exportar e Ver detalhes.

### Menos gavetas

Categorias principais devem usar seções, títulos, divisores e grids
visíveis. Accordion/Collapsible fica reservado a conteúdo avançado,
secundário ou opcional.

### Assistente de IA

A própria página será o chat: - Sidebar FUTURE G permanece. - Conversa
ocupa a área útil central. - Composer na região inferior. - Anexos
integrados ao composer. - Preservar auto-scroll sem impedir leitura
manual. - Evitar Card/Box externo envolvendo toda a conversa e gavetas
desnecessárias no meio da experiência.

### Lucide

Padrões sugeridos: - Search: busca - Copy: copiar - Check: copiado -
RefreshCw: gerar novamente - Download: baixar - Trash2: limpar -
SlidersHorizontal: configurações - User: pessoa - Building2: empresa -
Car: veículo - FileCode2: XML - ShieldCheck: validação - Sparkles: IA -
Paperclip: anexo

Ações somente com ícone devem ter nome acessível e Tooltip quando
necessário.

### Microinterações

-   Pressed curto no clique.
-   Resultado com fade/slide discreto (\~150--200 ms).
-   RefreshCw pode girar brevemente ao regenerar.
-   `Copiar -> Copiado`, podendo trocar Copy por Check.
-   Sem spinner artificial em geração local instantânea.
-   Loading apenas em espera real: IA, upload, rede,
    processamento/validação assíncrona.
-   Respeitar `prefers-reduced-motion`.

### Geral x QA Portuário

Componentes podem ser compartilhados, mas composição e dados devem
respeitar o ambiente.

Gerais: Pessoa Física/Jurídica, documentos, contatos, endereços,
veículos genéricos, UUID, JSON, XML, Base64 e utilitários.

Portuário: Motorista, Transportadora, Cliente, Depositante, Importador,
Exportador, Contêiner, Lacre, carga, Gate e cenários portuários.

`Cadastro Geral` deve permanecer geral e não receber automaticamente
campos portuários.


### Refinamentos de layout aprovados --- UI/UX

As melhorias abaixo complementam a Fase 05 e devem ser tratadas como uma change organizada de refinamento visual, preferencialmente `refine-future-g-interface-layout`. O objetivo é melhorar hierarquia, aproveitamento de espaço, consistência e simplicidade sem reimplementar regras de negócio.

#### Dados cadastrais --- busca global dos geradores

Na tela `Dados cadastrais`, retirar a busca do card/coluna de configuração. A busca deve ficar horizontalmente no topo da área principal, abaixo do título e da descrição da página e acima da divisão entre `Configuração / Escolha um gerador` e `Resultado`.

Estrutura desejada:

```text
Dados cadastrais
Gere documentos e identificadores, individualmente ou em lote.
------------------------------------------------------------
[ Buscar CPF, CNPJ, RG, CNH, contêiner... ] [ Categoria v ]
------------------------------------------------------------
CONFIGURAÇÃO                         RESULTADO
Escolha um gerador                   ...
```

Regras:

- A busca deve funcionar como ferramenta global para localizar os geradores da página.
- Manter o filtro por categoria na mesma região da busca.
- Remover o rótulo redundante `Encontrar um gerador`.
- Remover o botão permanente `Limpar busca`; quando houver texto, usar um `X` contextual dentro ou ao final do campo.
- O contador de resultados deve ser discreto e contextual.
- Não envolver a nova barra em outro Card grande.
- Reutilizar estados, handlers e regras de pesquisa/filtro existentes.
- Em desktop, busca e filtro ficam preferencialmente na mesma linha; em telas menores, o filtro pode quebrar para baixo e a busca ocupar 100% da largura.

#### Editor XML --- dropzone compacta

A área de upload do `Editor XML` deve ser reduzida. Evitar a aparência atual de uma dropzone central dentro de outra grande área delimitada.

Manter apenas uma dropzone principal, centralizada, funcional e proporcional ao conteúdo.

Referência para desktop:

- `width: 100%`;
- `max-width` aproximado entre `600px` e `750px`;
- altura aproximada entre `160px` e `190px`;
- padding interno moderado;
- borda tracejada discreta;
- realce em `hover`, `focus` e `drag-over`.

Estrutura desejada:

```text
              +---------------------------------+
              |               upload            |
              |                                 |
              |   Adicione seus arquivos XML    |
              | Arraste aqui ou selecione       |
              |                                 |
              +---------------------------------+
```

Preservar integralmente drag-and-drop, seleção de arquivos, múltiplos arquivos, tipos aceitos, parsing, processamento, validação e tratamento de erros. Em mobile, a dropzone pode usar toda a largura disponível respeitando o padding lateral.

#### Assistente de geração --- chat como experiência principal

A tela `Assistente de geração` deve deixar de parecer uma página de configuração com um chat inserido. O chat passa a ser o elemento principal e deve utilizar a maior parte da área útil central.

Remover da região superior do chat a barra permanente contendo `Modo`, seletor `Assistente IA`, `Aplicar máscara` e `Nova conversa`. Esses controles devem ser agrupados junto ao composer inferior, mantendo as funcionalidades atuais.

A gaveta/accordion `Privacidade e retenção` deve ser retirada do meio da conversa. Caso o conteúdo precise permanecer acessível, movê-lo para Configurações, popover, tooltip, menu informativo ou outra área secundária apropriada. O conteúdo não deve ser perdido.

O estado vazio deve ser simples e centralizado:

```text
                    [ícone]

              Como posso ajudar?

    Peça dados de teste, gere XMLs ou converse
        sobre seus campos e validações.
```

Após a primeira mensagem, essa introdução desaparece e o histórico da conversa assume a área central. A conversa deve ter scroll adequado e auto-scroll para mensagens novas sem impedir leitura manual.

#### Composer unificado do Assistente

Concentrar as principais ações em um único composer na região inferior:

```text
+--------------------------------------------------------------+
| +  Pergunte ou peça para gerar algo...                  Enviar|
|                                                              |
| Assistente IA v     Máscara ✓     Nova conversa              |
+--------------------------------------------------------------+
```

O composer deve agrupar:

- anexar/adicionar;
- textarea;
- enviar;
- modo da IA;
- aplicar máscara;
- nova conversa.

Regras de comportamento:

- textarea cresce automaticamente até um limite;
- `Enter` envia;
- `Shift + Enter` cria nova linha;
- bloquear envio vazio;
- botão de envio integrado ao composer;
- estado de loading durante resposta real da IA;
- manter foco adequado após o envio;
- preservar integração, providers, comandos locais e tratamento de erros existentes.

`Modo` não precisa de rótulo em linha separada: usar controle compacto como `Assistente IA v`. `Aplicar máscara` deve virar Toggle/Checkbox/Switch compacto. `Nova conversa` deve ser ação secundária compacta, preferencialmente com ícone Lucide e texto ou tooltip acessível.

#### Sugestões rápidas do Assistente

Manter sugestões como `5 contêineres`, `3 CPFs e 2 CNPJs`, `Dados de motorista`, `2 cadastros` e `4 bookings sem máscara`, mas posicioná-las imediatamente acima do composer. Em telas estreitas, permitir scroll horizontal em vez de quebrar excessivamente o layout.

A mensagem permanente `A disponibilidade da IA será conferida ao enviar. Comandos locais funcionam sem chave.` não deve continuar como uma barra horizontal fixa abaixo do composer. Transformá-la em informação contextual, exibida em Configurações, tooltip ou quando houver indisponibilidade/necessidade real.

#### Estrutura final aproximada do Assistente

```text
+-------------------------------------------------------------+
| GERADORES GERAIS   Assistente de geração      Configurações |
+-------------------------------------------------------------+
|                                                             |
|                     ÁREA DA CONVERSA                        |
|                                                             |
|                  Como posso ajudar?                         |
|                                                             |
|                                                             |
| [5 contêineres] [3 CPFs...] [Motorista] [2 cadastros]      |
|                                                             |
| +---------------------------------------------------------+ |
| | +  Pergunte ou peça para gerar algo...              ↑  | |
| | Assistente IA v   Máscara ✓   Nova conversa            | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
```

O composer deve permanecer próximo à parte inferior da viewport. O texto institucional do FUTURE G deve permanecer secundário no rodapé e não competir visualmente com o campo de conversa.

#### Regra transversal --- menos containers, mais hierarquia

Nas telas afetadas, evitar caixas dentro de caixas, Cards grandes com pouco conteúdo, divisores horizontais excessivos, grandes áreas vazias artificiais, controles espalhados sem relação visual e botões permanentes para ações que podem ser contextuais.

Priorizar hierarquia por espaçamento, alinhamento, tipografia, agrupamento, contraste, hover, focus e estados contextuais. Usar componentes compartilhados existentes e shadcn/ui + Lucide quando aplicável, sem introduzir uma segunda linguagem visual.

#### Critérios de aceite dos refinamentos

1. A busca de Dados cadastrais fica acima de Configuração/Resultado e não mais dentro do card esquerdo.
2. O botão permanente `Limpar busca` é substituído por limpeza contextual.
3. O Editor XML possui uma única dropzone compacta, sem container externo redundante.
4. O Assistente dedica a área central à conversa.
5. `Privacidade e retenção` não interrompe o fluxo do chat.
6. Modo, máscara e nova conversa ficam agrupados com o composer.
7. Sugestões rápidas ficam imediatamente acima do composer.
8. A barra permanente de disponibilidade da IA deixa o fluxo principal.
9. O textarea possui crescimento automático e atalhos de envio.
10. O chat faz auto-scroll para novas mensagens sem impedir leitura manual.
11. O estado vazio desaparece após o início da conversa.
12. Claro/escuro e desktop/tablet/mobile continuam funcionais.
13. Não há regressão nas regras de geração, upload, validação, máscaras ou integração com IA.

## 3. Roadmap atualizado

1.  `future-g-01-foundation`
2.  `future-g-02-generator-architecture`
3.  `future-g-03-existing-generators-migration`
4.  `future-g-04-immediate-ux-improvements`
5.  `future-g-05-ui-system`
6.  `future-g-06-general-generators`
7.  `future-g-07-xml-validation`
8.  `future-g-08-port-qa`
9.  `future-g-09-test-scenarios`
10. `future-g-10-productivity`
11. `future-g-11-polish`
12. `future-g-12-refine-interface-layout` --- refinamento consolidado de UI/UX
13. `future-g-13-fiscal-validation` --- futuro

## 4. Fase 12 --- Refine Interface Layout

A fase 12 formaliza os refinamentos de UI/UX aprovados: busca superior em Dados cadastrais, resultado estruturado com labels amigáveis e fallback textual, reset do scroll interno do Resultado a cada nova geração, dropzone compacta do Editor XML e Assistente centrado na conversa com composer unificado.

Esta fase preserva regras de negócio, geração, XML, validações, APIs, providers e formatos de exportação. A implementação deve reutilizar os componentes e handlers existentes sempre que possível.

## 4.1. Fase futura --- Fiscal Validation

A fase 13 deve permanecer no roadmap como evolução fiscal posterior ao refinamento de interface.

### Objetivo

Antes de enviar NF-e/XML para IA, executar validações determinísticas.
Futuramente, adicionar consulta/validação por serviços fiscais oficiais
aplicáveis.

Arquitetura desejada: `Validação Local -> Validação Oficial -> IA`

### Camada 1 --- Local

Verificar programaticamente, conforme o documento suportado: - XML bem
formado - estrutura/schema/XSD - campos obrigatórios - tipos e
formatos - chave de acesso - identificadores - totais e consistência
matemática - regras conhecidas - duplicidades/incompatibilidades

Problemas determinísticos devem ser identificados sem depender da IA.

### Camada 2 --- Oficial

Antes de implementar, pesquisar e documentar: - documento fiscal
suportado - serviço oficial/autorizador adequado - SEFAZ aplicável -
certificado digital - autenticação - homologação x produção - limitações
de consulta - requisitos legais/técnicos - tratamento seguro de
certificados e credenciais

Não assumir uma única API genérica da "Receita" para validar qualquer
XML.

### Camada 3 --- IA

Usar IA para: - explicar erros - traduzir mensagens técnicas - sugerir
correções - analisar inconsistências - auxiliar interpretação - comparar
estruturas - sugerir cenários de teste - gerar variações - auxiliar na
correção do XML

A UI deve distinguir claramente resultado do FUTURE G, retorno oficial e
análise da IA.

Exemplo futuro:

    VALIDAÇÃO DA NOTA

    ✓ Estrutura XML válida
    ✓ Schema válido
    ✓ Chave de acesso válida
    ⚠ Divergência encontrada no total
    ✓ Consulta oficial realizada

    Diagnóstico
    Total dos itens:  R$ 1.250,00
    Total informado: R$ 1.200,00

    [ Ver detalhes ] [ Analisar com IA ]

## 5. Plano para adicionar ao projeto

### Etapa A --- Registrar agora

-   Adicionar este documento ao repositório como referência/roadmap.
-   Manter `future-g-13-fiscal-validation` apenas como item futuro.
-   Não misturar a fase fiscal com o UI System.

### Etapa B --- Executar UI System

1.  Diagnosticar stack e componentes atuais.
2.  Verificar compatibilidade/instalação de shadcn e Lucide.
3.  Consolidar tokens e base visual.
4.  Implementar geração direta nos geradores simples.
5.  Mover busca/filtros de Dados cadastrais para a faixa horizontal superior, acima de Configuração/Resultado, com limpeza contextual.
6.  Criar resultado persistente e Empty State.
7.  Reduzir accordions desnecessários.
8.  Remodelar Assistente para página inteira, com composer unificado, controles inferiores, sugestões próximas ao campo e sem gaveta de privacidade no fluxo principal.
9.  Compactar a dropzone do Editor XML e remover o container externo redundante.
10. Implementar microinterações.
11. Corrigir isolamento Geral/Portuário.
12. Validar responsividade e acessibilidade.
13. Rodar testes, lint e build.

### Etapa C --- Continuar roadmap

Somente após validar a fase 05: 06 General Generators -\> 07 XML
Validation -\> 08 Port QA -\> 09 Test Scenarios -\> 10 Productivity -\>
11 Polish.

### Etapa D --- Especificar Fiscal Validation no futuro

1.  Definir documentos fiscais suportados.
2.  Mapear validações locais.
3.  Pesquisar serviços oficiais.
4.  Definir requisitos de certificados.
5.  Separar homologação/produção.
6.  Definir backend seguro.
7.  Criar OpenSpec específico.
8.  Implementar validação local primeiro.
9.  Implementar integração oficial separadamente.
10. Integrar explicação da IA depois.
11. Criar testes positivos/negativos.
12. Validar segurança e logs.

## 6. Estratégia Codex/OpenSpec

Para cada change: 1. Ler projeto e OpenSpec. 2. Identificar stack e
padrões existentes. 3. Fazer diagnóstico curto. 4. Planejar somente a
fase atual. 5. Implementar somente o escopo aprovado. 6. Preservar
regras existentes. 7. Reutilizar componentes quando fizer sentido. 8.
Executar testes, lint e build disponíveis. 9. Corrigir regressões
causadas pela mudança. 10. Informar arquivos alterados e pendências. 11.
Não iniciar automaticamente a fase seguinte.

## 7. Definition of Done --- UI System

A fase 05 termina quando: - interface estiver consistente; -
shadcn/Lucide estiverem integrados/adaptados quando tecnicamente
aplicáveis; - geradores simples funcionarem diretamente; - botão Gerar
existir apenas quando necessário; - busca de Dados cadastrais estiver na faixa horizontal superior; - Editor XML possuir dropzone compacta sem container redundante; - resultado
estiver sempre presente; - categorias principais não dependerem de
excesso de accordions; - Assistente ocupar a área útil da página com composer unificado e sem gavetas no fluxo da conversa; -
microinterações não atrasarem ações; - Geral e QA Portuário estiverem
isolados; - desktop/mobile e claro/escuro funcionarem; - não houver
regressões conhecidas; - testes/lint/build disponíveis tiverem sido
executados.

## Regra final

Não implementar todo o roadmap de uma vez.

Ordem:
`fundação -> arquitetura -> migração -> UX -> UI System -> expansão funcional -> XML -> Portuário -> cenários -> produtividade -> polish -> refinamento de interface -> validação fiscal avançada`



## Scroll behavior correction

A atualização do painel Resultado não deve mover a viewport para o topo. O comportamento aprovado para FUTURE 12 é preservar a posição atual do usuário ao clicar em um gerador e receber um novo resultado. Qualquer regra anterior de reset automático do Resultado para o topo fica substituída por esta regra.

O auto-scroll do Assistente IA continua sendo um comportamento separado e não deve ser removido.
