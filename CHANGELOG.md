# Changelog

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/). O histórico detalhado anterior à adoção deste arquivo permanece em `ATUALIZACOES.md`.

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
