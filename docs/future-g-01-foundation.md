# FUTURE G — foundation

Diagnóstico e baseline registrados em 25 de setembro de 2026, antes das alterações da fase `future-g-01-foundation`.

## Diagnóstico do repositório

- Stack: HTML, CSS e JavaScript clássicos, sem framework ou bundler. `index.html` carrega os scripts em ordem e `assets/js/app.js` inicializa a aplicação.
- Navegação: sete painéis locais (`home`, `xml`, `docs`, `cadastro`, `editor`, `chat` e `validacao`) alternados por `switchTab`, sem mudança de URL ou recarga.
- Shell: `assets/js/interface.js` controla abas, teclado, tema, cabeçalho e sidebar; `assets/css/base.css` é o proprietário dos tokens e estilos do shell.
- Geradores: `generator-registry.js` mantém IDs e adaptadores; `generator-workspace.js` abre e executa ferramentas; os motores de geração permanecem nos scripts de domínio.
- Integrações: `scripts/engine.cjs` reutiliza o DOM via JSDOM; `/api/chat` e `/api/status` têm adaptadores locais, Vercel e Netlify; segredos permanecem apenas no servidor.
- Build/deploy: `scripts/build.cjs` prepara `.generated-public`; `netlify.toml` publica o diretório e empacota as Functions. A configuração Vercel continua disponível.
- Persistência local: tema, sidebar, geradores recentes/favoritos, históricos e formulários usam as chaves documentadas em `docs/ui-architecture.md`.

## Baseline de regressão

Comandos executados na raiz do repositório, antes de editar a implementação:

| Verificação | Resultado |
| --- | --- |
| `npm test` | 64 testes aprovados, 0 falhas |
| `npm run build` | aprovado; `.generated-public` criado |
| lint | não existe script de lint no `package.json` |

A suíte cobre os pontos exigidos para esta fase:

- Geradores individuais, máscara, variantes, histórico e restauração.
- Lote, limite/prévia, cópia e exportação TXT/CSV/JSON.
- NF-e/CT-e, cenários, editor, validação e downloads XML.
- Assistente local/IA, Groq, sessões, cotas, storage e adaptadores Netlify.
- Build público e ausência de arquivos internos na distribuição.

A evidência de deploy real anterior permanece em `VERIFICACAO-PRODUCAO.md`. A auditoria visual anterior (`docs/refactor-verification.md`) cobre sete telas, dois temas, 360/768/1280/1920 e sidebar nos dois estados; esta fase executará nova auditoria após modificar o shell.

## Decisões da fase

- Evoluir o shell único existente; não criar uma aplicação FUTURE G paralela.
- Tratar o ambiente como estado do shell, persistido separadamente, sem reclassificar geradores nesta fase.
- Manter as sete ferramentas acessíveis nos dois ambientes até a separação de conceitos da fase G-02.
- Não alterar regras de geração, XML, IA, lote, APIs ou contratos de deploy.

## Relatório de conclusão

### Arquivos desta fase

- Shell e identidade: `index.html`, `assets/js/interface.js`, `assets/css/base.css`.
- Paleta nos componentes: `assets/css/documentos.css`, `assets/css/editor-xml.css`.
- Marca/PWA: `assets/brand/favicon.svg`, `assets/brand/future-g-mark.svg`, PNGs derivados e `site.webmanifest`.
- Contratos e cobertura: `README.md`, `docs/ui-architecture.md`, `tests/projeto.test.cjs` e `scripts/audit-browser.cjs`.

### Decisões arquiteturais

- O shell refatorado foi evoluído no lugar; não existe shell legado paralelo.
- `general` e `port` são valores estáveis do contexto. O evento `futureg:environmentchange` é o ponto de extensão para a arquitetura de G-02.
- A seleção não filtra ferramentas nesta fase, evitando antecipar a separação de domínio ou esconder funcionalidades existentes.
- A sidebar conserva um único estado expandido/recolhido e mantém os dois ambientes alcançáveis por ícone no rail.
- Tokens semânticos continuam centralizados em `base.css`; a migração visual não adicionou folha de override.

### Verificações finais

- `npm test`: 65/65 aprovados, incluindo troca/persistência do ambiente e contraste.
- `npm run build`: aprovado após regenerar os ativos da marca.
- `npm run audit:browser`: aprovado; sete telas sem overflow, 227 paradas de teclado, nenhum controle/marco sem nome e identidade nos dois temas.
- `AUDIT_MATRIX=1 node scripts/audit-browser.cjs`: 112 capturas, sete telas, claro/escuro, sidebar expandida/recolhida e larguras 360/768/1280/1920; zero falhas.
- Inspeção visual manual das capturas de 360 px em tema escuro/rail e 1280 px em tema claro/sidebar expandida: hierarquia, seletor e conteúdo permanecem legíveis.
- Não há script de lint no repositório.

### Regressões e riscos

- Nenhuma regressão detectada pela suíte, build ou auditoria.
- O ambiente ainda não altera o catálogo porque isso pertence a `future-g-02-generator-architecture`.
- As chaves históricas `thegenerator:*` foram preservadas para compatibilidade; arquivos públicos e identidade usam FUTURE G.
- Esta conclusão encerra somente G-01. G-02 não foi iniciado automaticamente.
