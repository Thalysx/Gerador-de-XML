## Purpose
Concentrar configuração e resultados em workspaces coerentes sem perder operações existentes, regras de geração ou dados persistidos.

## ADDED Requirements

### Requirement: Workspace de Dados Cadastrais
Dados Cadastrais SHALL apresentar Configuração | Resultado em desktop e sequência adaptada no mobile, com resultado destacado inclusive no estado vazio. SHALL preservar geração individual, lote, validação, histórico, máscaras, opções, regeneração, cópia, detalhes, limpeza e downloads existentes.

#### Scenario: Geração individual
- **WHEN** o usuário configura e gera um documento
- **THEN** o resultado correto fica destacado, anunciado e disponível às ações existentes, e seu histórico é registrado uma única vez

#### Scenario: Lote e exportação
- **WHEN** o usuário gera entre 1 e 500 registros ou fornece quantidade inválida
- **THEN** limites, não repetição e erros existentes são preservados; prévia limitada não trunca cópia nem exportação TXT, CSV ou JSON

#### Scenario: Histórico e validação
- **WHEN** o usuário filtra e restaura um registro ou valida um documento
- **THEN** o registro correto e seus dados/opções são recuperados e as regras e mensagens de validade continuam equivalentes às existentes

### Requirement: Paridade de Cadastro e XML
Cadastro Geral e ferramentas XML SHALL adotar componentes comuns preservando campos, geração por campo/completa, histórico, locks, produtos, cenários, importação, edição, prévia, validação e exportações existentes.

#### Scenario: Fluxo XML completo
- **WHEN** o usuário gera XML com campos bloqueados e produtos, abre no editor, altera, valida e baixa
- **THEN** dados e regras existentes são preservados em todas as etapas dentro da mesma linguagem visual

### Requirement: Assistente recuperável
Assistente SHALL manter modos local e IA, anexos explícitos, sugestões revisáveis, renderização segura e ações de resultado. Indisponibilidade SHALL ter mensagem compreensível e recuperação, sem comandos de desenvolvimento ou detalhes técnicos como experiência principal.

#### Scenario: Falha de conexão ou serviço indisponível
- **WHEN** a IA não pode atender
- **THEN** o usuário recebe orientação para tentar novamente ou escolher modo local, com pedido e anexos preservados, sem reenvio automático nem troca silenciosa de modo

#### Scenario: Limite ou sessão expirada
- **WHEN** o serviço responde com limite ou expiração de sessão
- **THEN** a interface explica a situação e permite recuperação sem sobrescrever rascunho novo ou revelar detalhes internos

### Requirement: Compatibilidade de negócio
A refatoração SHALL preservar algoritmos, formatos, limites, contratos de API e históricos existentes, sem funcionalidades FUTURE G ou segunda engine na Home.

#### Scenario: Paridade após migração
- **WHEN** os fluxos existentes são executados pela interface e pelo backend
- **THEN** mantêm as invariantes de documentos, XML, exportação e persistência e não dependem da presença de componentes antigos da Home
