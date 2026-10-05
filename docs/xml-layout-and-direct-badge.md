# XML Fiscal restaurado e crachá automático

Correção da versão `3.0.0-alpha.5`, em 05/10/2026, solicitada após a revisão visual da alpha.4.

Clicar na opção **Crachá** gera imediatamente um cartão com as opções atuais. O mesmo comportamento vale para Home e busca global. Modelo e código de barras continuam disponíveis para personalização; **Gerar Crachá** e **Ctrl+Enter** permitem gerar outro cartão. Abrir o workspace para navegação ou restauração não cria um registro extra.

A tela **XML Fiscal** recupera a organização do commit `4a46652`: seleção do documento, cenários salvos e NCMs manuais visíveis; formulários à esquerda e prévia à direita em telas largas. Em telas menores, as áreas se empilham. Gerar novos dados, usar campos atuais, preservar campos, downloads, copiar, validar e abrir no editor ficam diretamente acessíveis. O foco acompanha a navegação para o Editor, com cópia integral e preservação do XML de origem.

A paleta compartilhada da alpha.4 permanece. Os motores, contratos de dados, armazenamento, demais telas e integração fiscal local mantêm suas funções. SEFAZ segue cancelada.

## Verificação

- `npm test`: 118 testes aprovados, incluindo geração do crachá pela opção, Home e busca, opções retidas, um registro por ação, botão e atalho, exportação e restauração.
- `npm run build`: aprovado; runtime Lucide com 51 ícones e 11.744 bytes.
- `npm run audit:browser`: aprovado; sete painéis, 193 passos de teclado, console limpo e Editor com NF-e/CT-e em 360 px nos dois temas.
- Matriz Chromium: 224 combinações mais 56 estados expandidos, sem controles excedentes nem rolagem horizontal.
- Evidências locais: `artifacts/visual-review/auditoria-200.json` e `../artifacts/refactor-the-generator-ui/final/measurements.json`, com capturas dos respectivos layouts.

As verificações cobrem Chromium automatizado. Dispositivo físico, outros navegadores e leitor de tela permanecem verificações manuais. A IA pública da Vercel continua dependente da configuração da hospedagem, fora desta correção.
