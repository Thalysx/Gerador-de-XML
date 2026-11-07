# Decisões

- O manifesto existente é a referência imutável: conferir primeiro SHA-256 de ambos os ZIPs e depois de cada XSD oficial incorporado. O wrapper derivado `procNFe` permanece intacto.
- Extração por bytes, nunca por conversão UTF-8 ou parse/serialização XML. Antes de escrever, todas as comparações precisam passar; os arquivos locais normalizados apenas para diagnóstico devem coincidir com a origem.
- Atributo Git `-text` somente nos XSDs vendorizados, para preservar seus fins de linha originais, inclusive mistos. Não impor LF ou CRLF universalmente; o hash já especifica os bytes corretos de cada arquivo.
- Não atualizar hashes para corresponder ao checkout corrompido e não relaxar `verifySchemas` ou os testes.
- Verificar checkout em repositório de teste isolado, sem alterar o index real ou preferências globais do Git. Artefatos e ZIPs ficam ignorados e fora do build público.

Riscos: fonte errada, atualização silenciosa de pacote, reencoding, conversão futura pelo Git e efeitos no empacotamento de deploy. Mitigar com hashes existentes, comparação integral da origem, testes fiscais positivos/negativos, checkout/archive e diff da aplicação preservado. A validação XSD não implica autorização SEFAZ ou validade jurídica.
