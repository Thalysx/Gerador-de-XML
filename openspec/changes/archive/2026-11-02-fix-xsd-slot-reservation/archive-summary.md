# Encerramento — BASE-06

02/11/2026. A reprodução HTTP real com dois corpos pendentes e um terceiro completo falhava: o terceiro recebia 200 em vez de 429. O teste também revelou vazamento após duas falhas síncronas do motor em contexto controlado.

Reserva ocorre antes da leitura do corpo; falhas preliminares devolvem a vaga. A responsabilidade é transferida para a conclusão da Promise do motor; timeout HTTP mantém a vaga até esse trabalho terminar. Limite de duas vagas, quinze segundos, headers, status, payloads e motor fiscal preservados.

Quatro regressões cobrem HTTP real, JSON/payload inválido, leitura interrompida, erros síncronos/assíncronos e timeout com relógio controlado. Validação: 133/133 Node, build/auditoria e 12/12 E2E sem retries aprovados. Logs antes/depois e resultados em `artifacts/async-xml/base-06-*`. Não houve teste de carga de produção, fila nova ou timeout novo para o corpo. Spec canônica e change validadas antes do arquivamento.
