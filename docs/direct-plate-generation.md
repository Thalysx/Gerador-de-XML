# Geração automática de placa

Versão `3.0.0-alpha.6`, em 05/10/2026.

Selecionar **Placa** gera imediatamente o resultado, usando o padrão atual: Mercosul ou antigo. Home e busca global seguem o mesmo comportamento. O seletor de formato permanece visível; **Gerar Placa** e **Ctrl+Enter** permitem gerar outro resultado.

A ativação preserva o padrão escolhido antes de abrir o workspace. A navegação programática permanece sem geração, e o alias explícito `placa-antiga` continua selecionando o padrão antigo. Cada ação gera um único registro no histórico; os contratos de geração, exportação e restauração permanecem iguais.

Telefone mantém sua configuração atual. XML Fiscal e crachá conservam a correção da alpha.5.

## Verificação

- `npm test`: 119 testes aprovados, incluindo ativação da placa nos dois formatos, Home, busca, alias antigo, botão e atalho, com um registro por ação.
- `npm run build`: aprovado, com o runtime Lucide de 11.744 bytes.
- `npm run audit:browser`: aprovado nos sete painéis, com 193 passos de teclado, console limpo e quatro casos do Editor carregado em 360 px.
- `openspec validate --all --strict`: 13 itens aprovados antes do arquivamento.

Não houve alteração de layout nesta versão. Evidência local de navegador: `artifacts/visual-review/auditoria-200.json`. As verificações automatizadas usam Chromium; outros navegadores, dispositivo físico e leitor de tela permanecem verificações manuais.
