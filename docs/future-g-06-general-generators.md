# FUTURE G 06 — Geradores Gerais

Fase concluída localmente em 26/09/2026, sem antecipar as fases de XML avançado ou QA Portuário.

## Incrementos concluídos

### Pessoa física

- RG permanece uma ferramenta individual e usa o formato declarado de São Paulo com verificador consistente.
- CNH gera onze dígitos com os dois verificadores consistentes.
- Ambos participam de geração individual, conferência local, lote e exportação.

### Empresa, endereço e veículo

- Nome fantasia reutiliza os vocabulários empresariais sintéticos existentes.
- Endereço completo reutiliza o gerador do Cadastro Geral e explicita que logradouro e CEP não representam correspondência postal real.
- CEP possui saída com ou sem máscara e não consulta base postal.
- RENAVAM gera onze dígitos. O verificador usa módulo 11 e pesos `3, 2, 9, 8, 7, 6, 5, 4, 3, 2`; restos 0 ou 1 produzem dígito zero.
- As quatro ferramentas pertencem somente a Geradores Gerais, usam o registry compartilhado e ficam disponíveis para busca, favoritos, recentes, lote e exportação.

### Desenvolvimento

- UUID v4 usa 128 bits aleatórios, fixa versão 4 e variante IETF e apresenta o formato textual canônico.
- IPv4 usa somente TEST-NET-1, TEST-NET-2 e TEST-NET-3, reservados para documentação.
- IPv6 usa somente o prefixo de documentação `2001:db8::/32`.
- Endereço MAC marca o primeiro octeto como unicast e administrado localmente, sem reivindicar fabricante.
- Os quatro utilitários são exclusivos de Geradores Gerais e participam de geração individual, busca, favoritos, recentes, lote e exportação.

### Finanças sintéticas

- Valor em BRL produz quantias positivas formatadas para cenários visuais e de exportação, sem representar saldo.
- Chave Pix EVP sintética reutiliza UUID v4 e é apresentada explicitamente como não registrada no DICT.
- ID de transação usa o prefixo `TX-TESTE`, data UTC e sufixo aleatório, sem significado de autorização ou liquidação.
- Não são gerados cartão, conta bancária, boleto, credencial ou QR Code de pagamento neste incremento.

### Cadastro Geral

- A ficha pode ser gerada com qualquer combinação de Identificação, Documentos, Contato, Endereço e Dados profissionais.
- “Selecionar tudo” e “Limpar seleção” alteram os cinco grupos em conjunto, com contagem anunciada em região viva.
- A geração exige ao menos um grupo, limpa os campos de grupos não selecionados e apresenta somente seções preenchidas no resultado.
- Cópia em texto acompanha a estrutura da ficha; JSON e histórico registram a seleção em `grupos`.
- Históricos anteriores continuam restauráveis: quando `grupos` não existe, a seleção é inferida pelos campos preenchidos.

### Crachá sintético

- O modelo inicial Funcionário gera avatar por iniciais, nome, código `CR-000000`, empresa, função, matrícula, validade e status.
- O cartão visual oferece regeneração pelo resultado compartilhado e uma ação direta para copiar o código.
- O código de barras é ilustrativo, opcional e usa uma referência com marcador `TESTE`; não representa padrão GS1 nem credencial física válida.
- Histórico e download individual preservam todos os campos. Lotes de até 500 itens mantêm propriedades separadas nas exportações JSON, CSV e TXT.
- `CRACHA_MODELOS` concentra metadados e funções do modelo, deixando Motorista, Visitante e Terceirizado como extensões futuras do mesmo contrato.

## Decisões

