# Interface da FUTURE G

O padrão visual vigente está em [DESIGN.md](../DESIGN.md). Este documento detalha as responsabilidades e contratos técnicos que o sustentam; planos e relatórios antigos não substituem essa referência.

## Responsabilidades

- `interface.js`: shell FUTURE G, marca, catálogo, header, abas/teclado, tema e sidebar. A ordem, os rótulos, as descrições, os ícones, os grupos e a disponibilidade das abas vêm de `APP_NAVIGATION`. Um controle SVG com nome dinâmico, aria-expanded e tooltip CSS em hover/foco; navegação estreita fecha em rail após seleção, Escape devolve foco. A sidebar persiste em `thegenerator:sidebar-collapsed`; `futureg:environment` legado é preservado, mas não filtra ferramentas.
- `generator-registry.js`: fonte canônica de `APP_ENVIRONMENTS`, `APP_NAVIGATION`, `GENERATORS` e categorias. Cada gerador declara ambientes, rota, palavras-chave e capacidades; projeções reutilizáveis alimentam Home, workspace e lote. `TIPOS_DADOS` continua sendo o contrato completo usado pelos motores e pela API. Carrega após storage e antes dos consumidores; callbacks só executam após inicialização dos motores.
- `generator-workspace.js`: seleção e abertura por ID, configuração, geração individual e apresentação de detalhes/limpeza. `openGenerator(id)` nunca preenche busca nem gera automaticamente; `activateGenerator(id)` representa a ativação do usuário e executa imediatamente apenas opções simples. O botão Gerar fica visível para todo gerador individual selecionado; `requiresConfiguration` mantém a configuração de Telefone antes da geração; Crachá e Placa geram imediatamente com as opções atuais. Desconhecidos mantêm resultado e recebem feedback. Placa é uma única área com seletor de padrão, retido durante a ativação do usuário; `placa-antiga` permanece como alias não descobrível que seleciona a variante antiga. `cadastro` abre Cadastro Geral; NF-e/CT-e selecionam documento XML. O resultado documental conserva texto exportável e projeção estruturada como estados separados; o scroll interno volta ao topo somente após uma nova renderização.
- `home-dashboard.js`: descoberta, favoritos, recentes e busca. Não mantém resultado próprio nem duplica os motores; uma opção simples ativa o workspace e gera ali imediatamente. `/` focaliza busca; Ctrl+Enter é um atalho opcional, também informado pelo título e por `aria-keyshortcuts` do botão Gerar.
- `productivity.js`: busca global `Ctrl+K`, painel de todo o catálogo e atividade operacional resumida. A busca reúne destinos e geradores do registry, mantém o foco dentro do diálogo e pesquisa todos os domínios. A atividade usa uma lista explícita de campos e nunca grava o conteúdo gerado.
- `visual-disclosure.js`: apresentação de disclosures nativos, ações contextuais, Escape/clique externo, posicionamento dos popovers dentro da viewport, abertura de edição e acesso à privacidade. Mantém controles e valores originais; não contém geração, validação de negócio nem persistência. Erros de validação nativa abrem disclosures ancestrais antes de receber foco.
- `development-generators.js`: regras puras para UUID v4, endereços IPv4/IPv6 reservados para documentação e MAC local/unicast. É carregado antes de `geracao-dados.js`; registry, resultado, histórico e lote continuam compartilhados.
- `finance-generators.js`: regras puras para valor BRL, EVP Pix não registrada e referência de transação marcada como teste. Não modela conta, cartão, boleto, credencial ou pagamento real.
- `cadastro.js`: seleciona o formulário pelo único seletor `cad-port-tipo`: `perfil` mantém os cinco grupos e edição existentes; os demais valores usam os motores completos de pessoas, empresas, veículos, contêineres e cargas. O histórico seleciona o tipo correto sem trocar o catálogo ou alterar os formatos salvos.
- `badge-generators.js`: contrato estruturado e apresentação do crachá sintético. `CRACHA_MODELOS` contém o modelo Funcionário e é o ponto de extensão para Motorista, Visitante e Terceirizado; o workspace, o histórico e o lote continuam compartilhados.
- `port-generators.js`: regras estruturadas do QA Portuário para perfis, entidades empresariais, cavalo/carreta/conjunto, contêiner ISO 6346, cargas com NCM e documentos portuários. Cada motor expõe uma projeção essencial para o gerador individual e a estrutura completa para Cadastro geral, sem duplicar a geração. Registry, resultado, histórico, lote, exportação e Assistente permanecem compartilhados.
- Motores existentes continuam responsáveis por geração, formatação, validação e XML. Estado individual (`currentType/currentValue`), lote e cadastro são distintos porque representam operações distintas; não existe cópia do mesmo resultado na Home.

