# Decisões

Manter o motor e o handler existentes. Declarar o diretório do runtime em includeFiles, preservando os demais arquivos já incluídos. O Worker e seu binário WASM precisam ser mantidos juntos; a resolução dinâmica pelo código da dependência não deve depender de inferência do trace do build.

A regressão cria um pacote temporário com a entrada e o Worker rastreáveis e adiciona os recursos declarados pelo includeFiles. Executa a dependência real fora de node_modules original, com um schema mínimo sintético, cobrindo aceitação e rejeição. A suíte fiscal existente continua conferindo os XSDs oficiais separadamente. O teste não substitui o build real da Vercel.

O erro público não contém detalhes internos ou XML e não será ampliado para diagnóstico. A reprodução local, o diff de configuração e a verificação HTTP posterior documentam a correção. Logs autenticados da plataforma não ficaram disponíveis devido à reautenticação pendente do conector; não afirmar que foram consultados.
