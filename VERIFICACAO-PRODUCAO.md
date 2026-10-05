# Verificação da IA em produção

Destino das verificações históricas de IA abaixo: Netlify, substituindo naquela etapa a publicação inicialmente planejada na Vercel. Site: https://gerador-all.netlify.app. A atualização visual `3.0.0-alpha.4` foi solicitada e publicada na Vercel; seu estado está registrado ao final deste documento.

## Evidência obtida

Testes HTTP reais com Groq e armazenamento configurado na aplicação:

- Status retornou HTTP 200, provedor Groq configurado.
- Geração de dois nomes retornou HTTP 200 e artefato com dois registros.
- Continuação da mesma conversa gerou NF-e com um produto, retornando XML de 4.589 caracteres.
- Exclusão da conversa de teste retornou HTTP 200.
- Em 20/09/2026, envio de XML malformado executou `consultar_xml` e explicou a tag de fechamento incorreta, retornando HTTP 200.
- Outro visitante tentou continuar e excluir essa sessão: ambas as ações retornaram HTTP 403.
- O proprietário excluiu a sessão com HTTP 200; tentar continuá-la depois retornou HTTP 410.
- Em 23/09/2026, a identidade TheGenerator foi publicada pelo commit `e6856b9`. O HTML, `thegenerator-mark.svg` e `site.webmanifest` responderam HTTP 200 e tiveram SHA-256 idêntico ao build local.
- O endpoint `/api/status` continuou retornando `configured: true`, provedor `groq` e retenção de 30 minutos após essa publicação.
- A auditoria local em Chromium confirmou o nome, a assinatura, o símbolo e o favicon nos temas claro e escuro, sem rolagem horizontal nas seis telas em zoom simulado de 200%.
- Em 30/09/2026, a versão `3.0.0-alpha.2` foi publicada no Netlify pelo deploy `6abc8f0d382a431e3b017626`.
- Na produção, a página inicial, `site.webmanifest`, `favicon.svg`, `future-g-mark-general.svg` e `/api/status` responderam HTTP 200.
- A verificação em Chrome confirmou que Geradores Gerais disponibiliza somente NF-e, QA Portuário disponibiliza somente CT-e e o resumo do CT-e exibe como destinatário a empresa presente em `<dest>`, não o remetente presente em `<rem>`.

O modelo configurado pelo usuário após a falha do Llama foi `openai/gpt-oss-120b`, hospedado pela Groq. O endpoint de status não expõe o nome do modelo; essa configuração foi informada na conversa, não inspecionada pelo painel Netlify.

## O que a evidência não comprova

- Os fluxos acima exercitam Redis real, mas não comprovam concorrência de cotas, expiração por TTL ou recuperação após perda do bloqueio.
- Não foi confirmado se requisições consecutivas executaram em instâncias distintas.
- A leitura auditiva manual com leitor de tela real ainda não foi executada. A árvore de acessibilidade do Chromium, o teclado e os nomes acessíveis foram aprovados, mas não substituem essa escuta.
- Não foi confirmada a rotação das credenciais compartilhadas no contexto da conversa.
- Os testes HTTP não comprovam funcionamento visual dos botões de download.

Não tratar os itens restantes como concluídos com base apenas no sucesso da geração. A revisão visual e a identidade de 23/09 estão publicadas; as verificações de Redis real abaixo continuam separadas.

## Teste Redis isolado preparado

Executar `node scripts/verify-redis.cjs .env.netlify` na pasta `projeto`. O arquivo informado deve conter URL e token REST atuais. O script não imprime credenciais e não chama a IA. Usa um prefixo aleatório exclusivo, verifica oito reservas concorrentes para uma cota de dois pedidos, TTL configurado, posse do bloqueio, persistência, isolamento, expiração abreviada na chave de teste e preservação da cota após exclusão. Remove apenas as chaves criadas pelo teste.

Tentativa em 20/09/2026: interrompida antes de acessar Redis, pois `.env` e `.env.netlify` locais não continham URL/token preenchidos. Portanto, esse teste ainda não constitui evidência de aprovação em Redis real.

## Publicação 3.0.0-alpha.3

Em 30/09/2026, a versão `3.0.0-alpha.3` foi publicada no Netlify pelo deploy `6abc9919df467f40fcba949b`.

