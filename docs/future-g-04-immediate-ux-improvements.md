# FUTURE G 04 — melhorias imediatas de UX

## Resultado

A fase consolida oito melhorias priorizadas sem criar novos geradores ou motores paralelos. Assistente, lote, placas, NCMs e upload XML continuam usando os contratos existentes, com novas interações cobertas por testes e auditoria responsiva.

## Comportamento implementado

- Conversas locais e remotas acompanham novos conteúdos somente quando o usuário está próximo do fim; ao ler mensagens anteriores, a posição é preservada.
- O anexo XML saiu da área dedicada e passou ao botão `+` do compositor. Arquivo, XML atual e conteúdo colado aparecem como item pendente removível e continuam explícitos.
- A geração em lote aparece depois do resultado individual. Limpar lote remove somente lote, prévia e exportações.
- NCMs manuais aceitam múltiplos valores simples ou pontuados, validam atomicamente oito dígitos, eliminam duplicatas, permitem remoção e alimentam os produtos atuais da NF-e em ordem.
- Seções usam Pessoa física e Pessoa jurídica sem alterar os rótulos das ações CPF, RG, CNH, CNPJ e demais geradores.
- Placa possui uma única entrada descobrível e seletor Mercosul/padrão antigo. O ID `placa-antiga` permanece como alias compatível para favoritos, recentes, histórico e links existentes.
- O alvo de upload da Validação XML é integralmente acionável, aceita seleção/drag-and-drop pelo mesmo fluxo e informa os nomes carregados ou substituídos.

## Decisões arquiteturais

- Nenhuma regra de geração foi movida para a interface. Registry e workspace apenas selecionam o adaptador e a variante.
- `renderizarChatPreservandoScroll` é compartilhado pelos renderizadores local e remoto.
- O payload remoto continua sendo o campo XML existente; o novo componente de anexo é extensível na apresentação sem ampliar o contrato da API nesta fase.
- NCMs manuais usam a chave local `gerador:ncms_manuais`, limitada a 50 entradas válidas. A lista não antecipa o gerador de cargas reservado às fases posteriores.
- Seleção e drop de XML convergem em `validarArquivosXml`, preservando limite, leitura local e relatório existentes.

## Arquivos criados ou modificados nesta fase

- `index.html`
- `assets/css/documentos.css`
- `assets/css/evolucao.css`
- `assets/js/chat.js`
- `assets/js/chat-ia.js`
- `assets/js/documentos.js`
- `assets/js/generator-registry.js`
- `assets/js/generator-workspace.js`
- `assets/js/gerador-xml.js`
- `assets/js/home-dashboard.js`
- `assets/js/validacao-xml.js`
- `tests/projeto.test.cjs`
- `docs/ui-architecture.md`
- `docs/future-g-04-immediate-ux-improvements.md`
- `CHANGELOG.md`
- `openspec/changes/archive/2026-09-25-future-g-04-immediate-ux-improvements/*`

## Testes e validação

- `npm test`: 71/71 testes aprovados.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: sete painéis aprovados em zoom de 200%, sem overflow horizontal, controles sem nome ou foco invisível.
- `AUDIT_MATRIX=1 npm run audit:browser`: 112 capturas aprovadas em 360/768/1280/1920 px, temas claro/escuro e sidebar aberta/recolhida.
- `openspec validate future-g-04-immediate-ux-improvements --strict`: mudança válida.

## Riscos e limites restantes

- O anexo remoto continua limitado a XML e 100 KB; formatos adicionais exigem contrato de API próprio em mudança futura.
- NCM manual alimenta os produtos NF-e atuais; o gerador completo de cargas portuárias permanece fora de escopo.
- A validação XML continua local e não substitui XSD, assinatura digital ou consulta SEFAZ.
- Nenhuma regressão foi encontrada nos testes, build ou auditorias. A fase 05 não foi iniciada.
