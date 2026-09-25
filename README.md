# FUTURE G

Plataforma de dados sintéticos para desenvolvimento e QA. Este diretório é a única fonte ativa do produto; versões anteriores são preservadas por tags Git e pacotes preparados para Releases, não por cópias paralelas de pastas.

O desenvolvimento gradual do backend público está descrito em [PLANO-IA-PUBLICA.md](PLANO-IA-PUBLICA.md). O chat com Groq, as rotas, as sessões Redis e os limites de uso já estão publicados na Netlify e foram verificados no ambiente real. As verificações de concorrência e expiração do Redis continuam registradas separadamente em [VERIFICACAO-PRODUCAO.md](VERIFICACAO-PRODUCAO.md).

Abra `index.html` no navegador para usar os geradores, editor e validação local. Mantenha a pasta `assets` ao lado do HTML. O **chat com IA** precisa do servidor Node.js e de uma chave do provedor escolhido, conforme abaixo.

Bootstrap, ícones e fontes continuam sendo carregados de serviços externos e precisam de conexão para estar disponíveis.

Veja [ATUALIZACOES.md](ATUALIZACOES.md) para as funcionalidades adicionadas, exemplos do chat, verificações e limitações. O andamento da revisão de interface está em [PLANO-VISUAL.md](PLANO-VISUAL.md), com as evidências em [AUDITORIA-VISUAL.md](AUDITORIA-VISUAL.md) e o roteiro final em [CHECKLIST-LEITOR-TELA.md](CHECKLIST-LEITOR-TELA.md).

A identidade, os arquivos de logo, as regras de uso e a triagem pública do nome estão documentados em [IDENTIDADE.md](IDENTIDADE.md).

## Organização

A Home reúne descoberta, busca, categorias, favoritos e recentes. Cada ferramenta abre pelo ID do registry único e executa no seu workspace. A identidade FUTURE G e a navegação pertencem à sidebar; temas claro/escuro usam azul-marinho como base e azul nas interações. O seletor Geradores Gerais / QA Portuário troca o contexto sem recarregar a aplicação. Os seis arquivos CSS têm responsabilidades definidas, sem camadas de overrides. Veja [Arquitetura da interface](docs/ui-architecture.md) para contratos, persistência, estilos e verificações.

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, formulários e referências aos estilos e scripts |
| `assets/css/base.css` | Tema, estrutura geral, componentes e formulário de geração XML |
| `assets/css/documentos.css` | Interface do gerador de documentos |
| `assets/css/cadastro.css` | Cadastro, resultados, histórico e ajustes responsivos compartilhados |
| `assets/css/editor-xml.css` | Interface do editor XML |
| `assets/css/evolucao.css` | Chat, lotes, prévia XML, cenários e ajustes de organização |
| `assets/js/aleatorio.js` | Aleatoriedade compartilhada e controle de repetições recentes |
| `assets/js/catalogos.js` | Novos nomes, sobrenomes, marcas, setores e DDDs por UF |
| `assets/js/storage.js` | Leitura e gravação no armazenamento local |
| `assets/js/interface.js` | Shell, sidebar, abas, tema e acessibilidade |
| `assets/js/generator-registry.js` | IDs, metadados, capacidades, adaptadores e preferências |
| `assets/js/generator-workspace.js` | Seleção, configuração e ações de resultado de documentos |
| `assets/js/produtos.js` | Catálogo de produtos |
| `assets/js/modelos-xml.js` | Modelos de NF-e e CT-e |
| `assets/js/gerador-xml.js` | Formulário fiscal, chaves, geração, downloads e persistência dos campos |
| `assets/js/utils.js` | Escape de texto, mensagens, cópia e rolagem |
| `assets/js/documentos.js` | Geração e validação de documentos, nomes e dados auxiliares |
| `assets/js/cadastro.js` | Geração, edição e cópia do cadastro geral |
| `assets/js/historico.js` | Histórico dos documentos e cadastros |
| `assets/js/editor-xml.js` | Importação, edição e exportação de XML |
| `assets/js/geracao-dados.js` | API de geração independente da interface, novos documentos e exportação |
| `assets/js/chat.js` | Interpretação local de pedidos e interface de chat/lotes |
| `assets/js/chat-ia.js` | Conversa com IA, anexos explícitos e artefatos |
| `assets/js/validacao-xml.js` | Sintaxe e consistência básica de NF-e/CT-e |
| `assets/css/validacao-xml.css` | Tela de validação XML |
| `scripts/ai.cjs` | Orquestração dos provedores, sessões e ferramentas |
| `scripts/engine.cjs` | Reutilização do gerador e validador no servidor |
| `assets/js/xml-workflow.js` | Prévia, integração com editor/cadastro, cenários e comparação de XML |
| `assets/js/app.js` | Inicialização da aplicação e restauração do estado |
| `assets/js/home-dashboard.js` | Descoberta, favoritos e recentes; navegação por ID |
| `tests/projeto.test.cjs` | Testes de geração e fluxos com DOM simulado |
| `scripts/serve.cjs` | Servidor local opcional para desenvolvimento |
| `scripts/audit-browser.cjs` | Auditoria reproduzível de zoom, overflow, foco por teclado e movimento reduzido em Chrome/Edge |
| `scripts/export-brand.cjs` | Exportação das versões PNG da marca a partir dos SVGs oficiais |
| `openspec/` | Especificações, mudanças incrementais e roadmap FUTURE G |