- URL de produção: https://gerador-all.netlify.app
- Preview validado antes da promoção: https://6abc987b86f11b1e0bbb75ec--gerador-all.netlify.app
- A página inicial, `site.webmanifest`, `favicon.svg`, `future-g-mark-general.svg` e `/api/status` responderam HTTP 200.
- `/api/status` confirmou `configured: true`, provedor `groq` e retenção de 30 minutos.
- A validação em Chrome confirmou o painel `RESULTADO · MOTORISTA` como uma lista semântica de 16 campos com rótulos amigáveis, sem apresentar identificadores técnicos crus.
- Os controles para gerar novamente, copiar, baixar TXT, ver detalhes e limpar ficaram disponíveis após a geração.
- A suíte local passou com 107 testes, o build foi concluído, a auditoria principal do Chromium foi aprovada e a matriz responsiva concluiu 128 capturas sem falhas.

## Publicação 3.0.0-alpha.4 — Vercel

Em 05/10/2026, o commit `b004d04c6ad36598fd449284cf79b65783471eee` foi enviado à `main` e publicado pela integração Git existente da Vercel.

- URL de produção: https://gerador-de-xml.vercel.app
- Projeto: `gerador-de-xml`, workspace `thalys-fef7`.
- Deploy da implementação: `dpl_4Tv29vhzMGzGAP9NZh87QGc7rHJQ`; status **Ready**, ambiente **Production**, duração de 15 segundos.
- URL do deploy: https://gerador-de-9xemeb7ua-thalys-fef7.vercel.app
- Os 16 arquivos públicos verificados retornaram HTTP 200 e SHA-256 correspondente ao conteúdo publicado: HTML, seis CSS, quatro scripts de apresentação, dois símbolos da marca, runtime de Speed Insights, manifesto e favicon. Arquivos versionados foram comparados com o blob Git para considerar a normalização CRLF/LF; o asset vendorizado foi comparado com o build local.
- A revisão em Chrome na produção confirmou seleção de CPF, geração pelo botão Gerar CPF e Ctrl+Enter opcional. Ambos produziram resultados novos, com opções avançadas recolhidas.
- A suíte local passou com 117 testes; build, 12 specs canônicas após o arquivamento, auditoria Chrome, 224 combinações responsivas, 56 estados expandidos e quatro casos do Editor carregado foram aprovados.
- As changes `normalize-legacy-openspec-specs` e `simplify-visual-system-and-workspaces` estão arquivadas; não há changes ativas. SEFAZ permanece cancelada.

**Limitação observada:** `/api/status` nessa Vercel retornou HTTP 503 e `configured: false`, informando que a IA pública ainda não está configurada. A publicação confirma a interface e os geradores locais; não certifica IA externa nem Redis nessa hospedagem. Nenhuma credencial foi criada, copiada ou alterada para esta entrega.

Evidência HTTP local: `artifacts/visual-system-refresh/alpha4-production-http.json`. Permanecem as conferências manuais de outros navegadores, dispositivo real e leitor de tela descritas em `docs/visual-system-refresh.md`.

## Publicação 3.0.0-alpha.5 — Vercel

Em 05/10/2026, a correção do crachá e do XML Fiscal foi enviada para `main` pelo commit `18df014932f455b5dd79333c94e559815efc02a8`.

- Produção: https://gerador-de-xml.vercel.app/
- Deploy da implementação: `dpl_Ae9rNg9ptJMZhuXPMVpidXpcmJ9Z`, Ready, Production, build de 16 segundos.
- URL do deploy: https://gerador-de-4l4fwyj3o-thalys-fef7.vercel.app/
- Check Vercel no GitHub: success.
- Os 17 arquivos públicos conferidos retornaram HTTP 200 e SHA-256 idêntico ao commit/build local, incluindo registry, fluxo XML e seis folhas CSS.
- No navegador de produção, selecionar Crachá gerou o cartão imediatamente. XML Fiscal apresentou campos, cenários, NCMs e quatro ações de resultado diretamente visíveis.
- `/api/status` continuou respondendo HTTP 503, `configured:false`; a configuração da IA pública permanece fora desta correção.

Evidência HTTP: `artifacts/xml-layout-and-direct-badge/production-http.json`. Comportamento e validação local em `docs/xml-layout-and-direct-badge.md`.
