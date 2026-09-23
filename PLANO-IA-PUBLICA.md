# Meta: IA pública no gerador

## Estado atual

O trabalho acontece na pasta `projeto`. Por escolha do usuário, a publicação migrou para Netlify. A IA está ativa em https://gerador-all.netlify.app, com geração real de dados e XML confirmada. Consulte [VERIFICACAO-PRODUCAO.md](VERIFICACAO-PRODUCAO.md) para a evidência e os testes restantes. As etapas abaixo registram o histórico da implementação; afirmações de testes pendentes são substituídas apenas pela evidência explícita desse relatório.

### 1. Provedores — implementado e testado com respostas simuladas

- `scripts/provider.cjs` separa OpenAI Responses e Groq Chat Completions.
- `scripts/ai.cjs` continua executando as ferramentas reais para dados e XML.
- Seleção exclusivamente no servidor, por `AI_PROVIDER=openai|groq`.
- Chaves e mensagens de erro do provedor não são devolvidas ao navegador.
- 17 testes passaram, incluindo chamadas de ferramenta, continuidade da conversa, cota excedida e resposta incompleta. Não houve chamada real à Groq.

Para testar localmente, copie `.env.example` para `.env`, defina `AI_PROVIDER=groq`, configure `GROQ_API_KEY` e execute `npm run dev`. O modelo inicial é `llama-3.3-70b-versatile`, substituível por `GROQ_MODEL`. A disponibilidade e a cota dependem da conta Groq. O provedor hospeda modelos de pesos abertos; a licença específica do modelo continua aplicável.

### 2. Persistência e limites — camada implementada; integração pública pendente

`scripts/session-store.cjs` oferece armazenamento Redis via REST e uma implementação em memória somente para desenvolvimento local. O assistente recebe esse armazenamento por configuração. Na Vercel, iniciar sem armazenamento persistente gera erro.

As reservas verificam e incrementam todos os limites em um script Lua atômico: 4 pedidos por minuto por visitante, 20 por dia por visitante, 60 por dia por IP e 200 por dia no total. Cada pedido admite no máximo 6 chamadas ao modelo; esses limites contam pedidos, não tokens nem valor monetário. Pedidos que falham após admissão também contam. O contexto é limitado a 150 KB por chamada; a sessão persistida, a 1 MB.

Sessões expiram após 30 minutos e possuem bloqueio de 150 segundos com token de posse para evitar sobrescrita por uma chamada atrasada. O banco recebe apenas o identificador/hash de visitante e IP definido pela camada HTTP implementada. A exclusão não apaga contadores de uso.

24 testes passaram, incluindo concorrência na implementação de memória, troca de instâncias do assistente, isolamento por proprietário, expiração e falhas do armazenamento. O contrato REST foi testado com transporte simulado. **Os scripts Lua ainda precisam ser executados contra Redis real antes da ativação pública.**

- Implementado: armazenamento Redis conectado à rota pública.
- Implementado: vínculo ao visitante por cookie assinado, HttpOnly e Secure.
- Validar os scripts atômicos contra Redis real, inclusive concorrência entre instâncias.
- Um identificador anônimo não equivale a uma conta: combinar limites e proteção contra abuso, documentando as restrições.
- Já implementado: bloquear chamadas ao modelo se o armazenamento da cota estiver indisponível.

### 3. Rotas e interface — implementadas; publicação pendente

- Rotas de chat/status, verificação de origem, tamanho e tempo limite.
- Empacotar os modelos XML e scripts usados pelo motor.
- Publicar somente os arquivos estáticos destinados ao navegador.
- Exibir corretamente o provedor e as condições do envio de mensagens/anexos.
- Limpeza efetiva da sessão persistida e tratamento de expiração.

### 4. Ativação e verificação — pendente

- Configurar chave Groq e armazenamento na equipe Vercel correta (`thalys-projects2`). Nunca compartilhar as chaves no chat nem no Git.
- A conexão Vercel disponível anteriormente não tinha acesso à equipe; confirmar acesso antes da configuração.
- Testar uma conversa real, geração de dados, XML, continuidade em diferentes instâncias e limites.
- Confirmar a versão e as rotas no domínio público, sem expor credenciais.

## Critério de conclusão

Não considerar a meta concluída apenas com testes simulados ou deploy verde. É necessário verificar o fluxo real em produção, com persistência, controle de uso e documentação atualizada. O modo local e o layout aprovado devem continuar funcionando.

## Referências

- [Groq: ferramentas](https://console.groq.com/docs/tool-use/overview)
- [Groq: limites](https://console.groq.com/docs/rate-limits)
- [Vercel: Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Upstash: Redis REST](https://upstash.com/docs/redis/features/restapi)

## Entrega de 19/09/2026

29 testes passaram com transporte de IA e Redis simulados. Build estático verificado localmente. O tempo limite do navegador agora abrange a consulta de disponibilidade e o pedido ao chat. Guia de configuração: [ATIVACAO-IA.md](ATIVACAO-IA.md). Redis real, Groq real e implantação permanecem pendentes.
