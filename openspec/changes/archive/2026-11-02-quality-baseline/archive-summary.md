# Encerramento da Fase 0 — 02/11/2026

Change: `quality-baseline`. Schema `spec-driven`, manutenção diagnóstica com `skip_specs: true`. Esta é a entrega inicial incremental do plano mestre; as Fases 1–7 não foram implementadas nesta entrega.

## Entregue

- [Baseline medida](../../../../docs/quality/baseline.md), com ambiente, dependências, tempos, cobertura REG-01 a REG-12 e limites.
- [Problemas conhecidos](../../../../docs/quality/known-issues.md), separados das regressões da entrega.
- [Próxima proposta E2E](../../../../docs/quality/next-e2e-proposal.md), sem instalação ou início de uma segunda fase.
- Logs, hashes, relatório do navegador, 224 capturas de combinações, 56 de estados expandidos e duas capturas auxiliares em `artifacts/quality/baseline/`.

## Verificação

| Verificação | Resultado |
| --- | --- |
| Testes existentes | 120/124 passaram; quatro falhas XSD preexistentes registradas |
| Build | Passou |
| Auditoria padrão | Passou; 193 passos de teclado; console da aplicação limpo |
| Matriz responsiva | 224 combinações + 56 estados expandidos; zero falhas geométricas |
| Inspeção visual | Dez capturas representativas abertas, nos dois temas e quatro larguras |
| Integridade dos originais | 253 arquivos comparados por SHA-256; zero alterações ou remoções |
| Documentação | Links locais resolvidos; sem whitespace final detectado |
| Fronteira pública | Nenhum documento, teste, artefato, script backend ou change no diretório público gerado |

`artifacts/quality/baseline/delivery-verification.json` registra os controles locais. A validação OpenSpec oficial não foi executada porque a CLI não está instalada; revisão estrutural e links não são apresentados como substitutos de `openspec validate --all --strict`.

## Limites preservados

Esta cópia não possui `.git`: branch, commit, diff e PR não foram criados. Nenhuma dependência foi instalada nesta fase. Não houve alteração de interface, regras fiscais, geradores, IDs, handlers, storage, APIs ou scroll; não houve deploy. Build e coleta recriaram somente suas saídas geradas, com fonte original idêntica.

O aceite é do diagnóstico com resultado explícito, não de uma release saudável. As quatro falhas fiscais continuam bloqueando uma afirmação de aprovação integral; nenhuma foi ignorada ou removida. Revisão humana de snapshots, leitor de tela, novos testes e serviços de CI continuam pertencendo às próximas entregas.

## Reversão

Se necessário, remover somente os documentos e os artefatos identificados nesta change. Nenhum arquivo original ou dado persistido precisa ser revertido.
