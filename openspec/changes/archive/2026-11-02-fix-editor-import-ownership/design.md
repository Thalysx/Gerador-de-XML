# Decisões

Uma operação por lote guarda grupo de destino, leitores e estado de cancelamento em memória. Só leituras pertencentes a operações válidas podem inserir arquivos. A seleção de outro grupo não cancela o lote, mas sua conclusão não troca o grupo do usuário. Limpar grupo cancela apenas seus lotes; reset cancela todos e aborta leitores ainda lendo. Eventos atrasados são idempotentes e ignorados quando cancelados.

Todo arquivo tem conclusão única para liberar a operação ao final do lote, inclusive erro/abort ou readAsText que lança. Dados dos arquivos válidos continuam acessíveis; nenhuma mudança na interpretação fiscal ou no formato de exportação. Operações concorrentes válidas no mesmo grupo continuam adicionando seus arquivos.

Riscos: seleção roubada, documentos descartados reaparecendo, conclusão perdida após erro e cancelamento excessivo de outros grupos. Testar ordem de callbacks, clear/reset e lote misto antes de arquivar.
