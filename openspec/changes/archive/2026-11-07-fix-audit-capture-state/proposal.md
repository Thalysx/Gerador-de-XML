# BASE-08 — conferir o estado das capturas de auditoria

## Why
Após medir um resultado estruturado, o auditor salva Dados cadastrais como `future-g-home-dark.png`, sem voltar à Home. A imagem existente reproduz o defeito. Outro arquivo chamado Home contém o resultado de CPF em Dados cadastrais. Nomear uma imagem não comprova o estado capturado.

## What Changes
- Selecionar explicitamente Home/escuro e voltar ao topo antes de sua captura.
- Conferir painel visível/ativo, aba selecionada, tema e catálogo antes de cada captura salva no roteiro padrão e na matriz; conferir dimensões/sidebar quando declaradas.
- Registrar expectativa, estado observado e hash da imagem num manifesto da execução, marcado incompleto até terminar.
- Renomear a captura do resultado CPF para identificar Dados cadastrais.
- Verificar a proteção contra estados incorretos e executar o auditor e a matriz reais.

## Impact
Somente infraestrutura de auditoria, testes, requisito e documentação. Preservar aplicação, contratos fiscais e trabalho anterior. Sem redesign, baseline visual aprovada, dependências novas ou publicação. Capturas de aquecimento sem arquivo continuam fora do manifesto.
