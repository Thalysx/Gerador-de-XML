## Purpose
Garantir uma experiência visual única, legível e responsiva entre descoberta e ferramentas, incluindo seus estados e temas.

## ADDED Requirements

### Requirement: Componentes e estados consistentes
Home, Dados Cadastrais, Cadastro Geral, XML Fiscal, Editor XML, Validação XML e Assistente SHALL compartilhar aparência e comportamento de botões, inputs, cards, painéis, modais, tooltips, toasts e estados loading, erro, sucesso, vazio e disabled.

#### Scenario: Mesma ação em telas distintas
- **WHEN** o usuário compara ações equivalentes na Home e nas ferramentas
- **THEN** hierarquia, espaçamento, foco e feedback seguem a mesma linguagem visual, sem uma interface antiga embutida na nova

#### Scenario: Feedback de operação
- **WHEN** uma operação começa, falha ou termina
- **THEN** seu estado fica perceptível e acessível sem anúncios duplicados, ações inválidas ficam indisponíveis e erros oferecem recuperação

### Requirement: Densidade, temas e acessibilidade
A aplicação SHALL preservar claro/escuro, contraste de texto comum de pelo menos 4,5:1, foco visível, zoom e movimento reduzido; SHALL usar roxo principalmente como accent, bordas neutras e espaço proporcional ao conteúdo.

#### Scenario: Grade responsiva
- **WHEN** a aplicação é verificada em 360, 768, 1280 e 1920px nos dois temas
- **THEN** os controles permanecem alcançáveis, a página não tem overflow horizontal, cards não ocupam áreas gigantes e workspaces aproveitam a largura disponível

#### Scenario: Zoom e movimento
- **WHEN** o usuário aplica zoom de 200% ou prefere movimento reduzido
- **THEN** consegue navegar e operar sem perda de conteúdo, sobreposição de controles ou animação obrigatória
