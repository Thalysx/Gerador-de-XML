# Changelog

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/). O histórico detalhado anterior à adoção deste arquivo permanece em `ATUALIZACOES.md`.

## [Não publicado]

## [3.0.0-alpha.7] — 2026-10-05

- Assistente passa a usar apenas comandos locais, sem modo IA ou chamadas remotas de chat. As rotas antigas retornam HTTP 410.
- Catálogo completo por ambiente, sugestões enquanto digita, favoritos e repetição do último comando.
- Comandos para gerar NF-e/CT-e isolados, consultar resumo, produtos e destinatário, validar localmente e criar cópias com erros intencionais.
- Anexos locais, fontes identificadas, erros recuperáveis e ações de cópia, download e Editor preservando os originais.
- Guia e verificação em `docs/local-commands.md`.

## [3.0.0-alpha.6] — 2026-10-05

- Placa passa a gerar imediatamente ao selecionar a opção, pela Home ou pela busca global, preservando o padrão escolhido (Mercosul ou antigo).
- Mantidos o seletor de formato, o botão Gerar, Ctrl+Enter opcional e um único registro de histórico por ação; navegação e alias de placa antiga permanecem compatíveis.
- Relatório da correção em `docs/direct-plate-generation.md`.

## [3.0.0-alpha.5] — 2026-10-05

- Crachá passa a gerar imediatamente ao ativar a opção, inclusive pela Home e busca global, usando as opções atuais. Gerar e Ctrl+Enter permanecem disponíveis para regeneração.
- XML Fiscal recupera a organização anterior à revisão visual, com campos, cenários, NCMs, configuração e ações diretamente disponíveis. Preservados o padrão de cores e o foco ao abrir uma cópia no Editor.
- Verificação: 118 testes, build e auditoria Chromium aprovados; 280 estados responsivos sem overflow. Relatório em `docs/xml-layout-and-direct-badge.md`.

## [3.0.0-alpha.4] — 2026-10-05

### Interface — 2026-10-05

- Botão Gerar disponível por clique para todos os geradores individuais selecionados; Ctrl+Enter permanece opcional, sem selo no texto do botão.
- Aplicado o plano visual atualizado: superfícies neutras nos dois ambientes/temas, azul para interação, cores semânticas para estados e roxo nos detalhes de IA.
- Home, Dados, XML Fiscal, Cadastro e Assistente passam a priorizar tarefa e resultado; configurações e ações complementares ficam disponíveis sob demanda. Editor e Validação acompanham os tokens compartilhados.
- Corrigidos foco na navegação contextual ao Editor e largura das abas/cards/campos com NF-e e CT-e carregados no celular; título e importação passam a identificar XML.
- Preservados os motores, dados, APIs e armazenamento. Verificação: 117 testes, build, 13 itens OpenSpec, auditoria Chrome e 280 estados responsivos mais quatro casos do Editor carregado aprovados. Relatório em `docs/visual-system-refresh.md`.

### Documentação — 2026-10-05

- Arquivada `simplify-visual-system-and-workspaces`, com 8 de 8 tarefas concluídas e especificações canônicas sincronizadas.
- Arquivada `normalize-legacy-openspec-specs`, com 8 de 8 tarefas concluídas e normalização de cinco especificações canônicas sem mudança de comportamento.
- Registrado o encerramento das changes ativas e o cancelamento da fase 13B (integração SEFAZ) por decisão do usuário; a validação fiscal local da fase 13A permanece concluída.

## [3.0.0-alpha.3] — 2026-09-30

### Roadmap

- O refinamento consolidado de interface passa a ser FUTURE 12.
- A validação fiscal foi deslocada para FUTURE 13A/13B/13C, preservando o escopo planejado.

### Alterado

- Validação XML ganhou XSD first-party para NF-e/CT-e 4.00, schemas oficiais imutáveis, origem dos achados e estados separados de cobertura; CT-e 3.00 permanece local e explicitamente não suportado por XSD.
- O seletor de papel da empresa na NF-e pode aplicar o cadastro a Emitente, Destinatário e Transportadora de uma vez.
- Resultados compostos usam uma lista semântica de labels e valores em duas colunas no desktop e uma no mobile, sem aparência de terminal.
- Chaves técnicas recebem labels amigáveis, enquanto campos extensos usam toda a largura disponível.
- Texto livre mantém fallback convencional; a projeção visual não altera o texto integral usado por Copiar, Baixar TXT, detalhes e histórico.

### Corrigido

- Um novo resultado restaura o topo do próprio painel somente depois da renderização, sem mover a página ou interferir com leitura, cópia, download, resize e rolagem manual.

### Verificação

- 107 testes automatizados e build aprovados.
- Auditoria em Chrome aprovou 16 campos do Motorista, labels amigáveis, duas/uma colunas, scroll interno `264 → 0`, página `80 → 80`, console limpo e 231 passos de teclado.
- Matriz responsiva de 128 combinações aprovada sem falhas.

## [3.0.0-alpha.2] — 2026-09-30

### Corrigido

- Servidor local entrega manifesto, favicon, SVGs e PNGs públicos com MIME correto sem expor arquivos internos.
- Geradores Gerais mantém somente NF-e e QA Portuário somente CT-e em prévia, download, validação e estado atual.
- Resumo de CT-e identifica `dest` como destinatário, sem usar o remetente.
- Troca de painel retorna ao topo e a sidebar permanece inteiramente alcançível em viewport baixa ou zoom de 200%.
- Valores longos quebram somente quando necessário, sem fragmentar identificadores arbitrariamente.
- Link de salto, transições, tooltips e redução de movimento foram harmonizados.

### Verificação

