# FUTURE G

Plataforma de dados sintéticos para desenvolvimento e QA. Este diretório é a única fonte ativa do produto; versões anteriores são preservadas por tags Git e pacotes preparados para Releases, não por cópias paralelas de pastas.

Versão desta entrega: **3.0.0-alpha.8**, com catálogo único e correções BASE-01 a BASE-11. A publicação usa a integração Git do projeto `gerador-de-xml` na Vercel. O resultado da verificação de produção é registrado em [VERIFICACAO-PRODUCAO.md](VERIFICACAO-PRODUCAO.md).

O catálogo reúne ferramentas gerais e portuárias, com busca e filtros por categoria, sem alternância de ambiente. Cadastro geral tem um único seletor de tipo de ficha. Veja [Catálogo único](docs/unified-catalog.md) para a decisão e compatibilidade e [DESIGN.md](DESIGN.md) para a referência visual vigente.

O assistente usa apenas [comandos locais](docs/local-commands.md), com catálogo, favoritos, geração e consultas XML. Os planos e testes antigos de IA são registros históricos. As rotas públicas de chat foram aposentadas; a API de validação XML permanece disponível.

Abra `index.html` no navegador para usar os geradores, editor e validação local. Mantenha a pasta `assets` ao lado do HTML. Os comandos locais também funcionam sem servidor. A verificação XSD da tela de Validação usa a API da aplicação.

Bootstrap e fontes continuam sendo carregados de serviços externos e precisam de conexão para estar disponíveis. Os ícones Lucide usados pela aplicação são empacotados localmente.

Veja [ATUALIZACOES.md](ATUALIZACOES.md) para funcionalidades, comandos, verificações e limites. [DESIGN.md](DESIGN.md) consolida identidade, tokens, hierarquia, estados e responsividade atuais. [PLANO-VISUAL.md](PLANO-VISUAL.md) e [AUDITORIA-VISUAL.md](AUDITORIA-VISUAL.md) preservam registros históricos; a escuta com leitor de tela segue pendente. O arquivo do roteiro anterior foi removido na limpeza da documentação.

O estado das fases concluídas e arquivadas está em [Roadmap consolidado](docs/roadmap-consolidado.md). A validação fiscal local da fase 13A está concluída; a integração SEFAZ da fase 13B foi cancelada por decisão do usuário.

A identidade, os arquivos de logo e as regras de uso estão documentados em [IDENTIDADE.md](IDENTIDADE.md). O histórico de nomenclatura ali registrado não é uma nova pesquisa de disponibilidade do nome.

## Organização

A Home reúne descoberta, busca, ferramentas e recentes, com favoritos e atividade acessíveis sob demanda. Cada ferramenta abre pelo ID do registry único e executa no seu workspace. As ferramentas compartilham superfícies neutras e interação azul nos dois temas; os comandos usam o azul compartilhado. A sidebar mantém a marca FUTURE G. Os seis arquivos CSS têm responsabilidades definidas. Crachá e Placa geram automaticamente ao selecionar a opção; XML Fiscal recupera os campos e ações visíveis da organização anterior. Veja [Placa automática](docs/direct-plate-generation.md), [Correção XML e crachá](docs/xml-layout-and-direct-badge.md) e [Arquitetura da interface](docs/ui-architecture.md) para contratos, persistência, estilos e verificações e [Revisão visual](docs/visual-system-refresh.md) para as mudanças e evidências.

