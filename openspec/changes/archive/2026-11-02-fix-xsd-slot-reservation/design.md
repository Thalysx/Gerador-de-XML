# Decisões

Reservar sincronamente após método/conteúdo/origem e antes de ler o corpo. Uma flag local mantém responsabilidade pela vaga até o handler instalar o finally da Promise do motor. O finally externo libera falhas de leitura/validação preliminar ou lançamento síncrono; a conclusão do motor libera sucesso/rejeição mesmo depois de timeout HTTP. Nenhuma liberação dupla.

Teste HTTP usa servidor real e corpos parciais, sem mock do validador. Outros testes carregam o código real do handler em contexto isolado com motor/relógio controlados para verificar estados excepcionais sem esperar quinze segundos ou simular carga de produção.

Preservar MAX_ACTIVE=2, timeout de quinze segundos, limites de bytes, mesma origem, status e Retry-After existentes. Corpos ainda pendentes também ocupam recursos e contam no limite. Não adicionar fila, novo timeout de leitura ou cancelamento do motor nesta change.
