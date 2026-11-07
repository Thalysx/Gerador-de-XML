# Checklist de validação com leitor de tela

Roteiro manual da **FUTURE G**, alinhado ao [design vigente](DESIGN.md) em 07/11/2026. A escuta com leitor de tela real continua pendente; nenhum item abaixo foi concluído por esta revisão documental. As auditorias automatizadas têm evidências e limites próprios e não confirmam como o conteúdo é falado.

## Preparação

1. Sirva o checkout que será avaliado com `npm run dev` e abra o endereço local exibido no terminal em um navegador compatível com seu leitor de tela. Registre o commit/estado local e a URL. Para avaliar uma publicação específica, use e registre a URL dessa versão; este roteiro não fixa um deploy histórico como versão atual.
2. Ative o Narrador do Windows com `Windows + Ctrl + Enter`.
3. Use `Tab` e `Shift + Tab` para percorrer controles. Quando necessário, use as setas e `Enter` para escolher uma opção.
4. Escute a leitura inteira de cada item antes de avançar.

## O que conferir

- [ ] O nome **FUTURE G**, o catálogo único e a área principal são anunciados com clareza.
- [ ] O menu informa a área selecionada entre Início, XML fiscal, Dados cadastrais, Cadastro geral, Editor XML, Validação XML e Comandos locais.
- [ ] A troca de ferramenta funciona pelo teclado e o foco chega ao título ou ao primeiro conteúdo útil da nova tela.
- [ ] No XML fiscal, campos, cenários XML salvos, tipo de documento, NCMs e botões de gerar, copiar, baixar, validar e abrir no editor são anunciados com nome e estado coerentes.
- [ ] Em Dados cadastrais e Cadastro geral, filtros, opções de máscara, resultados, histórico e botões de cópia informam sua finalidade.
- [ ] No Editor XML, seleção de arquivo, busca, revisão das alterações e cabeçalhos da tabela são lidos na ordem esperada.
- [ ] Em Validação XML, o aviso de processamento no navegador/servidor, a entrada, os filtros e a região “Resultados detalhados da validação XML” são anunciados; após validar, o foco chega ao relatório e a cobertura XSD/local é compreensível.
- [ ] Em Comandos locais, mensagem, sugestões revisáveis, anexo pendente/Remover, Enviar, opções e resultado ou erro local são anunciados sem referência a um modo remoto.
- [ ] A busca global informa resultados e seleção; Fechar por Enter/Espaço encerra o diálogo e devolve o foco sem gerar um dado.
- [ ] As mensagens de sucesso, erro e limite atingido são faladas sem exigir busca manual pela página.
- [ ] O alternador de tema informa seu nome e estado.
- [ ] Não há controles anunciados apenas como “botão”, “editar”, “grupo” ou “em branco”, sem contexto suficiente.
- [ ] Não há repetição excessiva, mudança inesperada de foco ou conteúdo importante ignorado.

## Registro do resultado

Preencha após o teste:

- Data:
- URL e commit/estado local:
- Windows:
- Navegador e versão:
- Leitor de tela e versão:
- Resultado: aprovado / precisa de ajuste
- Tela e controle com problema:
- Texto anunciado:
- Texto esperado:

Para encerrar o Narrador, pressione novamente `Windows + Ctrl + Enter`.

O procedimento segue a orientação da Microsoft de testar a aplicação com o Narrador ativo e avaliar a saída falada durante a navegação: [Accessibility testing](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-testing).
