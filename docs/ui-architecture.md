# Interface da FUTURE G

## Responsabilidades

- `interface.js`: shell FUTURE G, marca, ambiente, header, abas/teclado, tema e sidebar. A ordem, os rótulos, as descrições, os ícones, os grupos e a disponibilidade das abas vêm de `APP_NAVIGATION`. Um controle SVG com nome dinâmico, aria-expanded e tooltip CSS em hover/foco; navegação estreita fecha em rail após seleção, Escape devolve foco. Preferências permanecem em `thegenerator:sidebar-collapsed` e `futureg:environment`.
- `generator-registry.js`: fonte canônica de `APP_ENVIRONMENTS`, `APP_NAVIGATION`, `GENERATORS` e categorias. Cada gerador declara ambientes, rota, palavras-chave e capacidades; projeções reutilizáveis alimentam Home, workspace e lote. `TIPOS_DADOS` continua sendo o contrato completo usado pelos motores e pela API. Carrega após storage e antes dos consumidores; callbacks só executam após inicialização dos motores.
- `generator-workspace.js`: seleção e abertura por ID, configuração, geração individual e apresentação de detalhes/limpeza. `openGenerator(id)` nunca preenche busca nem gera automaticamente; `activateGenerator(id)` representa a ativação do usuário e executa imediatamente apenas opções simples. `requiresConfiguration` preserva o botão Gerar para Telefone e Placa. Desconhecidos mantêm resultado e recebem feedback. Placa é uma única área com seletor de padrão; `placa-antiga` permanece como alias não descobrível que seleciona a variante antiga. `cadastro` abre Cadastro Geral; NF-e/CT-e selecionam documento XML.
- `home-dashboard.js`: descoberta, favoritos, recentes e busca. Não mantém resultado próprio nem duplica os motores; uma opção simples ativa o workspace e gera ali imediatamente. `/` focaliza busca; Ctrl+Enter continua disponível no workspace de documentos.
- `productivity.js`: busca global `Ctrl+K`, projeções do painel por ambiente e atividade operacional resumida. A busca reúne destinos e geradores do registry, mantém o foco dentro do diálogo e respeita o ambiente ativo. A atividade usa uma lista explícita de campos e nunca grava o conteúdo gerado.
- `development-generators.js`: regras puras para UUID v4, endereços IPv4/IPv6 reservados para documentação e MAC local/unicast. É carregado antes de `geracao-dados.js`; registry, resultado, histórico e lote continuam compartilhados.
- `finance-generators.js`: regras puras para valor BRL, EVP Pix não registrada e referência de transação marcada como teste. Não modela conta, cartão, boleto, credencial ou pagamento real.
- `cadastro.js`: define os cinco grupos da ficha, aplica a seleção à geração e deriva dela a apresentação seccionada e a cópia em texto. O histórico persiste `grupos`; registros legados têm os grupos inferidos pelos campos preenchidos em `historico.js`.
- `badge-generators.js`: contrato estruturado e apresentação do crachá sintético. `CRACHA_MODELOS` contém o modelo Funcionário e é o ponto de extensão para Motorista, Visitante e Terceirizado; o workspace, o histórico e o lote continuam compartilhados.
- `port-generators.js`: regras estruturadas do QA Portuário para perfis, entidades empresariais, cavalo/carreta/conjunto, contêiner ISO 6346, cargas com NCM e documentos portuários. Registry, resultado, histórico, lote, exportação e Assistente permanecem compartilhados.
- Motores existentes continuam responsáveis por geração, formatação, validação e XML. Estado individual (`currentType/currentValue`), lote e cadastro são distintos porque representam operações distintas; não existe cópia do mesmo resultado na Home.

Lote aparece depois do resultado individual e antes do histórico. `limparLoteInterface` apaga somente `ultimoLote`, prévia e ações de exportação; seleção, opções e resultado individual permanecem. No XML fiscal, a lista `gerador:ncms_manuais` aceita até 50 NCMs únicos de oito dígitos e os aplica em ordem aos produtos atuais sem substituir o catálogo.

## Persistência e compatibilidade

Favoritos e recentes persistem somente IDs, com limites 8 e 5. Migração versão 1 converte `conteiner` antigo da Home em `conteiner-lacre` uma vez. `conteiner` do domínio e históricos não muda. Uso bem-sucedido atualiza recentes; não há histórico adicional no controller. Históricos conservam formatos e chaves atuais.

A atividade produtiva usa `futureg:activity-v1`, limitada a 50 entradas normalizadas com `target`, `environment`, `kind`, `quantity` e `timestamp`. Campos adicionais, resultados, prompts, anexos, chaves e tokens são descartados. Cada dashboard filtra essa lista pelo ambiente e permite limpar somente sua própria projeção.

O ambiente do shell é `general` ou `port`. `definirAmbiente` atualiza `body[data-environment]`, rótulos, estado pressionado e navegação, depois emite `futureg:environmentchange`, sem reload. Home, categorias, favoritos, recentes, workspace e lote consomem a projeção ativa do registry. Preferências incompatíveis ficam ocultas sem serem apagadas. Se a ferramenta selecionada não existir no novo ambiente, a aplicação retorna à Home e preserva resultados e históricos; restaurar um histórico troca para o ambiente compatível.