- 105 testes automatizados, build público, auditoria das oito telas em 200% e matriz de 128 combinações aprovados.
- Auditoria agora reprova foco fora da viewport e navegação vertical sem rolagem acessível.
- Roadmap consolidado registrado e change da fase 13A aberta somente para especificação da validação fiscal local.

## [3.0.0-alpha.1] — 2026-09-25

### Adicionado

- Shell FUTURE G com identidade azul-marinho/azul.
- Seletor persistente entre Geradores Gerais e QA Portuário.
- OpenSpec versionado junto do código.
- Histórico formal de versões e snapshots legados.

### Alterado

- Pacote renomeado de `thegenerator` para `future-g`.
- Ativos públicos e documentação normalizados para FUTURE G.
- Aplicação consolidada em uma única fonte ativa.
- Assistente recebeu auto-scroll respeitoso e anexos no compositor por botão `+`.
- Lote foi movido para depois do resultado individual, com limpeza isolada.
- Placas Mercosul/antiga foram reunidas em uma área com seletor de padrão.
- XML fiscal recebeu lista validada de NCMs manuais e a validação identifica arquivos selecionados ou arrastados.
- Geradores simples passaram a gerar diretamente ao serem ativados; Telefone e Placa mantêm configuração explícita.
- Busca e filtros de Dados cadastrais foram movidos para o topo e categorias primárias deixaram de usar accordions.
- O resultado ganhou empty state persistente e feedback funcional para copiar e gerar novamente.
- O Assistente passou a ocupar toda a área útil do shell sem card externo redundante.
- Cadastro Geral deixou de misturar contêiner e lacre, que permanecem no QA Portuário.
- Bootstrap Icons e SVGs manuais de interface foram substituídos por Lucide vanilla versionado localmente.
- RG (padrão SP) e CNH passaram a usar regras explícitas de dígitos verificadores, com validação e cobertura de lote.
- Nome fantasia, endereço completo, CEP sintético e RENAVAM passaram a integrar o registry, a geração individual e os lotes de Geradores Gerais.
- UUID v4, IPv4/IPv6 de documentação e MAC local passaram a compor os utilitários de desenvolvimento, com geração individual e em lote.
- Valor em BRL, chave Pix EVP sintética e ID explícito de transação de teste foram adicionados sem criar instrumentos financeiros reais.
- Cadastro Geral recebeu seleção dos cinco grupos da ficha, resultado seccionado e restauração compatível de históricos sem metadados de grupo.
- Crachá tornou-se um gerador individual com cartão visual, modelo inicial Funcionário, código de barras ilustrativo opcional, histórico e exportação estruturada.
- A integração final da fase validou os 14 novos geradores no registry, busca, favoritos, recentes, lote heterogêneo e exportações JSON/CSV/TXT.
- A validação XML passou a produzir achados estruturados com severidade, tag, valor, caminho e posição de sintaxe quando disponíveis.
- Relatórios XML receberam visões Resumo, XML e Validação, além de exportação JSON sem o conteúdo-fonte.
- NF-e e CT-e podem gerar sete variantes intencionalmente inválidas para QA sem alterar o documento-base.
- Geradores Gerais e QA Portuário passaram a ter catálogos, XMLs e sugestões exclusivos: NF-e e dados gerais ficam no primeiro; CT-e e dados portuários ficam no segundo.
- Geradores Gerais recuperou a identidade roxa nos temas claro e escuro; QA Portuário mantém a identidade azul e cada ambiente usa sua própria marca lateral.
- O lote de Cadastro Geral deixou de produzir contêiner e lacre também no contrato de dados, eliminando o último vazamento portuário fora da apresentação.
- QA Portuário recebeu perfis, empresas, veículos, contêineres ISO 6346, cargas com NCM e documentos especializados, todos integrados ao registry, busca, lote, exportação e Assistente.
- QA Portuário recebeu dez cenários operacionais coerentes com referências estáveis entre motorista, veículo, contêiner, carga e etapas do fluxo.
- Cenários podem ser gerados nos modos Válido, Inválido intencional e Aleatório, além de copiados, baixados e restaurados do histórico local.
- A busca global `Ctrl+K` passou a localizar geradores e áreas somente no ambiente ativo, com navegação completa pelo teclado.
- A Home recebeu dashboards específicos para Geradores Gerais e QA Portuário, alimentados por atividade resumida que não persiste valores gerados ou segredos.
- Lotes compatíveis ganharam downloads JSON, CSV e TXT com nomes contextuais por ambiente e gerador, mantendo todos os registros além da prévia visual.
- A documentação fiscal do ambiente foi alinhada à separação vigente: NF-e permanece nos Geradores Gerais e CT-e no QA Portuário.
- O build passou a gerar um runtime Lucide local com somente 49 ícones, reduzindo esse ativo de 433.756 para 11.467 bytes.
- A validação de arquivos XML passou a anunciar processamento com `aria-busy`, status ao vivo e bloqueio temporário da entrada.
- O auditor de navegador passou a verificar a busca global entre ambientes, exceções/erros/avisos de console e orçamentos de JavaScript, CSS, ícones e DOM.
- A revisão responsiva final cobriu 128 combinações das oito telas, dois temas, quatro larguras e dois estados da sidebar sem falhas.

### Compatibilidade

- Chaves locais `thegenerator:*` continuam suportadas.
- Regras de geração, XML, lote e IA permanecem inalteradas.

## [2.1.1] — 2026-09-23

- Publicação e verificação visual da linha TheGenerator.

## [2.1.0] — 2026-09-21

- Melhorias de interface, acessibilidade e Assistente.

## [2.0.0] — 2026-09-18

- Geradores, chat, fluxo XML e navegação lateral consolidados.
