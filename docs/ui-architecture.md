# Interface do The Generator

## Responsabilidades

- `interface.js`: shell FUTURE G, marca, ambiente, header, abas/teclado, tema e sidebar. Um controle SVG com nome dinâmico, aria-expanded e tooltip CSS em hover/foco; navegação estreita fecha em rail após seleção, Escape devolve foco. Preferências permanecem em `thegenerator:sidebar-collapsed` e `futureg:environment`.
- `generator-registry.js`: catálogo único `GENERATORS` e categorias, busca por metadados, adaptadores individuais e projeção `TIPOS_DADOS` para lote/API. Carrega após storage e antes dos consumidores; callbacks só executam após inicialização dos motores.
- `generator-workspace.js`: seleção e abertura por ID, configuração, geração individual e apresentação de detalhes/limpeza. `openGenerator(id)` nunca preenche busca nem gera automaticamente. Desconhecidos mantêm resultado e recebem feedback. `placa-antiga` é variante de domínio `placa`; `motorista` abre lote; `cadastro` abre Cadastro Geral; NF-e/CT-e selecionam documento XML.
- `home-dashboard.js`: descoberta, favoritos, recentes e busca. Não tem resultado, busy, dispatch ou acesso ao DOM de resultados de outra tela. `/` focaliza busca; Ctrl+Enter executa no workspace de documentos.
- Motores existentes continuam responsáveis por geração, formatação, validação e XML. Estado individual (`currentType/currentValue`), lote e cadastro são distintos porque representam operações distintas; não existe cópia do mesmo resultado na Home.

## Persistência e compatibilidade

Favoritos e recentes persistem somente IDs, com limites 8 e 5. Migração versão 1 converte `conteiner` antigo da Home em `conteiner-lacre` uma vez. `conteiner` do domínio e históricos não muda. Uso bem-sucedido atualiza recentes; não há histórico adicional no controller. Históricos conservam formatos e chaves atuais.

O ambiente do shell é `general` ou `port`. `definirAmbiente` atualiza `body[data-environment]`, rótulos, estado pressionado e emite `futureg:environmentchange`, sem reload. Nesta fase ele não filtra o registry nem muda motores; a separação de geradores gerais/portuários pertence ao próximo incremento do OpenSpec.

Scripts clássicos e IDs de campos são preservados: `scripts/engine.cjs` executa o HTML em JSDOM para atender backend. Não transformar arquivos em ES modules sem adaptar e testar esse consumidor. Testes de engine, API, provider e armazenamento complementam os testes da interface.

## Design System e CSS

Há seis folhas proprietárias. Não criar arquivos de overrides.

| Arquivo | Responsabilidade |
| --- | --- |
| base.css | Tokens claro/escuro, tipografia, shell, botões/inputs, painéis/feedback, modal, tooltip, histórico compartilhado, hidden/foco/movimento reduzido |
| documentos.css | Seleção/configuração, resultado, previews de documentos, lista e lote |
| cadastro.css | Formulário, perfil e resultado de Cadastro Geral |
| evolucao.css | Descoberta Home, XML Fiscal, Assistente e seus estados |
| editor-xml.css | Editor e navegação interna de arquivos |
| validacao-xml.css | Entrada e relatório da validação |

Tokens `--surface`, `--border`, `--text`, `--accent`, `--focus-ring`, `--success`, `--error`, `--ui-space-*`, `--ui-radius*` e `--motion-*` são definidos em base.css. Usar bordas neutras; accent em ações/seleção/foco. `ui-primary`, `ui-secondary` e `ui-danger` expressam hierarquia; botão ícone exige nome acessível. Resultados vazios permanecem visíveis; desabilitar ações sem valor. `mostrarStatus` fornece feedback visual e um anúncio live, sem toast paralelo da Home. Bootstrap continua disponível para modais/tooltips existentes.

CSS foi consolidado por seletor/condição e transferido ao dono; regras de shell e layout documental antigas foram substituídas. Inventário de origem/destino em `../../artifacts/refactor-the-generator-ui/css-ownership.json`. Alterar regra existente em seu dono, não acrescentar uma versão ao fim de outro arquivo.

## Recuperação do Assistente

Falha de rede/configuração/serviço mostra indisponibilidade e modo local opcional; 429 explica limite, 410 explica sessão expirada, AbortError explica espera excedida. Recuperar mensagem respeita rascunho novo; anexos permanecem até sucesso ou remoção explícita. Nenhuma recuperação reenvia ou muda modo silenciosamente. Detalhes técnicos recebidos do servidor não são apresentados como mensagem principal.

## Verificação e recuperação da migração

Executar na raiz do repositório: `npm test`, `npm run build`, `npm run audit:browser`. `AUDIT_MATRIX=1 node scripts/audit-browser.cjs` captura os temas/larguras e estados da sidebar. Auditoria local remove dependências CDN para verificar degradação offline; SVGs do shell/registry e logo continuam visíveis. Inspecionar também integração com Bootstrap quando disponível.

Baseline histórico: 58 testes verdes. As evidências e o backup anterior à implementação foram preservados no arquivo `refactor-ui-evidence.zip` da Release de snapshots legados. Restaurar HTML, assets, scripts e testes como conjunto, nunca apagar localStorage. Para rollback com preferências migradas, adaptar o leitor antigo de favoritos para reconhecer `conteiner-lacre`; preservar a versão da migração evita remapear contêiner simples em recargas.