- Não foi criada uma segunda engine: `generator-registry.js` declara metadados e `geracao-dados.js` continua sendo o ponto comum de geração em lote.
- Empresa mantém CNPJ, CNPJ alfanumérico e razão social existentes; Nome fantasia complementa o grupo sem transformar Cadastro Geral em perfil portuário.
- Placa continua no workspace unificado Mercosul/antiga. RENAVAM complementa a categoria Veículo sem alterar essa compatibilidade.
- A conferência do RENAVAM valida somente a estrutura matemática, sem consultar existência, titularidade ou situação oficial.
- A fórmula foi conferida no comunicado oficial Siscomex Importação nº 064/2025: https://www.gov.br/siscomex/pt-br/noticias/noticias-siscomex-importacao/Comunicados/importacao-no-2025-064
- Utilitários de desenvolvimento ficam isolados em `assets/js/development-generators.js`; o arquivo contém apenas regras de geração e não cria uma nova interface ou engine de lote.
- UUID v4 segue o RFC 9562: https://www.rfc-editor.org/info/rfc9562/
- IPv4 usa os blocos de documentação do RFC 5737: https://www.rfc-editor.org/info/rfc5737/
- IPv6 usa o prefixo reservado pelo RFC 3849: https://www.rfc-editor.org/info/rfc3849/
- Fixtures financeiras ficam isoladas em `assets/js/finance-generators.js` e usam os mesmos fluxos de resultado, histórico, lote e exportação.
- O formato EVP foi conferido na documentação do DICT do Banco Central: https://aprendervalor.bcb.gov.br/content/estabilidadefinanceira/pix/API-DICT.html
- Os cinco grupos do Cadastro Geral são definidos uma vez em `cadastro.js`; essa definição orienta seleção, limpeza, ficha, texto copiado e migração transparente do histórico legado.
- O código simples de crachá usado no Cadastro Geral e o cartão completo reutilizam `gerarCodigoCracha`; regras e apresentação do cartão ficam isoladas em `badge-generators.js`.

## Verificação do incremento

- Testes cobrem descoberta por ambiente, registry, lote, máscara de CEP, formato de endereço, unicidade, verificador de 500 RENAVAMs, lotes de 500 valores de cada utilitário de desenvolvimento, fixture financeira e crachá, além de seleção vazia, parcial e total da ficha e restauração dos dois históricos.
- Uma matriz final percorre os 14 novos geradores em Home, Dados cadastrais, favoritos, recentes, isolamento de ambiente, lote heterogêneo e exportações JSON/CSV/TXT sem truncamento.
- `npm test`: 81 testes aprovados, 0 falhas.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: sete painéis aprovados em viewport CSS de 640 × 450, equivalente à escala de 200%; 231 passos de teclado, nenhum overflow horizontal, controle sem nome, foco invisível ou foco sem contorno.

## Relatório de conclusão

### Arquivos criados

- `assets/js/development-generators.js`
- `assets/js/finance-generators.js`
- `assets/js/badge-generators.js`
- `docs/future-g-06-general-generators.md`
- `openspec/changes/archive/2026-09-27-future-g-06-general-generators/` com proposta, design, tarefas e delta da especificação.

### Arquivos principais modificados

- `assets/js/generator-registry.js`, `geracao-dados.js`, `documentos.js`, `cadastro.js`, `historico.js`, `generator-workspace.js` e `chat.js`.
- `index.html`, `assets/css/documentos.css` e `assets/css/cadastro.css`.
- `tests/projeto.test.cjs`, `README.md`, `ATUALIZACOES.md`, `CHANGELOG.md`, `AUDITORIA-VISUAL.md` e `docs/ui-architecture.md`.

### Decisões arquiteturais

- Um único registry continua sendo a fonte de descoberta, busca, ambientes, favoritos, recentes e capacidades.
- Geração individual e em lote reutilizam as mesmas regras; utilitários isolam apenas lógica de domínio, sem criar engines ou shells paralelos.
- Exportações recebem registros estruturados do mesmo lote. O crachá mantém campos próprios em JSON/CSV/TXT e o formulário encaminha suas opções ao motor comum.
- Cadastro Geral preserva históricos anteriores e não readiciona campos portuários ao formulário.

### Riscos e limites conhecidos

- RG declara e valida somente o padrão de São Paulo; não é apresentado como regra nacional.
- CEP, endereço, RENAVAM, Pix EVP, transações e crachás são exclusivamente sintéticos e não consultam titularidade, existência ou situação oficial.
- O código de barras do crachá é ilustrativo e não implementa GS1. Motorista, Visitante e Terceirizado permanecem apenas como extensões arquiteturais futuras.
- A auditoria automatizada não substitui a validação auditiva manual com leitor de tela real.

## Encerramento

Todos os itens e o relatório de conclusão do OpenSpec 6 estão fechados. A fase 7 não foi iniciada automaticamente.
