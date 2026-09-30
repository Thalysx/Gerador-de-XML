# Roadmap consolidado do FUTURE G

Este documento incorpora ao repositório as decisões do plano consolidado aprovado e registra o estado real do produto em 30/09/2026.

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

## Pendências de encerramento externo

- Executar o roteiro auditivo com leitor de tela real em `CHECKLIST-LEITOR-TELA.md`.
- Executar `scripts/verify-redis.cjs` contra Redis real com credenciais fornecidas fora do repositório.
- Não marcar essas verificações como concluídas somente com testes simulados.

## Próxima fase: validação fiscal

A fase 12 será incremental e não deve misturar validação determinística, integração oficial e explicação por IA no mesmo incremento.

Ordem aprovada:

1. `future-g-12a-local-fiscal-validation`: definir documentos e versões suportados, inventariar regras existentes, pesquisar a distribuição oficial dos schemas e projetar validação XSD e regras determinísticas adicionais.
2. `future-g-12b-official-fiscal-validation`: pesquisar e especificar autorizadores, certificados, homologação, produção, segurança e limites legais antes de qualquer integração.
3. `future-g-12c-ai-fiscal-explanation`: explicar relatórios determinísticos e oficiais sem apresentar inferência de IA como validade fiscal.

Arquitetura-alvo:

`Validação local -> Validação oficial -> Explicação por IA`

## Limites da fase 12A

A fase 12A reutilizará o analisador atual. Não criará um segundo validador e não consultará SEFAZ. Certificados, credenciais, autorização oficial e IA ficam fora do escopo até changes próprias. A implementação somente começa depois que as decisões de documentos, versões, schemas, execução no backend e mensagens de cobertura estiverem documentadas.

## Fluxo

Cada change deve conter proposta, desenho e tarefas; atualizar as especificações canônicas; executar testes, build e auditoria pertinente; registrar limites; e ser arquivada antes do início da seguinte.
