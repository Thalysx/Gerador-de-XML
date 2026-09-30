# Change: FUTURE G 12 — Refine Interface Layout

## Motivation

A Fase 05 entregou geração direta, resultado persistente, descoberta visível e Assistente em área ampla, mas três composições ainda carregam containers ou controles redundantes. A busca de Dados cadastrais permanece dentro da coluna de configuração, o Editor XML desenha uma dropzone dentro de outra área delimitada e o Assistente mantém controles e informações secundárias acima ou abaixo da conversa.

## Scope

- Promover busca e categoria de Dados cadastrais para uma faixa horizontal anterior ao workspace.
- Trocar o botão permanente de limpeza por uma ação contextual no campo.
- Reduzir o Editor XML a uma única dropzone visual compacta.
- Transformar o Assistente em uma experiência centrada na conversa.
- Reunir anexo, mensagem, envio, modo, máscara e nova conversa no composer inferior.
- Mover privacidade e retenção para Configurações.
- Adicionar textarea expansível com Enter para enviar e Shift+Enter para nova linha.
- Preservar responsividade, temas, acessibilidade, ambientes e regras existentes.

## Out of Scope

- Alterar algoritmos de geração, XML, validação ou regras portuárias.
- Alterar providers, APIs, sessões ou retenção do Assistente.
- Introduzir React/shadcn ou uma segunda linguagem visual na aplicação estática.
- Implementar qualquer parte da validação fiscal futura.

## Constraints

- Reutilizar os IDs, estados, handlers e componentes atuais.
- Manter Lucide local como biblioteca de ícones.
- Não criar loading artificial em operações locais.
- Não interromper leitura manual com auto-scroll forçado.
- Executar testes, build e auditoria visual antes de encerrar a change.