## Versões e nomenclatura

- Produto, pacote e repositório usam o nome **FUTURE G** / `future-g`.
- Releases seguem SemVer: `v2.x` para a linha anterior e `v3.0.0-alpha.x` durante a implantação do roadmap FUTURE G.
- `main` contém somente a versão ativa. Snapshots antigos ficam em Releases; não copie versões completas para subpastas do código.
- Arquivos e pastas novos usam `kebab-case`. Identificadores persistidos antigos, como `thegenerator:*`, permanecem compatíveis para não apagar preferências locais.
- Consulte [Histórico de versões e arquivos legados](docs/version-history.md) antes de recuperar uma versão anterior.

## Manutenção

Os scripts são carregados na ordem declarada no final do HTML. `app.js` registra a inicialização geral; `visual-layout.js` e `home-dashboard.js` completam a experiência visual usando as funções já carregadas. Eles ainda compartilham o escopo global para preservar os eventos existentes no HTML e permitir a abertura direta pelo sistema de arquivos. Esta organização separa responsabilidades em arquivos; não converte a aplicação para módulos ES.

A ordem dos arquivos CSS preserva a cascata original. Ao ajustar estilos, procure o arquivo da funcionalidade correspondente.

## Desenvolvimento e testes

O uso normal continua sem instalação. Para executar os testes automatizados, use Node.js 20.19 ou superior:

```sh
npm install
npm test
```

Para servir a aplicação localmente:

```sh
npm run dev
```

Abra `http://127.0.0.1:4173`. A dependência `jsdom` é usada nos testes e no servidor para reaproveitar as regras do gerador; ela não é carregada pelo navegador.

Para conferir as sete telas em escala de 200%, percorrer os controles por teclado e verificar movimento reduzido em um Chrome ou Edge instalado:

```sh
npm run audit:browser
```

O comando cria um servidor temporário sem dependências externas, grava as evidências locais em `artifacts/visual-review` e encerra o navegador isolado ao concluir. A dependência de desenvolvimento `ws` é usada somente para essa comunicação com o navegador.

Para recriar os PNGs da identidade em `assets/brand`:

```sh
npm run brand:export
```

## Ativar o chat com IA

Consulte [ATIVACAO-IA.md](ATIVACAO-IA.md) para configurar Groq ou OpenAI, desenvolvimento local, Redis, limites e etapas de verificação na Vercel. A IA está publicada na Netlify: [abrir gerador](https://gerador-all.netlify.app). Consulte [NETLIFY.md](NETLIFY.md) para configurar esse destino e [VERIFICACAO-PRODUCAO.md](VERIFICACAO-PRODUCAO.md) para resultados reais e verificações pendentes.

## Validação XML

A aba **Validação XML** aceita conteúdo colado, XML atual do gerador ou até 10 arquivos UTF-8 de 5 MB cada. Verifica sintaxe, estrutura básica, chave, CNPJ, campos e totais de produtos; exporta relatório JSON e abre cópia no editor. Essa tela funciona localmente, sem IA. Não verifica XSD, assinatura digital, regras tributárias completas ou autorização SEFAZ. O anexo do chat tem um limite separado de 100 KB.

Os testes automatizados da IA usam um provedor simulado para manter a suíte determinística e verificam a execução real das ferramentas. A integração pública com Groq também foi exercitada no site implantado.

Os 58 testes abrangem geração, home, favoritos e recentes, atalhos, interpretação de pedidos, exportações, downloads, persistência, temas, nomes acessíveis dos controles, API e fluxos de XML. A atualização também foi conferida em Chromium em escala de 200% e desktop, incluindo as sete telas e os dois temas.
