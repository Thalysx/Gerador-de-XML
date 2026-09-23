# Checklist de validação com leitor de tela

Este roteiro conclui a verificação auditiva da **TheGenerator** no site publicado. A auditoria automatizada já aprovou nomes acessíveis, funções, foco, teclado e a árvore nativa do Chromium; esta etapa confirma como essas informações são faladas por um leitor de tela real.

## Preparação

1. Abra [https://gerador-all.netlify.app](https://gerador-all.netlify.app) no Microsoft Edge ou Google Chrome.
2. Ative o Narrador do Windows com `Windows + Ctrl + Enter`.
3. Use `Tab` e `Shift + Tab` para percorrer controles. Quando necessário, use as setas e `Enter` para escolher uma opção.
4. Escute a leitura inteira de cada item antes de avançar.

## O que conferir

- [ ] O nome **TheGenerator**, a assinatura “Dados de teste. Do seu jeito.” e a área principal são anunciados com clareza.
- [ ] O menu informa o nome de cada ferramenta e qual item está selecionado: XML fiscal, Dados cadastrais, Cadastro geral, Editor XML, Validação XML e Assistente de geração.
- [ ] A troca de ferramenta funciona pelo teclado e o foco chega ao título ou ao primeiro conteúdo útil da nova tela.
- [ ] No XML fiscal, campos, seções recolhíveis, tipo de documento, botões de gerar, copiar, baixar, validar e abrir no editor são anunciados com nome e estado coerentes.
- [ ] Em Dados cadastrais e Cadastro geral, filtros, opções de máscara, resultados, histórico e botões de cópia informam sua finalidade.
- [ ] No Editor XML, seleção de arquivo, busca, revisão das alterações e cabeçalhos da tabela são lidos na ordem esperada.
- [ ] Em Validação XML, a entrada do XML, os filtros de gravidade e a região “Resultados detalhados da validação XML” são anunciados; após validar, o foco chega ao relatório.
- [ ] No Assistente de geração, campo da mensagem, sugestões, anexo, envio, estado de processamento, ferramentas executadas e resposta final são anunciados.
- [ ] As mensagens de sucesso, erro e limite atingido são faladas sem exigir busca manual pela página.
- [ ] O alternador de tema informa seu nome e estado.
- [ ] Não há controles anunciados apenas como “botão”, “editar”, “grupo” ou “em branco”, sem contexto suficiente.
- [ ] Não há repetição excessiva, mudança inesperada de foco ou conteúdo importante ignorado.

## Registro do resultado

Preencha após o teste:

- Data:
- Windows:
- Navegador e versão:
- Leitor de tela e versão:
- Resultado: aprovado / precisa de ajuste
- Tela e controle com problema:
- Texto anunciado:
- Texto esperado:

Para encerrar o Narrador, pressione novamente `Windows + Ctrl + Enter`.

O procedimento segue a orientação da Microsoft de testar a aplicação com o Narrador ativo e avaliar a saída falada durante a navegação: [Accessibility testing](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-testing).