O fluxo OpenSpec deve permanecer uniforme: concluir checklist e relatório, incorporar as decisões às especificações canônicas, executar testes/build/auditoria pertinentes e mover a mudança para `openspec/changes/archive/AAAA-MM-DD-nome-da-mudanca`. A etapa seguinte só começa depois desse arquivamento.

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, formulários e referências aos estilos e scripts |
| `assets/css/base.css` | Tema, estrutura geral, componentes e formulário de geração XML |
| `assets/css/documentos.css` | Interface do gerador de documentos |
| `assets/css/cadastro.css` | Cadastro, resultados, histórico e ajustes responsivos compartilhados |
| `assets/css/editor-xml.css` | Interface do editor XML |
| `assets/css/evolucao.css` | Comandos locais, lotes, prévia XML e ajustes de organização |
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
| `assets/js/development-generators.js` | UUID v4, endereços de documentação IPv4/IPv6 e MAC local para testes |
| `assets/js/finance-generators.js` | Valores BRL, chave Pix EVP não registrada e IDs fictícios de transação |
| `assets/js/port-generators.js` | Perfis, empresas, veículos, contêineres, cargas e documentos sintéticos do QA Portuário |
| `assets/js/chat.js` | Interface de comandos locais, conversa e lotes |
| `assets/js/command-parser.js` | Gramática e catálogo dos comandos locais |
| `assets/js/command-xml.js` | Geração isolada, consultas, validação e cópias XML |
| `assets/js/command-discovery.js` | Busca, sugestões e favoritos de comandos |
| `assets/js/chat-attachments.js` | Anexos locais e cancelamento de leituras |
| `assets/js/validacao-xml.js` | Relatórios estruturados, resumo e testes negativos de NF-e/CT-e |
| `assets/css/validacao-xml.css` | Tela de validação XML |
| `scripts/ai.cjs` | Motor histórico de IA, preservado para testes e recuperação; não usado pelo servidor padrão |
| `scripts/engine.cjs` | Reutilização do gerador e validador no servidor |
| `assets/js/xml-workflow.js` | Prévia, integração com editor/cadastro, cenários XML salvos e comparação de XML |
| `assets/js/app.js` | Inicialização da aplicação e restauração do estado |
| `assets/js/home-dashboard.js` | Descoberta, favoritos e recentes; navegação por ID |
| `assets/js/productivity.js` | Busca global Ctrl+K, dashboards por ambiente e atividade resumida sem resultados |
| `tests/projeto.test.cjs` | Testes de geração e fluxos com DOM simulado |
| `scripts/serve.cjs` | Servidor local opcional para desenvolvimento |
| `scripts/audit-browser.cjs` | Auditoria reproduzível de zoom, overflow, foco por teclado e movimento reduzido em Chrome/Edge |
| `scripts/build-icons.cjs` | Geração do runtime Lucide local contendo somente os ícones utilizados |
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

Para conferir as sete telas em escala de 200%, percorrer os controles por teclado, testar a busca global, inspecionar console e orçamentos de recursos e verificar movimento reduzido em um Chrome ou Edge instalado:

```sh
npm run audit:browser
```

O comando cria um servidor temporário sem dependências externas, grava as evidências locais em `artifacts/visual-review` e encerra o navegador isolado ao concluir. A dependência de desenvolvimento `ws` é usada somente para essa comunicação com o navegador.

`npm run build` recria antes da distribuição o subset local de 51 ícones. Para executar somente essa etapa, use `npm run icons:build`. A matriz responsiva completa dos dois ambientes e temas, incluindo disclosures abertos, pode ser repetida com `$env:AUDIT_MATRIX='1'; npm run audit:browser` no PowerShell.

Para os cinco fluxos de regressão em Chromium desktop/mobile, instale o navegador do executor fixado no lockfile e execute a suíte:

```sh
npm ci
node node_modules/@playwright/test/cli.js install chromium
npm run test:e2e
```

Consulte [Suíte E2E e resultados](docs/quality/e2e-smoke.md) para isolamento, evidências, repetição e limitações. Após as correções de [estados assíncronos](docs/quality/async-xml.md), [teclado e composer](docs/quality/command-controls.md), [comunicação XML](docs/quality/validation-processing-copy.md), [lotes IPv4](docs/quality/ipv4-batches.md) e [capturas da auditoria](docs/quality/audit-capture-state.md), `npm test` passou em **145/145** e os **20 E2E** passaram sem retries. IPv4 mantém até 500 valores recentes e permite reutilização entre lotes após sair dessa janela; cada lote de até 500 permanece sem duplicatas. BASE-01 permanece resolvido com os hashes originais; veja [Integridade dos schemas](docs/quality/fiscal-schema-integrity.md) e as demais [pendências conhecidas](docs/quality/known-issues.md). A cobertura dos testes não implica autorização fiscal oficial.

`npm run audit:browser` confere o estado antes de cada PNG salvo e gera `artifacts/visual-review/capture-manifest.json`, com painel, tema, catálogo, viewport, sidebar, recorte e hash. A matriz usa o mesmo manifesto no seu diretório de saída. Considere apenas os arquivos listados num manifesto completo da execução, junto do exit code e do relatório; imagens antigas remanescentes não integram esse conjunto. As capturas são diagnósticas, sem aprovação automática de baseline visual.

Para recriar os PNGs da identidade em `assets/brand`:

```sh
npm run brand:export
```

## Comandos locais

