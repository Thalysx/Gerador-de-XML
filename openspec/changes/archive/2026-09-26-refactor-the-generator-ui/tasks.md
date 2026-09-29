# Tasks

## 1. Auditoria da arquitetura atual

- [x] 1.1 Complementar a auditoria estática de design.md com baseline de `npm test` em `projeto/`, distinguindo falhas preexistentes; entregar relatório com comando e resultados antes de editar implementação.
- [x] 1.2 Registrar baseline visual das sete telas em claro/escuro e larguras 360/768/1280/1920, incluindo sidebar e resultados; verificar Telefone a partir da Home com e sem filtros anteriores e documentar comportamento observado.
- [x] 1.3 Fechar matriz de paridade de botões legados, tipos de lote, variantes, ações, persistência e consumidores JSDOM; verificar que cada entrada possui destino/ID proposto e registrar backup recuperável do alvo.
- [x] 1.4 Mapear seletores compartilhados e regras funcionais dos onze CSS aos proprietários definidos no design; verificar matriz de origem/destino sem regra de hidden, foco, tema ou breakpoint desamparada.

## 2. Application shell

- [x] 2.1 Mover marca para sidebar e simplificar header em index.html; verificar todas as telas com identidade no nav e somente contexto/ações globais no header.
- [x] 2.2 Transferir estado de sidebar para interface.js e substituir botão textual, checkbox e controle mobile redundante por controle único de ícone; testar persistência, nome acessível, aria-expanded, tooltip hover/foco, Escape e foco mobile.
- [x] 2.3 Consolidar navegação/contexto e CSS do shell em seus proprietários, removendo regras substituídas; atualizar testes de abas e documentar contrato do shell, verificando teclado e logo/ícones/página ativa na sidebar recolhida nos dois temas.

## 3. Design System

- [x] 3.1 Consolidar tokens semânticos em base.css e remover declarações concorrentes nos arquivos de override; verificar contraste, temas, espaçamento e movimento reduzido com testes existentes e comparação visual.
- [x] 3.2 Consolidar botões, inputs, cards, painéis, modais e tooltips e aplicar variantes comuns às sete telas; verificar matriz de componentes e estados por teclado sem colisões com Bootstrap.
- [x] 3.3 Unificar status/toasts/loading/erro/sucesso/vazio/disabled e feedback de cópia nos utilitários compartilhados; testar falha e sucesso com um único anúncio acessível e sem perda das ações de recuperação.
- [x] 3.4 Migrar regras específicas aos CSS de domínio existentes e remover as regras de origem em cada transferência; documentar propriedade dos estilos e verificar que nenhum CSS global de overrides novo foi adicionado e que Home/telas internas já compartilham a base visual.

## 4. Generator registry

- [x] 4.1 Criar registry de metadados/capacidades/variantes e adaptadores das funções atuais; derivar TIPOS_DADOS e rótulos comuns; testar unicidade, cobertura da matriz 1.3 e ausência de tipos não suportados no lote.
- [x] 4.2 Implementar abertura por ID com seleção/configuração/foco e erro recuperável; testar todos os IDs, especialmente CPF, CNPJ alfa, Telefone, placas, contêiner/lacre, NF-e e CT-e, com filtros anteriores e rótulos alterados.
- [x] 4.3 Fazer Home, busca, categorias, favoritos, recentes e lista de Dados Cadastrais consumirem registry; remover HOME_GENERATORS e catálogo manual equivalente, verificando que busca não é escrita/disparada para navegar.
- [x] 4.4 Implementar migração versionada das preferências antigas de contêiner e persistência comum de favoritos/recentes; testar recargas, ID desconhecido, limites 8/5 e preservação de históricos e significado antigo.
- [x] 4.5 Documentar contrato do registry e ordem de scripts; verificar inicialização DOM e engine/API com a nova projeção de tipos sem duplicação dos algoritmos.

## 5. Home

