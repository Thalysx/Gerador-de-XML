# FUTURE G UI System — Design

## Base
Quando compatível com a stack existente, shadcn/ui SHALL ser a base técnica dos componentes e Lucide SHALL ser o conjunto padrão de ícones. shadcn é base técnica, não identidade visual. Componentes MUST seguir os tokens e a linguagem FUTURE G.

## Geração direta
Geradores determinísticos sem configuração prévia MUST executar ao clicar na própria opção. Exemplos: CPF, RG, Nome, CNPJ, Razão Social, Telefone, E-mail e UUID.

Não exigir `Selecionar -> Gerar` quando não houver parâmetros adicionais.

Um botão separado `Gerar` MAY existir quando houver configuração prévia, como tipo/tamanho de contêiner, cenários, geração parcial, opções avançadas ou lote.

## Busca
Busca e filtros SHALL ficar no topo da área de configuração, antes das opções. A busca MUST respeitar o ambiente ativo.

## Resultado persistente
O painel de resultado SHALL existir desde a abertura da página. Antes da primeira geração, apresentar Empty State. Depois, atualizar o mesmo painel sem mudança brusca de layout.

## Menos gavetas
Conteúdo principal SHOULD usar seções, títulos, divisores e grids visíveis. Accordion/Collapsible SHOULD ficar restrito a configurações avançadas, conteúdo secundário ou opcional.

## Assistente de IA
O Assistente SHALL ocupar a área útil da página dentro do shell FUTURE G. A Sidebar permanece. Mensagens ocupam o centro e o composer fica na região inferior. Não criar Card/Box externo envolvendo todo o chat. Anexos devem integrar o composer.

## Microinterações
Animações MUST ser discretas e funcionais. Não mostrar spinner artificial em operações instantâneas. Resultado pode usar fade/slide curto (~150–200 ms). `Gerar novamente` pode usar rotação curta do RefreshCw. `Copiar` deve fornecer feedback `Copiar -> Copiado`, podendo trocar Copy por Check. Loading real fica para IA, upload, rede e processamento assíncrono. Respeitar reduced motion.

## Ícones
Preferir Lucide: Search, Copy, Check, RefreshCw, Download, Trash2, SlidersHorizontal, User, Building2, Car, FileCode2, ShieldCheck, Sparkles e Paperclip. Ações apenas com ícone MUST possuir nome acessível e Tooltip quando necessário.

## Ambientes
Geradores Gerais e QA Portuário MUST permanecer semanticamente separados. Componentes podem ser compartilhados, mas registro, composição e dados MUST respeitar o ambiente. Cadastro Geral não deve incorporar campos portuários sem requisito explícito.

## Responsividade
Desktop pode usar configuração + resultado em duas colunas. Em telas menores, reorganizar verticalmente sem overflow e mantendo ações acessíveis.

## Reutilização
Consolidar componentes compartilhados quando adequado, como GeneratorSearch, GeneratorOption, GeneratorSection, ResultPanel, ResultEmptyState, CopyAction, RegenerateAction e ChatComposer. Os nomes finais devem respeitar o padrão real do repositório.
