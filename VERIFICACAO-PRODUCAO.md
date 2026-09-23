# Verificação da IA em produção

Destino aprovado pelo usuário: Netlify, substituindo a publicação inicialmente planejada na Vercel. Site: https://gerador-all.netlify.app.

## Evidência obtida

Testes HTTP reais com Groq e armazenamento configurado na aplicação:

- Status retornou HTTP 200, provedor Groq configurado.
- Geração de dois nomes retornou HTTP 200 e artefato com dois registros.
- Continuação da mesma conversa gerou NF-e com um produto, retornando XML de 4.589 caracteres.
- Exclusão da conversa de teste retornou HTTP 200.
- Em 20/09/2026, envio de XML malformado executou `consultar_xml` e explicou a tag de fechamento incorreta, retornando HTTP 200.
- Outro visitante tentou continuar e excluir essa sessão: ambas as ações retornaram HTTP 403.
- O proprietário excluiu a sessão com HTTP 200; tentar continuá-la depois retornou HTTP 410.

O modelo configurado pelo usuário após a falha do Llama foi `openai/gpt-oss-120b`, hospedado pela Groq. O endpoint de status não expõe o nome do modelo; essa configuração foi informada na conversa, não inspecionada pelo painel Netlify.

## O que a evidência não comprova

- Os fluxos acima exercitam Redis real, mas não comprovam concorrência de cotas, expiração por TTL ou recuperação após perda do bloqueio.
- Não foi confirmado se requisições consecutivas executaram em instâncias distintas.
- A revisão visual e a navegação por leitor de tela ainda precisam ser verificadas no navegador.
- Não foi confirmada a rotação das credenciais compartilhadas no contexto da conversa.
- Os testes HTTP não comprovam funcionamento visual dos botões de download.

Não tratar esses itens como concluídos com base apenas no sucesso da geração. A revisão de front de 20/09 continua local, separada da versão testada em produção.

## Teste Redis isolado preparado

Executar `node scripts/verify-redis.cjs .env.netlify` na pasta `projeto`. O arquivo informado deve conter URL e token REST atuais. O script não imprime credenciais e não chama a IA. Usa um prefixo aleatório exclusivo, verifica oito reservas concorrentes para uma cota de dois pedidos, TTL configurado, posse do bloqueio, persistência, isolamento, expiração abreviada na chave de teste e preservação da cota após exclusão. Remove apenas as chaves criadas pelo teste.

Tentativa em 20/09/2026: interrompida antes de acessar Redis, pois `.env` e `.env.netlify` locais não continham URL/token preenchidos. Portanto, esse teste ainda não constitui evidência de aprovação em Redis real.
