# Desenho — baseline observacional

## Contexto

FUTURE G alpha.7 usa scripts clássicos globais, seis folhas CSS proprietárias, registry compartilhado e dois ambientes. A fase é somente diagnóstico. Preservar fonte, formatos persistidos, scroll, contratos e API fiscal.

## Decisões

1. Executar sequencialmente testes, build e auditoria, pois o build regrava o subset Lucide consumido pelas outras ferramentas.
2. Medir exit code e tempo de parede separadamente; guardar logs mesmo quando testes falham.
3. Comparar SHA-256 dos 253 arquivos originais antes/depois, já que Git não está disponível nesta cópia.
4. Copiar evidência da matriz para `artifacts/quality/baseline/matrix`, sem mover a saída original e sem alterar o coletor.
5. Distinguir falhas XSD, problemas de produto já reproduzidos e hipóteses de acessibilidade/UX.
6. Não transformar captura de diagnóstico em snapshot visual aprovado nem instalar OpenSpec só para validar documentos nesta fase sem novas dependências.
7. Registrar a próxima proposta em `docs/quality/next-e2e-proposal.md`, mantendo apenas esta entrega como fase executada.

## Riscos

- A auditoria sem CDN usa fallback de fonte: não comprova o layout com fontes externas.
- A matriz não emula teclado virtual ou toque e não faz comparação pixel a pixel.
- Passar no build não comprova funcionamento de XSD; a integridade fiscal continua falhando.
- A captura padrão chamada Home escura não está no painel correto; usar capturas nomeadas da matriz e registrar o defeito.
- OpenSpec strict e operações Git não executados devem permanecer explícitos, sem alegação de aprovação.

## Verificação

Aceite observacional: logs e métricas completos, cobertura inventariada, matriz disponível, amostras abertas, arquivos originais idênticos e limites declarados. Falha preexistente é resultado válido do diagnóstico, não aceite de release.

## Reversão

Remover somente os documentos novos desta entrega e seus artefatos locais, se necessário. Não reverter nem apagar arquivos de aplicação, storage do usuário ou evidências de outras entregas.
