# Interface da FUTURE G

## Responsabilidades

- `interface.js`: shell FUTURE G, marca, ambiente, header, abas/teclado, tema e sidebar. A ordem, os rótulos, as descrições, os ícones, os grupos e a disponibilidade das abas vêm de `APP_NAVIGATION`. Um controle SVG com nome dinâmico, aria-expanded e tooltip CSS em hover/foco; navegação estreita fecha em rail após seleção, Escape devolve foco. Preferências permanecem em `thegenerator:sidebar-collapsed` e `futureg:environment`.
- `generator-registry.js`: fonte canônica de `APP_ENVIRONMENTS`, `APP_NAVIGATION`, `GENERATORS` e categorias. Cada gerador declara ambientes, rota, palavras-chave e capacidades; projeções reutilizáveis alimentam Home, workspace e lote. `TIPOS_DADOS` continua sendo o contrato completo usado pelos motores e pela API. Carrega após storage e antes dos consumidores; callbacks só executam após inicialização dos motores.
- `generator-workspace.js`: seleção e abertura por ID, configuração, geração individual e apresentação de detalhes/limpeza. `openGenerator(id)` nunca preenche busca nem gera automaticamente; `activateGenerator(id)` representa a ativação do usuário e executa imediatamente apenas opções simples. O botão Gerar fica visível para todo gerador individual selecionado; `requiresConfiguration` mantém a configuração de Telefone e Placa antes da geração; Crachá gera imediatamente com as opções atuais. Desconhecidos mantêm resultado e recebem feedback. Placa é uma única área com seletor de padrão; `placa-antiga` permanece como alias não descobrível que seleciona a variante antiga. `cadastro` abre Cadastro Geral; NF-e/CT-e selecionam documento XML. O resultado documental conserva texto exportável e projeção estruturada como estados separados; o scroll interno volta ao topo somente após uma nova renderização.
- `home-dashboard.js`: descoberta, favoritos, recentes e busca. Não mantém resultado próprio nem duplica os motores; uma opção simples ativa o workspace e gera ali imediatamente. `/` focaliza busca; Ctrl+Enter é um atalho opcional, também informado pelo título e por `aria-keyshortcuts` do botão Gerar.
- `productivity.js`: busca global `Ctrl+K`, projeções do painel por ambiente e atividade operacional resumida. A busca reúne destinos e geradores do registry, mantém o foco dentro do diálogo e respeita o ambiente ativo. A atividade usa uma lista explícita de campos e nunca grava o conteúdo gerado.
- `visual-disclosure.js`: apresentação de disclosures nativos, ações contextuais, Escape/clique externo, posicionamento dos popovers dentro da viewport, abertura de edição e acesso à privacidade. Mantém controles e valores originais; não contém geração, validação de negócio nem persistência. Erros de validação nativa abrem disclosures ancestrais antes de receber foco.
- `development-generators.js`: regras puras para UUID v4, endereços IPv4/IPv6 reservados para documentação e MAC local/unicast. É carregado antes de `geracao-dados.js`; registry, resultado, histórico e lote continuam compartilhados.
- `finance-generators.js`: regras puras para valor BRL, EVP Pix não registrada e referência de transação marcada como teste. Não modela conta, cartão, boleto, credencial ou pagamento real.
- `cadastro.js`: adapta Cadastro geral ao ambiente. Em `general`, define os cinco grupos da ficha, aplica a seleção à geração e deriva dela a apresentação seccionada e a cópia em texto. Em `port`, oferece uma ficha completa por tipo de pessoa, empresa, veículo, contêiner, carga ou documento. O histórico distingue os dois contratos e restaura também o ambiente correto; registros gerais legados têm os grupos inferidos pelos campos preenchidos em `historico.js`.
- `badge-generators.js`: contrato estruturado e apresentação do crachá sintético. `CRACHA_MODELOS` contém o modelo Funcionário e é o ponto de extensão para Motorista, Visitante e Terceirizado; o workspace, o histórico e o lote continuam compartilhados.
- `port-generators.js`: regras estruturadas do QA Portuário para perfis, entidades empresariais, cavalo/carreta/conjunto, contêiner ISO 6346, cargas com NCM e documentos portuários. Cada motor expõe uma projeção essencial para o gerador individual e a estrutura completa para Cadastro geral, sem duplicar a geração. Registry, resultado, histórico, lote, exportação e Assistente permanecem compartilhados.
- Motores existentes continuam responsáveis por geração, formatação, validação e XML. Estado individual (`currentType/currentValue`), lote e cadastro são distintos porque representam operações distintas; não existe cópia do mesmo resultado na Home.

