# Change: FUTURE G UI System

## Why
Padronizar a UX do FUTURE G antes da expansão dos novos geradores, reduzindo containers, gavetas e etapas desnecessárias.

## What Changes
- shadcn/ui como base técnica, se compatível com a stack atual.
- Lucide como biblioteca padrão de ícones.
- Identidade própria FUTURE G sobre os componentes.
- Geração direta ao clicar em geradores simples.
- Resultado sempre presente com empty state.
- Busca e filtros no topo da configuração.
- Redução do uso de accordions.
- Assistente de IA ocupando toda a área útil do conteúdo.
- Microinterações funcionais.
- Separação correta entre Geradores Gerais e QA Portuário.
- Responsividade e acessibilidade.

## Out of Scope
- Não criar novos geradores das fases posteriores.
- Não implementar cenários portuários completos.
- Não reescrever a aplicação.
- Não alterar regras de negócio sem necessidade.
- Não usar animações decorativas excessivas.
- Não transformar toda a interface em Cards/Accordions.

## Capabilities
- `ui-system`: geração direta, resultado persistente, busca e categorias mais visíveis, assistente sem container redundante, fundamentos visuais, microinterações funcionais e isolamento entre ambientes.

## Constraints
- Preservar as regras de negócio e os contratos existentes.
- Adaptar componentes à stack real sem introduzir uma reescrita de framework.
- Validar geração individual e em lote, copiar, gerar novamente, máscaras, XML, IA, navegação, ambientes, temas, mobile e build.
- Concluir a validação antes de iniciar `future-g-06-general-generators`.
