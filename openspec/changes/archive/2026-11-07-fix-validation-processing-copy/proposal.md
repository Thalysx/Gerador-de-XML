# BASE-02 — explicar o processamento da validação XML

## Why
A tela promete que a análise inteira acontece no navegador, não verifica XSD e não envia arquivos. O fluxo existente envia NF-e e CT-e 4.00 compatíveis para a API da aplicação. O aviso precisa corresponder ao processamento antes da seleção ou validação.

## What Changes
- Distinguir sintaxe e regras locais no navegador da verificação XSD no servidor da aplicação.
- Informar antes da entrada que selecionar/arrastar arquivos ou acionar validação pode enviar XML compatível de até 4 MiB ao serviço XSD, que não armazena nem registra seu conteúdo.
- Explicar cobertura de versões, indisponibilidade e limites fiscais sem prometer validação oficial.
- Alinhar a documentação atual e registrar o encerramento de BASE-02.

## Impact
Somente textos HTML, documentação e requisito de comunicação. Sem alterar JavaScript, CSS, IDs, handlers, APIs, limites, regras fiscais, schemas, persistência ou comportamento dos comandos locais. Sem dependências, novo fluxo de consentimento, publicação ou correções dos demais itens do backlog.
