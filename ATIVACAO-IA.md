# Ativação gradual da IA pública

## Estado desta entrega

O código possui integração com Groq e OpenAI, ferramentas reais do gerador, rotas para Vercel, sessões Redis e limites de uso. A integração foi testada com respostas simuladas. A ativação pública ainda depende das credenciais, de testes com Redis real e de uma conversa real no site publicado.

## Teste local

1. Instale as dependências com `npm install` (Node.js 20.19 ou superior).
2. Copie `.env.example` para `.env`.
3. Defina `AI_PROVIDER=groq` e preencha `GROQ_API_KEY`. O modelo configurável por `GROQ_MODEL` começa em `llama-3.3-70b-versatile`.
4. Execute `npm run dev` e abra `http://127.0.0.1:4173`.

O servidor local usa sessões em memória. Reiniciá-lo apaga as conversas. Para usar OpenAI, escolha `AI_PROVIDER=openai` e configure `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL`. Nunca inclua chaves no HTML ou no Git.

## Configuração na Vercel

Na equipe `thalys-projects2`, abra o projeto `gerador-de-xml-e-cadastro-de-pessoa-f-sica` e configure suas variáveis de ambiente. A conexão disponível nesta sessão ainda não lista essa equipe; o acesso precisa ser corrigido para configurar e verificar a publicação por aqui.

| Variável | Valor ou finalidade |
| --- | --- |
| `AI_PROVIDER` | `groq` |
| `GROQ_API_KEY` | Chave secreta da conta Groq |
| `GROQ_MODEL` | `llama-3.3-70b-versatile`, sujeito à disponibilidade da conta |
| `UPSTASH_REDIS_REST_URL` | URL HTTPS REST do banco Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token secreto REST com acesso de leitura e escrita |
| `AI_COOKIE_SECRET` | Segredo aleatório forte, com pelo menos 32 caracteres |
| `AI_ALLOWED_ORIGINS` | `https://gerador-de-xml-e-cadastro-de-pessoa.vercel.app` |
| `AI_VISITOR_MINUTE` | `4` |
| `AI_VISITOR_DAY` | `20` |
| `AI_IP_DAY` | `60` |
| `AI_GLOBAL_DAY` | `200` |

Use bancos e segredos separados para testes e produção. Origens adicionais são separadas por vírgula e precisam ser explícitas. Não use curingas. Uma mudança de variáveis exige uma nova implantação para entrar em vigor.

`npm run build` prepara somente HTML, CSS e JavaScript público em `.generated-public`. As rotas `api/chat.js` e `api/status.js` executam no servidor. `vercel.json` inclui os arquivos usados pelo motor de geração nas funções. O empacotamento final ainda precisa ser confirmado numa implantação real.

## Privacidade e limites

Somente mensagens, XMLs anexados explicitamente e resultados necessários das ferramentas são enviados ao provedor escolhido. Os formulários e o histórico local não são enviados automaticamente. O limite do anexo é 100 KB.

Na produção, a conversa fica no Redis por até 30 minutos de inatividade. O visitante é identificado por cookie assinado, HttpOnly e Secure; isso não representa uma conta autenticada. Visitante e endereço IP são transformados em hashes com segredo antes de compor as chaves de controle. Limpar a conversa solicita sua exclusão no servidor; recarregar a página apenas perde a referência local, deixando a sessão expirar. A exclusão não apaga as cotas nem controla a retenção do provedor de IA.

Cada sessão admite até 20 pedidos. Os limites diários usam janelas UTC. Pedidos admitidos contam mesmo se falharem depois. Cada pedido pode fazer até 6 chamadas ao modelo; portanto, 200 pedidos não significam 200 chamadas nem um teto monetário. As cotas podem ser ajustadas pelas variáveis acima. Se o Redis falhar, a chamada ao modelo é bloqueada.

Usar um modelo de pesos abertos não garante hospedagem gratuita. A licença do modelo, o preço da inferência, o banco e a hospedagem são questões distintas. Conferir os custos e limites da conta escolhida antes da ativação. Cookies podem ser apagados e IPs compartilhados; os limites combinados reduzem abuso, mas não substituem autenticação quando ela for necessária.

## Verificações antes da ativação

- Executar `npm test` e `npm run build`.
- Executar os scripts Lua contra Redis real: cotas concorrentes, isolamento entre visitantes, bloqueio, expiração e exclusão.
- Confirmar que a função publicada encontra os modelos XML e os scripts do gerador.
- Conversar com a Groq, gerar CPFs e NF-e, continuar a conversa e analisar um XML anexado.
- Confirmar persistência entre instâncias, tratamento de indisponibilidade e respostas de cota excedida.
- Verificar a exclusão da sessão, os cookies e a ausência de segredos nos arquivos públicos.

A validação XML continua verificando sintaxe e consistência básica; não certifica XSD, assinatura digital ou autorização SEFAZ. A IA deve usar as ferramentas existentes para calcular documentos e gerar XML.

## Próximas etapas no site

Depois de validar o chat em produção, integrar assistência contextual na tela de validação XML e, em seguida, pedidos de geração nas demais telas. Cada etapa precisa manter os geradores locais disponíveis e tornar explícito o envio de conteúdo ao provedor.