Lote aparece depois do resultado individual e antes do histórico. `limparLoteInterface` apaga somente `ultimoLote`, prévia e ações de exportação; seleção, opções e resultado individual permanecem. No XML fiscal, a lista `gerador:ncms_manuais` aceita até 50 NCMs únicos de oito dígitos e os aplica em ordem aos produtos atuais sem substituir o catálogo.

## Persistência e compatibilidade

Favoritos e recentes persistem somente IDs, com limites 8 e 5. Migração versão 1 converte `conteiner` antigo da Home em `conteiner-lacre` uma vez. `conteiner` do domínio e históricos não muda. Uso bem-sucedido atualiza recentes; não há histórico adicional no controller. Históricos conservam formatos e chaves atuais.

A atividade produtiva usa `futureg:activity-v1`, limitada a 50 entradas normalizadas com `target`, `environment`, `kind`, `quantity` e `timestamp`. Campos adicionais, resultados, prompts, anexos, chaves e tokens são descartados. O painel apresenta juntos registros legados `general`/`port` e novos registros `unified`; Limpar atividade remove a lista inteira, conforme o rótulo explícito.

O contexto do shell é único, `unified`. Não há seletor global de ambientes. Home, categorias, favoritos, recentes, workspace, lotes e comandos compartilham o catálogo. `definirAmbiente` e o evento legado permanecem como compatibilidade, mas não reativam filtros globais; a preferência antiga não é apagada.

Os metadados `general`/`port` permanecem como classificação de domínio e leitura de dados antigos, sem restringir a UI. NF-e e CT-e continuam juntos, sem alterações fiscais. Cadastro usa um seletor de tipo de ficha e preserva seus dois formatos de histórico. Favoritos de comandos são a união distinta das listas antigas enquanto não existir `futureg:comandos-favoritos:unified`; a lista unificada suporta vinte textos e suas remoções persistem sem ressuscitar entradas legadas. As chaves antigas ficam intactas. NCMs manuais continuam compartilhados pelos motores existentes.

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

Tokens semânticos de cor ficam em `base.css`: `--background`, `--sidebar`, `--surface`, `--surface-elevated`, `--surface-hover`, `--border`, `--border-strong`, `--text-primary`, `--text-secondary`, `--text-muted`, `--primary`, `--primary-hover`, `--primary-soft`, `--border-focus`, `--success`, `--warning`, `--danger`, `--ai` e suas superfícies suaves. As ferramentas compartilham superfícies neutras e interação azul; a alpha.7 usa azul também para os comandos locais. Os tokens IA permanecem apenas como aliases históricos sem superfície ativa. Categorias e tipos distinguem as ferramentas. Aliases antigos (`--bg`, `--text`, `--accent`, `--error` etc.) são resolvidos no body, para acompanhar os tokens do tema ativo. Não declarar aliases dependentes de tema somente no :root, pois o valor herdado seria resolvido antes da seleção do tema.

`--ui-space-0` a `--ui-space-6` correspondem a 4, 8, 12, 16, 24, 32 e 48 px; radii de 8/12/16 px e controles de 44 px continuam compartilhados. Inter é a fonte de interface; monospace fica nos identificadores/XML. `ui-primary`, `ui-secondary`, `ui-ghost` e `ui-danger` expressam hierarquia. `ui-disclosure` e `action-disclosure` reutilizam details/summary, com nomes acessíveis e foco visível. Resultados vazios permanecem visíveis; ações sem valor ficam desabilitadas. `mostrarStatus` preserva o anúncio live. Bootstrap continua disponível para modais/tooltips existentes.

shadcn/ui não é compatível com a stack atual sem introduzir React/Tailwind e uma reescrita. Lucide vanilla `1.44.0` é compatível e constitui o conjunto padrão: `scripts/build-icons.cjs` extrai os 51 ícones utilizados para `assets/js/lucide.min.js`, mantendo a API `window.lucide`; `assets/js/icons.js` converte ícones estáticos e dinâmicos. O build regenera esse runtime, atualmente com 11.744 bytes, dentro do orçamento de 20 KB. A identidade visual continua definida pelos tokens FUTURE G, não pela biblioteca.

## Divulgação progressiva

Home mantém busca, ferramentas e recentes; favoritos, painel e atividade ficam recolhidos. Dados mantém descoberta, configuração essencial e resultado; máscara/nome, lote, histórico e conferência de documentos usam disclosures. XML fiscal restaura a organização anterior: documento, geração, campos, cenários XML salvos, NCMs e ações da prévia ficam diretamente disponíveis. Cadastro mantém grupos ou tipo de entidade e o resultado; Editar dados abre o formulário geral existente. Comandos locais mantém mensagem, anexo e enviar; catálogo, favoritos, máscara e nova conversa ficam nas opções contextuais, com privacidade nas configurações. Nenhum campo é clonado, desabilitado ou apagado ao recolher uma seção.

O resultado estruturado preserva a prévia atual de até quatro campos e o conteúdo completo em detalhes/cópia/download/histórico. A auditoria usa uma fixture longa para verificar a rolagem interna sem impor que Motorista individual contenha os campos exclusivos do cadastro completo.

