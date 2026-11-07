# Decisões

Usar `docs/current-capabilities.md` como inventário de disponibilidade local em 07/11/2026. README e os planos apontam para esse inventário. O arquivo distingue sete rotas existentes, cenários XML salvos e biblioteca operacional ausente; um arquivo histórico ou uma change arquivada não prova disponibilidade no runtime.

Preservar o corpo dos relatórios históricos das fases 09/10, mas identificá-los no título/abertura e explicar suas diferenças em relação ao estado atual. Os registros de releases e planos antigos permanecem históricos. Não alterar textos de cenários XML que descrevem uma funcionalidade existente; tornar a nomenclatura mais precisa nas referências atuais.

Alinhar somente as partes da spec `history-favorites` ainda baseadas na divisão Geral/Portuário e em massas operacionais. A fonte de verdade já implementada é `assets/js/productivity.js`, a decisão de catálogo único e seus testes: favoritos e atividade juntos, limite de 50, limpeza de toda a atividade sem apagar favoritos/históricos detalhados. Nenhuma migração ou mudança de comportamento acompanha a correção da spec.

Verificação proporcional: suíte Node existente, build, validação OpenSpec e links locais dos documentos atuais alterados. Conferir os testes de ausência de cenários operacionais, salvamento/restauração XML e atividade unificada. Não escrever testes que apenas espelhem frases, nem repetir a matriz visual/E2E por mudanças somente documentais. Registrar hashes dos arquivos de aplicação, infraestrutura, testes e schemas antes/depois para demonstrar preservação.