Lote aparece depois do resultado individual e antes do histórico. `limparLoteInterface` apaga somente `ultimoLote`, prévia e ações de exportação; seleção, opções e resultado individual permanecem. No XML fiscal, a lista `gerador:ncms_manuais` aceita até 50 NCMs únicos de oito dígitos e os aplica em ordem aos produtos atuais sem substituir o catálogo.

## Persistência e compatibilidade

Favoritos e recentes persistem somente IDs, com limites 8 e 5. Migração versão 1 converte `conteiner` antigo da Home em `conteiner-lacre` uma vez. `conteiner` do domínio e históricos não muda. Uso bem-sucedido atualiza recentes; não há histórico adicional no controller. Históricos conservam formatos e chaves atuais.

A atividade produtiva usa `futureg:activity-v1`, limitada a 50 entradas normalizadas com `target`, `environment`, `kind`, `quantity` e `timestamp`. Campos adicionais, resultados, prompts, anexos, chaves e tokens são descartados. Cada dashboard filtra essa lista pelo ambiente e permite limpar somente sua própria projeção.

O ambiente do shell é `general` ou `port`. `definirAmbiente` atualiza `body[data-environment]`, rótulos, estado pressionado e navegação, depois emite `futureg:environmentchange`, sem reload. Home, categorias, favoritos, recentes, workspace e lote consomem a projeção ativa do registry. Preferências incompatíveis ficam ocultas sem serem apagadas. Se a ferramenta selecionada não existir no novo ambiente, a aplicação retorna à Home e preserva resultados e históricos; restaurar um histórico troca para o ambiente compatível.

Os geradores de domínio pertencem a um único ambiente. CPF, nome, CNPJ, empresa, telefone, placas e utilitários gerais pertencem a `general`; perfis e empresas portuárias, veículos de carga, contêineres, cargas, booking, DI, DUIMP, DU-E e documentos de carga pertencem a `port`. NF-e, CT-e e Cadastro geral são compartilhados. O workspace XML sempre oferece os dois documentos e pode exibir os dois formulários juntos, sem reagir ao switch de ambiente; validação e anexo do Assistente também preservam as duas opções. Cadastro geral muda o formulário conforme o ambiente: a ficha geral não recebe campos portuários, enquanto a ficha de QA Portuário concentra os dados completos que não aparecem nos geradores individuais enxutos. Preferências e históricos incompatíveis permanecem preservados, porém ocultos no outro contexto. A lista manual de NCM continua compartilhada: alimenta produtos de NF-e em `general` e cargas em `port`.

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

Tokens semânticos de cor ficam em `base.css`: `--background`, `--sidebar`, `--surface`, `--surface-elevated`, `--surface-hover`, `--border`, `--border-strong`, `--text-primary`, `--text-secondary`, `--text-muted`, `--primary`, `--primary-hover`, `--primary-soft`, `--border-focus`, `--success`, `--warning`, `--danger`, `--ai` e suas superfícies suaves. Ambos os ambientes compartilham superfícies neutras e interação azul; roxo fica reservado a detalhes de IA. Labels, ícones e conteúdo distinguem os ambientes. Aliases antigos (`--bg`, `--text`, `--accent`, `--error` etc.) são resolvidos no body, para acompanhar os tokens do tema ativo. Não declarar aliases dependentes de tema somente no :root, pois o valor herdado seria resolvido antes da seleção do tema.

`--ui-space-0` a `--ui-space-6` correspondem a 4, 8, 12, 16, 24, 32 e 48 px; radii de 8/12/16 px e controles de 44 px continuam compartilhados. Inter é a fonte de interface; monospace fica nos identificadores/XML. `ui-primary`, `ui-secondary`, `ui-ghost` e `ui-danger` expressam hierarquia. `ui-disclosure` e `action-disclosure` reutilizam details/summary, com nomes acessíveis e foco visível. Resultados vazios permanecem visíveis; ações sem valor ficam desabilitadas. `mostrarStatus` preserva o anúncio live. Bootstrap continua disponível para modais/tooltips existentes.

shadcn/ui não é compatível com a stack atual sem introduzir React/Tailwind e uma reescrita. Lucide vanilla `1.44.0` é compatível e constitui o conjunto padrão: `scripts/build-icons.cjs` extrai os 51 ícones utilizados para `assets/js/lucide.min.js`, mantendo a API `window.lucide`; `assets/js/icons.js` converte ícones estáticos e dinâmicos. O build regenera esse runtime, atualmente com 11.744 bytes, dentro do orçamento de 20 KB. A identidade visual continua definida pelos tokens FUTURE G, não pela biblioteca.

## Divulgação progressiva

