## Purpose
Oferecer identidade e navegação consistentes em todas as ferramentas do The Generator, com acesso por teclado e adaptação ao tamanho da tela.

## ADDED Requirements

### Requirement: Identidade e controle único da sidebar
A aplicação SHALL mostrar The Generator no topo da sidebar e somente um controle de ícone para expandir/recolher a navegação, sem botão textual "Recolher" ou checkbox redundante. O controle SHALL ter nome acessível dinâmico, tooltip em hover/foco e estado expandido informado.

#### Scenario: Recolher e restaurar
- **WHEN** o usuário recolhe a sidebar e recarrega a aplicação
- **THEN** a preferência permanece, com logo, ícones, tooltips e indicação da página ativa visíveis e o controle de expansão alcançável

### Requirement: Contexto e navegação acessível
O header SHALL exibir somente contexto da página e ações globais. Todas as páginas SHALL usar o mesmo shell, preservando navegação por teclado e foco visível.

#### Scenario: Trocar ferramenta
- **WHEN** o usuário navega da Home para qualquer ferramenta pelo teclado
- **THEN** o painel, título e indicação ativa correspondem à mesma ferramenta sem shell legado adicional

#### Scenario: Menu em tela pequena
- **WHEN** o menu é aberto em tela pequena e o usuário pressiona Escape
- **THEN** ele fecha e devolve foco ao controle, que continua disponível sem controles redundantes
