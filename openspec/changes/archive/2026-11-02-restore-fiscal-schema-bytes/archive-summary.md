# Encerramento — etapa 1 / BASE-01

02/11/2026. Sete XSDs restaurados dos ZIPs oficiais já referenciados pelo manifesto, depois de conferir os dois hashes de pacote e cada arquivo. Diferenças limitadas a fins de linha; manifesto, hashes, wrapper derivado, código e testes fiscais permaneceram intactos.

`.gitattributes` protege os XSDs vendorizados contra normalização e mantém os espaços originais do pacote. O SHA-256 continua sendo a verificação de bytes brutos, inclusive whitespace; nenhum relaxamento do verificador foi implementado.

Resultados: Node 127/127 (oito fiscais existentes); build e auditoria aprovados; E2E 10/10 desktop/mobile sem retries. Os doze hashes passaram em index isolado, checkouts autocrlf true/false/input e ZIP de git archive. Cópia adulterada foi recusada pelo código real. Index do repositório real e configuração global do Git preservados.

Fluxo pelo navegador: NF-e sintética do gerador recebeu XSD aprovado/HTTP 200; conteúdo incompleto recebeu XSD reprovado/HTTP 200 e três achados. Screenshot aberta e inspecionada; zero erros de página observados. Nenhuma consulta SEFAZ, deploy ou aprovação jurídica foi executada.

Spec canônica atualizada; change e spec validadas em modo estrito com OpenSpec 1.16.0. Os avisos globais de comprimento de requisitos não alterados em `ai-assistant` e `ui-system` permanecem documentados.

Relatório: `docs/quality/fiscal-schema-integrity.md`; evidências ignoradas em `artifacts/xsd-integrity/` e `artifacts/e2e/xsd-integrity/`, fora do build público. Branch local `fix/fiscal-schema-integrity`, preservando o working tree anterior; sem commit, push ou PR.

BASE-01 encerrado. Etapas 2 a 10 não foram implementadas nesta change. Próxima entrega: reproduzir e tratar os estados assíncronos em incrementos menores e sequenciais. As demais pendências conhecidas continuam abertas.
