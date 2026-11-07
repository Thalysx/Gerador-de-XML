# Restaurar integridade dos schemas fiscais — BASE-01

## Why
Sete XSDs versionados perderam os bytes CRLF presentes nos pacotes oficiais e esperados pelo manifesto. A verificação existente bloqueia o motor, provocando quatro falhas fiscais. Os ZIPs oficiais foram obtidos novamente e seus hashes coincidem com os valores já registrados.

## What Changes
- Comparar arquivos oficiais por SHA-256 e comprovar que as divergências locais se limitam a fins de linha.
- Restaurar somente os sete arquivos divergentes com bytes extraídos dos ZIPs verificados, sem reserialização.
- Proteger todos os XSDs vendorizados contra conversão automática do Git usando atributos por caminho.
- Comprovar hashes após checkout com diferentes configurações de autocrlf e após archive; registrar resultados e encerrar BASE-01.

## Impact
Somente empacotamento dos schemas, atributos Git, especificação e documentação. Manifesto/hashes, motores, testes fiscais, modelos/XML gerado, APIs, interface, dependências e rolagem não são alterados. Sem atualização de pacote fiscal ou implementação das outras nove etapas.
