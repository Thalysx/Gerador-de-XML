# Proposal

## Why

O The Generator em `projeto/` combina uma Home recente com workspaces antigos, catálogos divergentes e sucessivas camadas de CSS. A navegação por rótulos e a duplicação de estado tornam o acesso às ferramentas frágil e impedem que o produto pareça uma única aplicação.

## What Changes

- Auditar e consolidar incrementalmente o shell, com a identidade no topo da sidebar, um único controle de ícone acessível para expansão/recolhimento e header restrito ao contexto e ações globais.
- Unificar tokens, componentes, estados e layouts claros/escuros; substituir regras conflitantes em sua origem, sem adicionar CSS global de overrides.
- Introduzir registry único consumido por Home, busca, categorias, favoritos, recentes e Dados Cadastrais, com navegação determinística por ID e variantes explícitas.
- Transformar Home em descoberta/acesso rápido; concentrar geração e resultados nos workspaces, preservando acesso a gerar, regenerar, copiar, detalhes e exportação, sem uma segunda engine na Home.
- Organizar Dados Cadastrais em Configuração | Resultado no desktop, preservando individual, lote, validação, histórico e preferências.
- Migrar Cadastro Geral, XML Fiscal, Editor XML, Validação XML e Assistente à mesma linguagem visual, com estados de indisponibilidade compreensíveis.
- Remover legado e duplicações somente após comprovar paridade funcional, visual e acessível.
- Executar em nove fases: auditoria; application shell; Design System; registry; Home; Dados Cadastrais; Cadastro Geral/XML; Assistente; remoção segura.

## Capabilities

### New Capabilities

- `application-shell`: identidade, navegação e sidebar acessível e responsiva.
- `unified-design-system`: linguagem visual compartilhada, estados e propriedade dos estilos.
- `generator-discovery`: catálogo único, descoberta e abertura por ID.
- `generator-workspaces`: execução única, workspace de resultados e preservação das ferramentas existentes.

### Modified Capabilities

Nenhuma spec existente: `openspec list --specs` retornou inventário vazio.

## Impact

Escopo principal: `projeto/index.html`, `projeto/assets/css/`, scripts de interface, Home, documentos, geração, histórico e chat; testes em `projeto/tests/`. O backend `projeto/scripts/engine.cjs` inicializa o HTML via JSDOM e exige verificação de compatibilidade. Sem nova dependência de framework, alteração de contratos de API ou regras de negócio. Cópias em `assets/`, `visual-lab/` e `artifacts/` não serão sincronizadas nem excluídas automaticamente. FUTURE G, reescrita integral, remoção de funcionalidades e nova camada de overrides estão fora do escopo.