- [x] 5.1 Substituir seleção local por acesso direto aos workspaces e organizar descoberta/busca/categorias/favoritos/recentes; testar estados vazios, ausência de resultados, teclado e acesso exato por ID.
- [x] 5.2 Transferir ações exclusivas de apresentação da Home para componentes de resultado dos workspaces antes de remover homeState.result/busy e funções homeGenerate/homeReadDocumentResult; verificar gerar, regenerar, copiar, detalhes e limpar disponíveis e ausência de geração independente na Home.
- [x] 5.3 Ligar recentes ao sucesso de geração comum e atualizar testes antigos da Home/atalhos para o fluxo compartilhado; documentar novo acesso e verificar uma execução/um histórico por ação e cards proporcionais em desktop amplo.

## 6. Dados Cadastrais

- [x] 6.1 Organizar Configuração | Resultado com seleção por ID e resultado vazio persistente; remover layout condicionado a style inline, verificando foco, estados e disposição desktop/mobile nos dois temas.
- [x] 6.2 Consolidar controller individual e adaptadores sem duplicar geração, preservando opções e previews; caracterizar e testar máscaras, nome associado, telefone fixo/celular/UF, placas antiga/Mercosul, contêiner/lacre e regeneração antes de extrair lógica repetida.
- [x] 6.3 Integrar lote e validação ao workspace; testar limites 1/500/inválidos, não repetição, prévia de 50, cópia integral e exportações TXT/CSV/JSON mantendo proteção de CSV e regras documentais.
- [x] 6.4 Integrar histórico e resultado destacado com componentes comuns; testar filtro/restauração/índices/download do valor exibido e nome associado, documentando compatibilidade das chaves existentes e ausência de registros duplicados.

## 7. Cadastro Geral e ferramentas XML

- [x] 7.1 Migrar layout de Cadastro Geral e remover seus overrides antigos; verificar geração por campo/completa, cópia, edição, histórico e restauração com testes de paridade e screenshots claro/escuro.
- [x] 7.2 Migrar XML Fiscal para componentes comuns com largura útil; verificar NF-e/CT-e, cenários, locks, produtos, edição de campos, prévia e downloads sem mudança das regras fiscais existentes.
- [x] 7.3 Migrar Editor XML e Validação XML preservando importação e dados; testar fluxo gerar → editar → validar → baixar, XML inválido, filtros de gravidade e relatório integral, documentando ajustes de seletores compatíveis.

## 8. Assistente

- [x] 8.1 Migrar controles, conversa, resultados, anexos e estados visuais para componentes comuns; testar modo local/IA, sugestões revisáveis, anexo explícito e texto seguro sem execução de HTML.
- [x] 8.2 Mapear indisponibilidade, timeout, limite, sessão expirada e erro desconhecido a mensagens/ações de produto; testar via respostas simuladas preservação de rascunho e anexos, tentativa explícita e ausência de npm/stack como mensagem principal.
- [x] 8.3 Remover regras antigas de apresentação do chat e documentar estados de recuperação; executar testes de IA/API/provider/session-store e confirmar engine JSDOM funcional sem componentes removidos da Home.

## 9. Remoção segura de legado e código duplicado

- [x] 9.1 Remover imports/arquivos obsoletos visual-lab.css, portus.css, usabilidade.css, minimal.css e experience.css somente após migrar todas as regras úteis; verificar referências, matriz CSS, ausência de novas camadas de override e propriedade única dos componentes.
- [x] 9.2 Remover listeners, mapas, estados e funções de compatibilidade sem consumidores, mantendo motores de negócio; verificar referências estáticas, inicialização e matriz de paridade completa sem excluir cópias fora de projeto/.
- [x] 9.3 Executar suíte completa com `npm test`, `npm run build` e auditoria de navegador em projeto/; validar sete telas, dois temas, quatro larguras, sidebar, teclado, zoom 200% e movimento reduzido, registrando evidências e comparando ao baseline.
- [x] 9.4 Atualizar documentação final de arquitetura/CSS/registry e recuperação por incremento; verificar todos os critérios das quatro specs e que nenhuma funcionalidade, regra ou histórico foi perdido antes de considerar a mudança concluída.
