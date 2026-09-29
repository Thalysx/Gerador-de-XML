# FUTURE G 11 — Polimento e robustez

Fase concluída localmente em 28/09/2026. Esta é a última mudança do roadmap FUTURE G; nenhuma mudança seguinte foi iniciada.

## Entrega

- Auditoria responsiva de 128 combinações: oito painéis, dois temas, larguras de 360, 768, 1280 e 1920 px e sidebar expandida/recolhida.
- Correção do único excesso encontrado, no botão de geração de XML negativo a 360 px, com largura limitada e rótulo quebrável.
- Auditoria de acessibilidade nas oito telas com árvore nativa, percurso real de teclado, nomes de controles e marcos, foco visível e movimento reduzido.
- Estado de processamento real no upload XML, com mensagem ao vivo, `aria-busy` e bloqueio temporário do seletor de arquivos.
- Auditoria de console, busca global por ambiente e orçamentos de recursos incorporada ao script de navegador.
- Runtime local Lucide reduzido de 433.756 para 11.467 bytes por um gerador determinístico de 49 ícones.

## Decisões de arquitetura

`scripts/build-icons.cjs` importa os ícones necessários do pacote `lucide`, serializa somente seus nós SVG e mantém o contrato `window.lucide.createIcons`/`window.lucide.icons` já usado pela aplicação. O build executa essa etapa antes de preparar os arquivos públicos. A lista explícita inclui ícones estáticos e criados dinamicamente pelo registry; a regressão DOM confirma que todos são renderizados.

O auditor de navegador é a barreira operacional única para overflow, acessibilidade estrutural, foco, movimento reduzido, paleta global e console. Os limites atuais são 20 KB para o runtime Lucide, 600 KB para JavaScript local, 150 KB para CSS local e 2.500 nós DOM. Eles são limites de regressão, não metas de preenchimento.

A leitura de XML é a operação local assíncrona que justifica feedback de carregamento. Geradores síncronos continuam sem espera artificial. O controle de versão já existente impede que uma leitura antiga substitua a mais recente; o estado ocupado só é removido pela operação ainda ativa ou pela limpeza explícita.

Os arquivos JavaScript de primeira parte permanecem como scripts clássicos separados por domínio, porque `scripts/engine.cjs`, JSDOM e handlers existentes dependem desse contrato. Não houve reescrita para framework ou módulos ES na fase de hardening.

## Arquivos

Criados:

- `scripts/build-icons.cjs`
- `docs/future-g-11-polish.md`

Modificados nesta entrega:

- `assets/css/validacao-xml.css`
- `assets/js/lucide.min.js`
- `assets/js/validacao-xml.js`
- `scripts/audit-browser.cjs`
- `tests/projeto.test.cjs`
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `ATUALIZACOES.md`
- `AUDITORIA-VISUAL.md`
- `docs/ui-architecture.md`
- `openspec/specs/export-accessibility/spec.md`
- `openspec/specs/ui-system/spec.md`
- `openspec/specs/xml-validation/spec.md`
- `openspec/changes/archive/2026-09-28-future-g-11-polish/proposal.md`
- `openspec/changes/archive/2026-09-28-future-g-11-polish/design.md`
- `openspec/changes/archive/2026-09-28-future-g-11-polish/tasks.md`

## Verificação

- `npm test`: 104 testes aprovados, 0 falhas.
- `npm run build`: subset Lucide regenerado e distribuição pública criada.
- `npm run audit:browser`: oito telas aprovadas em Chromium a 200%, busca global isolada por ambiente, zero overflow, controle ou marco sem nome, foco invisível ou sem contorno, erro, aviso ou exceção de console.
- `$env:AUDIT_MATRIX='1'; npm run audit:browser`: 128 capturas, 0 falhas.
- Orçamentos medidos: Lucide 11.467 bytes; JavaScript local 336.163 bytes; CSS local 107.872 bytes; 1.420 nós DOM.
- Revisão das capturas escura, clara, Validação XML e paleta global, após alinhar a troca de ambiente do próprio auditor ao fluxo real da interface.

## Limites e riscos

- A validação auditiva manual com leitor de tela real continua separada da árvore de acessibilidade automatizada.
- Bootstrap e fontes ainda possuem integração externa; o auditor remove esses recursos para testar a degradação local determinística.
- Os limites de recursos protegem contra crescimento acidental, mas não substituem métricas de uso real, rede ou dispositivos de baixa potência.
- A aplicação preserva scripts clássicos globais por compatibilidade; qualquer migração futura para módulos exige adaptar o engine e a suíte em conjunto.
- Nenhuma regressão conhecida permaneceu após a suíte, o build, o console audit e a matriz responsiva.
