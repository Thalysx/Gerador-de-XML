# Roadmap consolidado do FUTURE G

Este documento incorpora ao repositório as decisões do plano consolidado aprovado e registra o estado real do produto em 05/10/2026.

## Estado atual

As fases `future-g-01-foundation` a `future-g-11-polish` estão concluídas e arquivadas no OpenSpec. A aplicação possui shell FUTURE G, registry único, Geradores Gerais, QA Portuário, validação XML estruturada, cenários, produtividade, acessibilidade automatizada e auditoria responsiva.

A rodada `release-readiness-regressions` corrigiu antes da publicação:

- entrega local de manifesto, favicon, SVG e PNG;
- isolamento de NF-e em Geradores Gerais e CT-e em QA Portuário;
- destinatário correto no resumo de CT-e;
- retorno ao topo ao trocar de tela;
- alcance vertical de toda a navegação em zoom ou viewport baixa;
- foco, animações, transições, tooltips e redução de movimento;
- quebra legível de identificadores e valores longos;
- auditoria e testes de regressão correspondentes.

A fase `future-g-12-refine-interface-layout` está concluída e arquivada, assim como `fix-structured-result-panel`, `release-readiness-regressions` e `future-g-13a-local-fiscal-validation`. O refinamento posterior à Fase 11 preservou as regras de negócio: busca e categoria de Dados cadastrais acima do workspace, dropzone única e compacta no Editor XML e Assistente centrado na conversa com composer unificado. O plano aprovado completo está registrado em `docs/FUTURE_G_PLANO_CONSOLIDADO_ROADMAP_ATUALIZADO.md`.

A manutenção `normalize-legacy-openspec-specs` foi concluída e arquivada em 05/10/2026, com 8 de 8 tarefas completas. As cinco especificações legadas foram normalizadas sem alterar requisitos ou comportamento do produto.

A revisão `simplify-visual-system-and-workspaces` foi concluída e arquivada em 05/10/2026, com 8 de 8 tarefas. A versão `3.0.0-alpha.4` aplica o plano visual atualizado: tokens neutros compartilhados, azul para interação, roxo para IA, hierarquia de ações, geração por clique e divulgação progressiva em Home, Dados, XML Fiscal, Cadastro e Assistente. Não há changes ativas. O registro da implementação e verificação está em [Revisão visual](visual-system-refresh.md).

## Pendências de encerramento externo

- Executar o roteiro auditivo com leitor de tela real em `CHECKLIST-LEITOR-TELA.md`.
- Executar `scripts/verify-redis.cjs` contra Redis real com credenciais fornecidas fora do repositório.
- Não marcar essas verificações como concluídas somente com testes simulados.

## Fase 12: refinamento consolidado de interface

A fase 12 consolida as melhorias aprovadas de layout e comportamento: busca superior em Dados cadastrais, resultado estruturado, retorno do scroll do Resultado ao topo após nova geração, dropzone compacta e Assistente centrado na conversa. As implementações correspondentes já foram validadas e devem permanecer documentadas no OpenSpec.

## Validação fiscal incremental

A fase 13 será incremental e não deve misturar validação determinística, integração oficial e explicação por IA no mesmo incremento.

Estado da trilha após a decisão de 05/10/2026:

1. `future-g-13a-local-fiscal-validation`: concluída e arquivada, com validação local e XSD para os documentos e versões suportados.
2. `future-g-13b-official-fiscal-validation`: cancelada por decisão do usuário. A integração SEFAZ não será implementada; pesquisa de autorizadores, certificados, homologação e produção deixa de ser uma pendência deste roadmap. Nenhuma change foi aberta para essa fase.
3. `future-g-13c-ai-fiscal-explanation`: possibilidade futura, não iniciada nem autorizada para implementação. Se retomada, deverá explicar relatórios locais, sem depender de integração SEFAZ ou apresentar inferência de IA como validade fiscal.

Arquitetura-alvo:

`Validação local -> Explicação por IA (possibilidade futura)`

## Fase 13A concluída e limites preservados

A fase 13A reutiliza o analisador atual e acrescenta XSD first-party para NF-e e CT-e 4.00, sem consulta SEFAZ. Certificados, credenciais e autorização oficial permanecem fora do escopo porque a fase 13B foi cancelada. A validação local existente permanece disponível; a aplicação não consulta nem autoriza documentos na SEFAZ. Não há próxima etapa fiscal autorizada.

## Fluxo

Cada change deve conter proposta, desenho e tarefas; atualizar as especificações canônicas; executar testes, build e auditoria pertinente; registrar limites; e ser arquivada antes do início da seguinte.


## Scroll behavior correction

A atualização do painel Resultado não deve mover a viewport para o topo. O comportamento aprovado para FUTURE 12 é preservar a posição atual do usuário ao clicar em um gerador e receber um novo resultado. Qualquer regra anterior de reset automático do Resultado para o topo fica substituída por esta regra.

O auto-scroll do Assistente IA continua sendo um comportamento separado e não deve ser removido.
