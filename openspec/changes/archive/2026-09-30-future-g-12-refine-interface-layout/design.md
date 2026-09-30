# Design: FUTURE G 12 — Refine Interface Layout

## Diagnóstico

- A stack é HTML, CSS e JavaScript clássico. Lucide já é local e limitado pelo build; shadcn/ui exigiria React e não é compatível sem reescrita.
- .docs-search é filha de .doc-gen-left, usa Card próprio e mantém um botão de limpeza permanente.
- .editor-dropzone e .editor-dropzone-inner desenham duas superfícies tracejadas.
- .chat-controls, .chat-privacy e #chat-status fragmentam a experiência do Assistente.
- O campo de mensagem é um input, portanto não suporta composição multiline.

## Decisions

### Dados cadastrais

Mover .docs-search para antes de .doc-gen-wrapper. A faixa usa grid de busca e categoria, sem superfície de Card. O botão #docs-search-clear permanece para compatibilidade, mas vira um ícone X acessível mostrado somente enquanto há texto. O filtro e a contagem existentes continuam sendo a fonte de estado.

### Editor XML

Manter #editor-dropzone como alvo lógico de drag-and-drop, porém sem borda ou fundo. A única superfície visual será o botão .editor-dropzone-inner, limitado a 680 px e 176 px de altura mínima. Seleção múltipla, parsing e tratamento de erros não mudam.

### Assistente

Manter uma única coluna flexível: estado vazio ou histórico na área central e, no fim, sugestões e composer. O composer contém duas linhas: mensagem/anexo/envio e controles compactos. Privacidade e retenção migra para o menu Configurações, conservando #chat-privacidade para a atualização dinâmica do provedor.

O campo #chat-pedido vira textarea, cresce até 140 px e intercepta Enter sem Shift para enviar. O envio vazio continua bloqueado pelo handler. Shift+Enter preserva a edição multiline.

## Compatibility

IDs públicos, funções inline, integração de IA, anexos, sessão, comandos locais, ambientes e auto-scroll permanecem inalterados. Os testes exercitam a nova hierarquia e os atalhos sem substituir a cobertura funcional existente.

## Validation

- Testes unitários e de integração em JSDOM.
- Build do runtime local de ícones e distribuição pública.
- Auditoria responsiva, claro/escuro, foco e console no navegador.
