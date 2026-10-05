# Proposal

## Why

O plano visual atualizado pede uma ferramenta centrada na tarefa e no resultado. A interface atual combina paletas roxa/azul, cabeçalhos decorativos, configurações extensas e ações concorrentes; a revisão deve reduzir essa densidade mantendo todas as capacidades existentes.

## What Changes

- Consolidar superfícies neutras, azul para interação, roxo apenas para IA e cores semânticas de sucesso, aviso e erro nos dois temas e ambientes.
- Padronizar espaçamento, tipografia, radius, inputs e ações primary/secondary/ghost no CSS existente.
- Simplificar a Home: descoberta e recentes primeiro; favoritos, métricas e atividade acessíveis em disclosures secundários.
- Recolher preferências opcionais em Dados, formulários e cenários avançados em XML Fiscal e edição de Cadastro; manter configuração essencial visível.
- Organizar ações de resultado e do Assistente em disclosures acessíveis, preservando os handlers, estados e dados existentes.
- Preservar responsividade, navegação recolhida, resultados vazios, foco, scroll e separação entre ambientes.
- Não criar recursos ausentes dos exemplos do documento, alterar geração/validação/APIs/armazenamento, integrar SEFAZ, trocar stack, instalar shadcn ou publicar.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-shell`: substituir a identidade roxa de Geradores Gerais por uma base neutra compartilhada com interação azul e detalhes roxos somente de IA.
- `ui-system`: explicitar divulgação progressiva, hierarquia semântica e controles secundários do Assistente sem exposição permanente.

## Impact

HTML, seis arquivos CSS e código de apresentação do shell/workspace. A stack permanece HTML/JavaScript, Bootstrap e Lucide vanilla, sem novas dependências. Regressões possíveis: campos fechados não podem desaparecer da geração, filtros/favoritos/histórico devem preservar seus IDs, controles movidos devem manter foco e teclado, menus não podem ultrapassar a viewport. A suíte existente, testes de apresentação direcionados, build e auditoria responsiva verificarão essas condições.