Home mantém busca, ferramentas e recentes; favoritos, painel e atividade ficam recolhidos. Dados mantém descoberta, configuração essencial e resultado; máscara/nome, lote, histórico e conferência de documentos usam disclosures. XML fiscal restaura a organização anterior: documento, geração, campos, cenários, NCMs e ações da prévia ficam diretamente disponíveis. Cadastro mantém grupos ou tipo de entidade e o resultado; Editar dados abre o formulário geral existente. O Assistente mantém mensagem, anexo e enviar; modo, máscara, nova conversa e privacidade ficam nas opções contextuais. Nenhum campo é clonado, desabilitado ou apagado ao recolher uma seção.

O resultado estruturado preserva a prévia atual de até quatro campos e o conteúdo completo em detalhes/cópia/download/histórico. A auditoria usa uma fixture longa para verificar a rolagem interna sem impor que Motorista individual contenha os campos exclusivos do cadastro completo.

CSS foi consolidado por seletor/condição e transferido ao dono; regras de shell e layout documental antigas foram substituídas. Inventário de origem/destino em `../../artifacts/refactor-the-generator-ui/css-ownership.json`. Alterar regra existente em seu dono, não acrescentar uma versão ao fim de outro arquivo.

## Relatório da Validação XML

`assets/js/validacao-xml.js` mantém uma única coleção `relatoriosXml` para conteúdo colado, arquivos, documento do gerador, artefatos da IA e variantes negativas. Cada relatório contém resumo, fonte local, metadados e achados estruturados; Resumo, XML e Validação são somente projeções desse objeto. O filtro de severidade e a aba selecionada são estados de apresentação e não removem achados.

As variantes negativas clonam `xmlsGerados` antes de qualquer alteração e retornam ao mesmo `analisarXml`. O XML-base, o editor e o gerador fiscal não recebem mutações. A exportação remove `texto`, `editavel` e `visao`; metadados identificam a variante, mas não carregam uma segunda cópia da fonte XML.

## Recuperação do Assistente

Falha de rede/configuração/serviço mostra indisponibilidade e modo local opcional; 429 explica limite, 410 explica sessão expirada, AbortError explica espera excedida. Recuperar mensagem respeita rascunho novo; anexos permanecem até sucesso ou remoção explícita. Nenhuma recuperação reenvia ou muda modo silenciosamente. Detalhes técnicos recebidos do servidor não são apresentados como mensagem principal.

O botão `+` no compositor concentra arquivo, XML atual e conteúdo colado. O conteúdo explícito continua sendo enviado somente com a próxima mensagem e aparece como item pendente removível. `renderizarChatPreservandoScroll` acompanha atualizações quando a conversa está até 80 px do fim; fora dessa faixa preserva a posição de leitura até o usuário retornar ao fim.

## Verificação e recuperação da migração

Executar na raiz do repositório: `npm test`, `npm run build`, `npm run audit:browser`. `$env:AUDIT_MATRIX='1'; npm run audit:browser` captura os temas/larguras e estados da sidebar no PowerShell. A auditoria local remove dependências CDN para verificar degradação offline, observa exceções, erros e avisos do console, testa a busca global entre ambientes e aplica limites de 20 KB ao runtime Lucide, 600 KB ao JavaScript local, 150 KB ao CSS local e 2.500 nós DOM. Também verifica Abrir no editor pela ação direta do XML, com foco no painel visível e cópia integral, e NF-e/CT-e carregados no Editor em 360 px nos dois temas. Abas de arquivos/ferramentas quebram linha e cards/campos respeitam a largura disponível. SVGs do shell/registry e logo continuam visíveis. Inspecionar também integração com Bootstrap quando disponível.

Baseline atual: a auditoria de navegador percorre as sete telas sem overflow, controles ou marcos sem nome, foco fora da viewport ou foco sem contorno, com console limpo. O resultado estruturado é verificado em desktop/mobile, inclusive labels, ações e reset do scroll interno sem deslocar a página. A matriz visual cobre os sete painéis, dois ambientes, dois temas, quatro larguras (360, 768, 1280 e 1920 px) e dois estados da sidebar: 224 combinações, inclusive alcance vertical da navegação, mais 56 estados com opções abertas. Evidências da correção atual e limites manuais estão em [XML e crachá](xml-layout-and-direct-badge.md); a [Revisão visual](visual-system-refresh.md) registra a alpha.4. As evidências e o backup da migração anterior foram preservados no arquivo `refactor-ui-evidence.zip` da Release de snapshots legados. Restaurar HTML, assets, scripts e testes como conjunto, nunca apagar localStorage. Para rollback com preferências migradas, adaptar o leitor antigo de favoritos para reconhecer `conteiner-lacre`; preservar a versão da migração evita remapear contêiner simples em recargas.
