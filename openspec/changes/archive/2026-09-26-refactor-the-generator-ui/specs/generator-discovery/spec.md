## Purpose
Permitir encontrar e abrir todos os geradores disponíveis de forma consistente, preservando a identidade de ferramentas e preferências.

## ADDED Requirements

### Requirement: Catálogo consistente
Home, busca, categorias, favoritos, recentes e Dados Cadastrais SHALL consumir o mesmo catálogo de geradores, com IDs únicos e capacidades e variantes explícitas. Busca textual SHALL servir somente para descoberta.

#### Scenario: Cobertura do catálogo
- **WHEN** o usuário procura um gerador existente, inclusive CPF, CNPJ, Telefone, Placa e variantes
- **THEN** os pontos de descoberta apresentam a identidade e o destino corretos sem perder ferramentas legadas

### Requirement: Abertura determinística
Selecionar uma ferramenta SHALL abrir seu workspace pelo ID, revelar configuração correspondente e preservar a variante independentemente de rótulo ou filtro anterior, sem escrever texto na busca como mecanismo de navegação e sem gerar implicitamente.

#### Scenario: Telefone com filtro incompatível
- **WHEN** o usuário abre Telefone pela Home com Dados Cadastrais anteriormente filtrado por empresa
- **THEN** Telefone fica selecionado com suas opções disponíveis e foco apropriado, sem depender de correspondência textual

#### Scenario: Variantes e outras ferramentas
- **WHEN** o usuário abre placa antiga, placa Mercosul, CNPJ alfanumérico, NF-e ou CT-e pelo respectivo ID
- **THEN** o destino e a variante exatos ficam selecionados

#### Scenario: ID desconhecido
- **WHEN** uma solicitação contém ID inexistente
- **THEN** a aplicação informa indisponibilidade sem falhar nem alterar o resultado atual

### Requirement: Home de descoberta com personalização preservada
Home SHALL priorizar busca, categorias, favoritos e recentes e encaminhar a execução ao workspace comum, sem fluxo independente de geração/resultados. Preferências persistidas SHALL preservar significado e não conter dados gerados.

#### Scenario: Favorito antigo de contêiner
- **WHEN** a aplicação migra um favorito antigo da Home que representava contêiner com lacre
- **THEN** ele continua abrindo contêiner com lacre após recargas sem alterar registros históricos de contêiner simples

#### Scenario: Uso recente em qualquer workspace
- **WHEN** uma geração termina com sucesso em uma ferramenta
- **THEN** recentes refletem seu ID sem duplicatas, com limite de cinco itens e sem armazenar o resultado; favoritos continuam limitados a oito
