# Gerador de documentos

O desenvolvimento gradual do backend público está descrito em [PLANO-IA-PUBLICA.md](PLANO-IA-PUBLICA.md). A camada de provedor já permite testar Groq localmente com `AI_PROVIDER=groq` e `GROQ_API_KEY`; as rotas e a persistência estão implementadas, aguardando configuração e verificação real.

Abra `index.html` no navegador para usar os geradores, editor e validação local. Mantenha a pasta `assets` ao lado do HTML. O **chat com IA** precisa do servidor Node.js e de uma chave do provedor escolhido, conforme abaixo.

Bootstrap, ícones e fontes continuam sendo carregados de serviços externos e precisam de conexão para estar disponíveis.

Veja [ATUALIZACOES.md](ATUALIZACOES.md) para as funcionalidades adicionadas, exemplos do chat, verificações e limitações.

## Organização

A interface usa navegação lateral vertical e temas branco/roxo e preto/roxo. A camada visual está em `assets/css/visual-lab.css` e `assets/css/portus.css`, com cabeçalho contextual em `assets/js/visual-layout.js`.

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
| `assets/js/interface.js` | Abas, tema e integração visual com Bootstrap |
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
| `tests/projeto.test.cjs` | Testes de geração e fluxos com DOM simulado |
| `scripts/serve.cjs` | Servidor local opcional para desenvolvimento |

## Manutenção

Os scripts são carregados na ordem declarada no final do HTML, com `app.js` por último. Eles ainda compartilham o escopo global para preservar os eventos existentes no HTML e permitir a abertura direta pelo sistema de arquivos. Esta organização separa responsabilidades em arquivos; não converte a aplicação para módulos ES.

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

## Ativar o chat com IA

Consulte [ATIVACAO-IA.md](ATIVACAO-IA.md) para configurar Groq ou OpenAI, desenvolvimento local, Redis, limites e etapas de verificação na Vercel. O backend está implementado; a ativação pública ainda depende de credenciais e testes reais.

## Validação XML

A aba **Validação XML** aceita conteúdo colado, XML atual do gerador ou até 10 arquivos UTF-8 de 5 MB cada. Verifica sintaxe, estrutura básica, chave, CNPJ, campos e totais de produtos; exporta relatório JSON e abre cópia no editor. Essa tela funciona localmente, sem IA. Não verifica XSD, assinatura digital, regras tributárias completas ou autorização SEFAZ. O anexo do chat tem um limite separado de 100 KB.

Os testes de IA usam um provedor simulado e verificam a execução real das ferramentas. Uma chamada real à OpenAI depende da configuração de uma chave válida.

Os testes abrangem a geração, interpretação de pedidos, exportações e fluxos de XML. A atualização também foi conferida no Chrome, incluindo chat em largura de celular.
