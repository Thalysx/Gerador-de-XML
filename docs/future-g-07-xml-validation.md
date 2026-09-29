# FUTURE G 07 — Validação XML avançada

Fase concluída localmente em 27/09/2026, sem iniciar o QA Portuário do OpenSpec 8.

## Entrega

- O motor existente `analisarXml` continua sendo o único ponto de validação para conteúdo colado, arquivos, XML do gerador, artefatos da IA e testes negativos.
- Cada relatório usa achados estruturados com severidade `erro`, `aviso` ou `informacao`, etapa, problema e, quando disponíveis, código, tag, valor, caminho, linha e coluna.
- A análise cobre sintaxe, raiz, namespace, estrutura fiscal, campos obrigatórios, chave, modelo, CPF/CNPJ, produtos, valores, totais e protocolo conforme as regras locais disponíveis.
- O relatório apresenta três visões associadas ao mesmo documento: Resumo, XML e Validação. As abas funcionam com clique, Tab, setas, Home e End.
- O Resumo reúne tipo, raiz, chave, emitente, documento, destinatário, quantidade de itens, valor total e peso bruto quando esses dados existem.
- A visão XML preserva a fonte analisada, permite abrir uma cópia válida no editor e baixar variantes negativas.
- O filtro de severidade altera somente a apresentação; o relatório integral permanece disponível para exportação.
- A exportação JSON inclui resumo e achados estruturados, mas não inclui o conteúdo XML, estado visual ou referência editável.

## Testes negativos

A tela cria uma cópia do XML atual de NF-e ou CT-e e aplica uma destas inconsistências intencionais:

- CPF inválido;
- CNPJ inválido;
- chave de acesso inválida;
- campo obrigatório ausente;
- formato de modelo inválido;
- tag obrigatória renomeada;
- XML malformado.

O documento-base em `xmlsGerados` não é alterado. O relatório e o download mostram explicitamente “Teste negativo” e “Dado sintético intencionalmente inválido”. O conteúdo também é colocado na área de texto para inspeção e repetição do teste.

## Compatibilidade

- Geração de NF-e/CT-e, formulários, cenários, campos preservados, produtos, prévia, download, editor e encaminhamento para validação continuam usando os adaptadores existentes.
- XML com namespace prefixado continua aceito após normalização local.
- XML desconhecido recebe análise sintática e aviso de cobertura; DTD e entidades declaradas continuam recusados.
- Arquivos continuam limitados a 10 por análise e 5 MB por XML. O anexo do Assistente mantém seu limite independente.
- O editor recebe somente cópias de XML bem formado e reconhecido; o relatório conserva sua própria fonte.

## Verificação

- `npm test`: 84 testes aprovados, 0 falhas.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: sete painéis aprovados em viewport CSS de 640 × 450, equivalente à escala de 200%; 234 passos de teclado, nenhum overflow horizontal, controle sem nome, foco invisível ou foco sem contorno.
- A captura escura da tela de validação foi inspecionada depois da auditoria. A entrada, os controles de teste negativo e a área de resultados permanecem dentro do layout responsivo.
- `git diff --check`: nenhuma falha de whitespace; apenas avisos de normalização LF/CRLF já presentes no ambiente Windows.

## Arquivos do incremento

### Criados

- `docs/future-g-07-xml-validation.md`.

### Modificados

- `assets/js/validacao-xml.js`;
- `assets/css/validacao-xml.css`;
- `index.html`;
- `tests/projeto.test.cjs`;
- `README.md`, `ATUALIZACOES.md`, `CHANGELOG.md` e `AUDITORIA-VISUAL.md`;
- `openspec/changes/archive/2026-09-27-future-g-07-xml-validation/tasks.md`.

## Decisões arquiteturais

- O modelo estruturado foi adicionado ao relatório existente, preservando `nivel`, `etapa`, `mensagem` e `localizacao` para compatibilidade com consumidores anteriores.
- Resumo, XML e Validação são projeções do mesmo objeto em `relatoriosXml`; não há cópias concorrentes de estado.
- Variantes negativas clonam o documento atual antes da mutação e usam o mesmo analisador da entrada normal.
- Metadados da variante são exportáveis, mas o XML-fonte fica excluído do relatório JSON inclusive para testes negativos.
- Regras compartilhadas de consistência permanecem em `xml-workflow.js`; a tela adiciona detalhes de apresentação e de localização sem duplicar o gerador fiscal.

## Limites e riscos conhecidos

- A validação continua local e deliberadamente não substitui XSD, assinatura digital, regras tributárias completas ou autorização na SEFAZ.
- Linha e coluna dependem da informação exposta pelo parser do navegador; quando indisponíveis, o relatório informa essa limitação.
- O resumo é uma leitura de conveniência e não representa autorização, escrituração ou validade jurídica do documento.
- Variantes negativas existem somente para QA controlado e não devem ser usadas como documento fiscal.
- A auditoria automatizada não substitui a validação auditiva manual com leitor de tela real.

## Encerramento

Todos os itens e o relatório de conclusão do OpenSpec 7 estão fechados. A fase 8 não foi iniciada automaticamente.