CSS foi consolidado por seletor/condição e transferido ao dono; regras de shell e layout documental antigas foram substituídas. Inventário de origem/destino em `../../artifacts/refactor-the-generator-ui/css-ownership.json`. Alterar regra existente em seu dono, não acrescentar uma versão ao fim de outro arquivo.

## Relatório da Validação XML

`assets/js/validacao-xml.js` mantém uma única coleção `relatoriosXml` para conteúdo colado, arquivos, documento do gerador, cópias de teste e variantes negativas. Cada relatório contém resumo, fonte local, metadados e achados estruturados; Resumo, XML e Validação são somente projeções desse objeto. O filtro de severidade e a aba selecionada são estados de apresentação e não removem achados.

Uma versão identifica a análise atual. Iniciar outra análise invalida o upload anterior e libera seus controles; só o upload ainda atual pode publicar e encerrar seu estado ocupado. Leitura antiga concluída após substituição não inicia XSD. Na API, a vaga é reservada antes de aguardar o corpo; erros preliminares a devolvem, enquanto o motor conserva sua vaga até terminar, inclusive depois de timeout da resposta.

O Editor captura o grupo por lote de importação. Trocar de grupo mantém esse destino sem roubar a seleção atual. Limpar grupo cancela somente suas leituras; reset cancela todas. Erro, abort e exceção de leitura também concluem o lote, mantendo arquivos válidos acessíveis. Limpar um grupo vazio não reinicia a sessão enquanto houver importação válida pendente em outro grupo. Evidências em [Estados assíncronos](quality/async-xml.md).

As variantes negativas clonam `xmlsGerados` antes de qualquer alteração e retornam ao mesmo `analisarXml`. O XML-base, o editor e o gerador fiscal não recebem mutações. A exportação remove `texto`, `editavel` e `visao`; metadados identificam a variante, mas não carregam uma segunda cópia da fonte XML.

## Erros e anexos dos Comandos locais

Comandos inválidos mostram orientação local e preservam rascunho/anexo para revisão. Não há modo remoto, sessão de provedor, streaming de IA ou recuperação por troca de modo. Mensagens e anexos não são enviados a chat/status remotos. A etapa de rede XSD pertence à tela de Validação XML e preserva o relatório local quando o serviço fica indisponível.

O botão `+` concentra arquivo, XML atual e conteúdo colado como fonte disponível para os comandos. O chip pendente fica em uma linha própria e continua removível; nomes longos não disputam espaço com mensagem/Enviar. O anexo permanece até remoção ou Nova conversa, inclusive após um comando bem-sucedido. `renderizarChatPreservandoScroll` acompanha atualizações quando a conversa está até 80 px do fim; fora dessa faixa preserva a posição de leitura até o usuário retornar ao fim. A conversa mantém as dez últimas trocas nesta aba, sem persistir seus resultados.

## Verificação e recuperação da migração

Executar na raiz do repositório: `npm test`, `npm run build`, `npm run audit:browser`. `$env:AUDIT_MATRIX='1'; npm run audit:browser` captura os temas/larguras e estados da sidebar no PowerShell. A auditoria local remove dependências CDN para verificar degradação offline, observa exceções, erros e avisos do console, testa a busca global sem separação por ambiente e aplica limites de 20 KB ao runtime Lucide, 600 KB ao JavaScript local, 150 KB ao CSS local e 2.500 nós DOM. Também verifica Abrir no editor pela ação direta do XML, com foco no painel visível e cópia integral, e NF-e/CT-e carregados no Editor em 360 px nos dois temas. Abas de arquivos/ferramentas quebram linha e cards/campos respeitam a largura disponível. SVGs do shell/registry e logo continuam visíveis. Inspecionar também integração com Bootstrap quando disponível.

Baseline atual: a auditoria de navegador percorre as sete telas sem overflow, controles ou marcos sem nome, foco fora da viewport ou foco sem contorno, com console limpo. O resultado estruturado é verificado em desktop/mobile, inclusive labels, ações e reset do scroll interno sem deslocar a página. A matriz atual tem um único contexto, sete painéis, dois temas, quatro larguras (360, 768, 1280 e 1920 px) e dois estados da sidebar: 112 combinações, mais 28 estados com opções abertas. As 224/56 combinações anteriores são evidências históricas da interface dividida. Evidências da correção atual e limites manuais estão em [XML e crachá](xml-layout-and-direct-badge.md); a [Revisão visual](visual-system-refresh.md) registra a alpha.4. As evidências e o backup da migração anterior foram preservados no arquivo `refactor-ui-evidence.zip` da Release de snapshots legados. Restaurar HTML, assets, scripts e testes como conjunto, nunca apagar localStorage. Para rollback com preferências migradas, adaptar o leitor antigo de favoritos para reconhecer `conteiner-lacre`; preservar a versão da migração evita remapear contêiner simples em recargas.
