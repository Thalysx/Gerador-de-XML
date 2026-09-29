# FUTURE G UI System — Tasks

## 1. Diagnóstico
- [x] Inspecionar a implementação atual antes de alterar código.
- [x] Verificar UI libraries, shadcn e Lucide existentes.
- [x] Identificar telas/componentes afetados e riscos de regressão.

## 2. Base visual
- [x] Integrar shadcn/ui somente se compatível/necessário.
- [x] Integrar Lucide somente se compatível/necessário.
- [x] Preservar identidade FUTURE G e tokens existentes.
- [x] Padronizar hover, focus, active, disabled, success e error.
- [x] Evitar uso indiscriminado de Cards.

## 3. Geradores
- [x] Remover `Selecionar -> Gerar` dos geradores simples.
- [x] Fazer a própria opção executar a geração.
- [x] Manter `Gerar` separado apenas quando houver configuração.
- [x] Preservar máscaras, opções relacionadas e lote.

## 4. Busca
- [x] Mover busca para o topo da configuração.
- [x] Posicionar filtros junto à busca.
- [x] Respeitar ambiente ativo e teclado.

## 5. Resultado
- [x] Manter painel renderizado desde a entrada.
- [x] Criar Empty State.
- [x] Atualizar resultado no mesmo painel.
- [x] Preservar Copiar, Gerar novamente, Limpar e exportação quando aplicáveis.

## 6. Categorias
- [x] Substituir accordions desnecessários por seções/grids.
- [x] Manter collapsibles somente quando justificados.
- [x] Validar leitura responsiva.

## 7. Assistente
- [x] Remover Card/Box externo desnecessário.
- [x] Usar toda a área útil da página.
- [x] Manter Sidebar FUTURE G.
- [x] Composer na região inferior e anexos integrados.
- [x] Preservar auto-scroll e integrações de IA.

## 8. Microinterações
- [x] Feedback discreto de pressed.
- [x] Transição curta do resultado.
- [x] `Copiar -> Copiado`.
- [x] Feedback de `Gerar novamente`.
- [x] Sem spinner em operações síncronas.
- [x] Loading somente para espera real.
- [x] Respeitar reduced motion.

## 9. Separação Geral/Portuário
- [x] Revisar Cadastro Geral.
- [x] Remover composição portuária indevida.
- [x] Garantir registro portuário no QA Portuário.
- [x] Garantir busca e componentes respeitando o ambiente.

## 10. Validação
- [x] Desktop, notebook, tablet e mobile.
- [x] Teclado, foco, contraste, tooltips e nomes acessíveis.
- [x] Geração individual/lote, copiar, gerar novamente, máscaras, XML, IA e troca de ambiente.
- [x] Tema claro/escuro e console.
- [x] Rodar lint, testes e build disponíveis.

## 11. Finalização
- [x] Documentar arquivos alterados, componentes shadcn, ícones Lucide e decisões de UX.
- [x] Informar pendências.
- [x] NÃO iniciar future-g-06-general-generators automaticamente.