Desde `3.0.0-alpha.7`, o assistente usa comandos locais. A `alpha.8` mantém esse fluxo no catálogo único. Experimente `10 crachás sem código de barras`, `5 UUIDs`, `gerar NF-e com 3 produtos`, `resumir XML anexado` e `repetir último comando`. Use o catálogo nas Opções do assistente para consultar todos os exemplos. Favoritos guardam somente comandos, em uma lista unificada. Veja [guia completo](docs/local-commands.md). A publicação usa a integração Git da [Vercel](https://gerador-de-xml.vercel.app/).

## Validação XML

A aba **Validação XML** aceita conteúdo colado, XML atual do gerador ou até 10 arquivos UTF-8 de 5 MB cada. O relatório estruturado classifica achados como Erro, Aviso ou Informação e, quando disponíveis, mostra tag, valor, caminho, linha e coluna. As visões Resumo, XML e Validação permanecem ligadas ao mesmo documento; a exportação JSON não inclui o XML-fonte.

A mesma tela cria cópias intencionalmente inválidas de NF-e/CT-e para QA: CPF ou CNPJ inválido, chave inconsistente, campo obrigatório ausente, formato ou tag inválida e XML malformado. Essas cópias recebem identificação explícita, podem ser baixadas e nunca alteram o XML-base do gerador.

Sintaxe e regras locais são verificadas no navegador, sem IA. Ao selecionar ou arrastar arquivos, ou acionar uma validação, NF-e e CT-e 4.00 compatíveis de até 4 MiB são enviados à API da aplicação para verificar o XSD. Esse serviço não armazena, registra ou devolve o XML-fonte. Se estiver indisponível, o relatório preserva as verificações locais e informa a cobertura reduzida. CT-e 3.00 tem apenas as verificações locais aplicáveis, sem cobertura XSD. A análise não verifica assinatura digital, regras tributárias completas ou autorização SEFAZ. O anexo dos comandos locais tem um limite separado de 100 KB. Consulte [FUTURE G 13A — Validação fiscal](docs/future-g-13a-local-fiscal-validation.md).

## Cenários XML salvos e inventário atual

**XML fiscal** permite salvar, carregar e excluir até 20 configurações neste navegador, incluindo campos, quantidade de produtos e dados dinâmicos da NF-e. Esses cenários XML salvos continuam disponíveis.

A antiga biblioteca de dez fluxos operacionais portuários, com agendamento, Gate IN/Gate OUT e massas relacionadas, não integra o runtime atual. Seu [relatório da fase 09](docs/future-g-09-test-scenarios.md) é histórico. A interface atual usa um catálogo único, sem divisão global entre Geral e QA Portuário. Consulte o [inventário vigente](docs/current-capabilities.md) para distinguir funcionalidades disponíveis, ausentes e registros históricos.

## Produtividade

`Ctrl+K` abre uma busca global por geradores e áreas do catálogo inteiro. A Home apresenta contadores e atividade recente conjunta de todas as ferramentas, incluindo lotes recentes. Esse resumo guarda até 50 entradas somente com identificador, ambiente, tipo de ação, quantidade e horário — nunca valores gerados, prompts, anexos ou segredos. Limpar atividade remove a lista conjunta, preservando favoritos e históricos detalhados. Lotes compatíveis podem ser copiados e baixados integralmente em JSON, CSV ou TXT, com nome contextual. Consulte a [produtividade atual](docs/current-capabilities.md#produtividade-disponível); a [fase 10](docs/future-g-10-productivity.md) registra a entrega histórica.

Os testes históricos do motor IA continuam com provedores simulados. A versão atual não aciona esse motor ou seus endpoints públicos.

Os testes Node abrangem geração geral e portuária por clique e atalho opcional, apresentação estruturada e rolagem do painel Resultado, ficha seletiva do Cadastro Geral, crachá sintético, cenários XML salvos, ausência da antiga tela de cenários operacionais, busca global, resumo unificado, privacidade da atividade, Home, favoritos e recentes, atalhos, interpretação de pedidos, exportações, downloads, persistência, temas, nomes acessíveis dos controles, API, ativos PWA no servidor local, relatórios XML estruturados, destinatário de CT-e, variantes negativas e o estado de processamento do upload. A revisão visual foi conferida em Chromium em escala de 200%, na matriz de 112 combinações de painel, tema, largura e sidebar, em 28 estados com opções abertas e em quatro casos do Editor carregado no celular. Consulte a [auditoria atual de capturas](docs/quality/audit-capture-state.md), a [revisão visual histórica](docs/visual-system-refresh.md) e o marco anterior [FUTURE G 11 — Polimento e robustez](docs/future-g-11-polish.md).