Cada gerador pertence a um único ambiente. CPF, nome, CNPJ, empresa, telefone, placas, Cadastro Geral, NF-e e utilitários gerais pertencem a `general`; perfis e empresas portuárias, veículos de carga, contêineres, cargas, booking, DI, DUIMP, DU-E, documentos de carga e CT-e pertencem a `port`. Os workspaces de XML, validação e Assistente reutilizam os mesmos componentes, mas suas opções, sugestões e documento atual são projetados pelo ambiente. Cadastro Geral não inclui contêiner, lacre nem linguagem específica de motorista ou transportadora; nem mesmo seu contrato de lote composto produz esses campos. Preferências e históricos incompatíveis permanecem preservados, porém ocultos no outro contexto. A lista manual de NCM é o único cadastro compartilhado: alimenta produtos de NF-e em `general` e cargas em `port`, sem misturar os documentos fiscais.

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

Tokens `--surface`, `--border`, `--text`, `--accent`, `--focus-ring`, `--success`, `--error`, `--ui-space-*`, `--ui-radius*` e `--motion-*` são definidos em base.css. O conjunto padrão de `general` recupera a identidade roxa; `body[data-environment="port"]` aplica a identidade azul, em ambos os temas claro e escuro. Usar bordas neutras; accent em ações/seleção/foco. `ui-primary`, `ui-secondary` e `ui-danger` expressam hierarquia; botão ícone exige nome acessível. Resultados vazios permanecem visíveis; desabilitar ações sem valor. `mostrarStatus` fornece feedback visual e um anúncio live, sem toast paralelo da Home. Bootstrap continua disponível para modais/tooltips existentes.

shadcn/ui não é compatível com a stack atual sem introduzir React/Tailwind e uma reescrita. Lucide vanilla `1.44.0` é compatível e constitui o conjunto padrão: `scripts/build-icons.cjs` extrai os 49 ícones utilizados para `assets/js/lucide.min.js`, mantendo a API `window.lucide`; `assets/js/icons.js` converte ícones estáticos e dinâmicos. O build sempre regenera esse runtime, atualmente com 11.467 bytes, em vez de distribuir os 433.756 bytes do pacote completo. Bootstrap Icons/SVGs manuais não são usados na interface. A identidade visual continua definida pelos tokens FUTURE G, não pela biblioteca.

CSS foi consolidado por seletor/condição e transferido ao dono; regras de shell e layout documental antigas foram substituídas. Inventário de origem/destino em `../../artifacts/refactor-the-generator-ui/css-ownership.json`. Alterar regra existente em seu dono, não acrescentar uma versão ao fim de outro arquivo.

## Relatório da Validação XML

`assets/js/validacao-xml.js` mantém uma única coleção `relatoriosXml` para conteúdo colado, arquivos, documento do gerador, artefatos da IA e variantes negativas. Cada relatório contém resumo, fonte local, metadados e achados estruturados; Resumo, XML e Validação são somente projeções desse objeto. O filtro de severidade e a aba selecionada são estados de apresentação e não removem achados.

As variantes negativas clonam `xmlsGerados` antes de qualquer alteração e retornam ao mesmo `analisarXml`. O XML-base, o editor e o gerador fiscal não recebem mutações. A exportação remove `texto`, `editavel` e `visao`; metadados identificam a variante, mas não carregam uma segunda cópia da fonte XML.

## Recuperação do Assistente

Falha de rede/configuração/serviço mostra indisponibilidade e modo local opcional; 429 explica limite, 410 explica sessão expirada, AbortError explica espera excedida. Recuperar mensagem respeita rascunho novo; anexos permanecem até sucesso ou remoção explícita. Nenhuma recuperação reenvia ou muda modo silenciosamente. Detalhes técnicos recebidos do servidor não são apresentados como mensagem principal.

O botão `+` no compositor concentra arquivo, XML atual e conteúdo colado. O conteúdo explícito continua sendo enviado somente com a próxima mensagem e aparece como item pendente removível. `renderizarChatPreservandoScroll` acompanha atualizações quando a conversa está até 80 px do fim; fora dessa faixa preserva a posição de leitura até o usuário retornar ao fim.

## Verificação e recuperação da migração

Executar na raiz do repositório: `npm test`, `npm run build`, `npm run audit:browser`. `$env:AUDIT_MATRIX='1'; npm run audit:browser` captura os temas/larguras e estados da sidebar no PowerShell. A auditoria local remove dependências CDN para verificar degradação offline, observa exceções, erros e avisos do console, testa a busca global entre ambientes e aplica limites de 20 KB ao runtime Lucide, 600 KB ao JavaScript local, 150 KB ao CSS local e 2.500 nós DOM. SVGs do shell/registry e logo continuam visíveis. Inspecionar também integração com Bootstrap quando disponível.

Baseline atual: 105 testes verdes; a auditoria de navegador percorre as oito telas sem overflow, controles ou marcos sem nome, foco fora da viewport ou foco sem contorno, com console limpo. A matriz visual cobre 128 combinações de oito painéis, dois temas, quatro larguras (360, 768, 1280 e 1920 px) e dois estados da sidebar sem falhas, inclusive alcance vertical da navegação. As evidências e o backup anterior à implementação foram preservados no arquivo `refactor-ui-evidence.zip` da Release de snapshots legados. Restaurar HTML, assets, scripts e testes como conjunto, nunca apagar localStorage. Para rollback com preferências migradas, adaptar o leitor antigo de favoritos para reconhecer `conteiner-lacre`; preservar a versão da migração evita remapear contêiner simples em recargas.
