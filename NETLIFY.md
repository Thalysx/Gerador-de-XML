# Publicação na Netlify

Adaptação implementada localmente; publicação e chamadas reais ainda pendentes. A configuração existente da Vercel continua disponível.

## Conectar o projeto

1. Enviar esta versão da pasta `projeto` ao repositório antes de implantar. O arquivo `netlify.toml` deve estar na raiz do código publicado.
2. No painel Netlify, importar o repositório GitHub `Thalysx/Gerador-de-XML`.
3. Usar `npm run build` como comando e `.generated-public` como diretório público. As funções estão em `netlify/functions`.
4. Anotar o domínio atribuído, como `https://seu-projeto.netlify.app`.

## Variáveis secretas

Configurar no painel Netlify, disponíveis para Functions no ambiente de produção:

| Nome | Valor |
| --- | --- |
| AI_PROVIDER | groq |
| GROQ_API_KEY | Chave da Groq; não inserir no Git |
| GROQ_MODEL | llama-3.3-70b-versatile |
| UPSTASH_REDIS_REST_URL | URL REST do Redis |
| UPSTASH_REDIS_REST_TOKEN | Token REST do Redis |
| AI_COOKIE_SECRET | Segredo aleatório forte de pelo menos 32 caracteres |
| AI_ALLOWED_ORIGINS | Domínio HTTPS exato do site, sem barra final |

As cotas opcionais e os cuidados com sessões estão em [ATIVACAO-IA.md](ATIVACAO-IA.md). A chave cadastrada na Vercel não é transferida para Netlify. Não colocar segredos em `netlify.toml`.

## Implementação e verificação

As funções modernas recebem Request/Context e retornam Response, mantendo as rotas `/api/chat` e `/api/status`. O adaptador usa `context.ip` para identificar o visitante e ignora o cabeçalho de IP fornecido pelo cliente. Os scripts e modelos são incluídos no pacote da função, separados dos arquivos públicos. A inferência tem prazo de 40 segundos na Netlify, reservando parte do limite de execução para armazenamento e resposta.

Após publicar, verificar empacotamento dos arquivos, status, conversa Groq real, geração de XML, persistência Redis, cotas e exclusão. Os testes locais não substituem essa verificação. Sem as variáveis obrigatórias, a API responde indisponível e os geradores locais continuam utilizáveis.

Referências: [API de Functions](https://docs.netlify.com/build/functions/api/), [configuração](https://docs.netlify.com/build/functions/configuration/), [variáveis](https://docs.netlify.com/build/functions/environment-variables/).
