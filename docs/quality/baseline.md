# Baseline de qualidade — FUTURE G

Data: **02/11/2026**, fuso de referência `America/Sao_Paulo`.

Entrega: **Fase 0** do `FUTURE_G_PLAN_QUALIDADE_UX_AUTOMACAO.md` fornecido pelo usuário. O pedido de implementação inicia a entrega incremental; o comando sugerido na seção 11 do plano é uma referência de sequência, não uma instrução de sistema. Não foram instaladas dependências nem iniciadas as fases seguintes.

## Resultado

A baseline foi registrada, com falhas preexistentes identificadas. **A aplicação não está integralmente aprovada:** quatro testes fiscais falham por divergência dos bytes dos schemas XSD. Build e auditorias de navegador passaram. Concluir o diagnóstico não equivale a aprovar uma release.

Nenhum dos **253 arquivos originais** foi alterado ou removido: comparação SHA-256 antes/depois em `artifacts/quality/baseline/source-comparison.json`. O build regravou seu subset Lucide com conteúdo idêntico e recriou `.generated-public`. Os novos arquivos desta entrega são documentação e evidências de diagnóstico.

## Ambiente observado

| Item | Valor |
| --- | --- |
| Diretório da aplicação | `Gerador-de-XML-main/` dentro da pasta de trabalho com o mesmo nome |
| Pacote | `future-g@3.0.0-alpha.7` |
| Git | Esta cópia não possui `.git`; branch, commit, status e diff não estão disponíveis |
| Node.js executado | `v24.19.0` |
| npm executado | `11.17.0` |
| Sistema | Windows, x64 |
| Navegador do auditor | Chrome instalado |
| OpenSpec CLI | Não encontrado no PATH; validação oficial não executada |

Não foi criado um repositório Git artificial para contornar a ausência do histórico. Nenhum commit, branch, PR ou publicação remota foi criado. Para essas operações, usar um checkout real em entrega posterior.

### Dependências instaladas antes da Fase 0

| Pacote | Versão | Licença declarada |
| --- | --- | --- |
| `@vercel/speed-insights` | `2.0.0` | Apache-2.0 |
| `jsdom` | `26.1.0` | MIT |
| `lucide` | `1.44.0` | ISC |
| `xmllint-wasm` | `5.3.0` | MIT |
| `ws` | `8.21.3` | MIT |
| `@playwright/cli` | `0.1.23` | Apache-2.0 |

`@playwright/cli` traz `playwright` e `playwright-core` na versão **`1.65.0-alpha-2026-10-30`**. Isso não constitui instalação do executor `@playwright/test` como dependência direta do FUTURE G. A CLI respondeu `0.1.23` ao comando de versão; não foi criada uma suíte E2E nesta fase.

`npm ls --depth=0` não apresentou dependências ausentes ou inválidas. As licenças e engines acima foram lidas dos pacotes instalados; não foi feita avaliação jurídica ou pesquisa de manutenção externa.

## Comandos e medições

Tempos de parede medidos nesta máquina, incluindo inicialização do npm; não são budgets de CI.

| Comando | Exit code | Tempo | Resultado |
| --- | ---: | ---: | --- |
| `npm test` | 1 | 18,777 s | 124 testes: 120 passaram, 4 falharam, nenhum ignorado |
| `npm run build` | 0 | 0,974 s | `.generated-public` gerado; 51 ícones, 11.744 bytes |
| `npm run audit:browser` | 0 | 7,918 s | Sete painéis, zoom simulado de 200%, foco e console aprovados |
| `AUDIT_MATRIX=1 npm run audit:browser` | 0 | 74,556 s | 224 combinações + 56 estados expandidos, sem falhas geométricas detectadas |
| `npx.cmd --no-install playwright-cli --version` | 0 | Não medido | CLI instalada: `0.1.23` |

Os logs brutos do PowerShell registram mensagens de progresso do auditor, escritas em stderr, como `NativeCommandError`. O processo terminou com exit code 0 e o JSON do auditor informa `aprovado: true`; essas mensagens do shell não são erros do console da aplicação. Os logs `.log` foram gravados por `Tee-Object` em UTF-16LE neste Windows; JSONs de resultado estão disponíveis para leitura estruturada.

### Falhas fiscais preexistentes

As quatro falhas de `tests/fiscal-xsd.test.cjs` são:

1. Integridade do manifesto fiscal, linha 40.
2. NF-e sintética positiva no XSD, linha 52.
3. CT-e 4.00 positivo no XSD, linha 57.
4. Resposta de erro XSD estruturada, linha 73: recebe HTTP 503 em vez de 200.

Sete dos doze arquivos não correspondem aos SHA-256 do manifesto. A conversão **em memória**, apenas para diagnóstico, de LF para CRLF reproduz os hashes esperados nos sete casos. Os arquivos e o manifesto não foram modificados. A divergência impede `verifySchemas()` de liberar o motor XSD, inclusive quando se tenta validar o outro pacote fiscal.

O build não executa essa verificação; por isso, passar no build não demonstra funcionamento da validação fiscal. O retorno HTTP 503 é uma falha de integridade, não aprovação/reprovação fiscal do conteúdo enviado.

Detalhes: `artifacts/quality/baseline/schema-integrity.json` e [problemas conhecidos](known-issues.md).

## Cobertura automatizada atual

### Suíte Node

| Arquivo | Quantidade | Responsabilidade principal |
| --- | ---: | --- |
| `tests/projeto.test.cjs` | 93 | DOM, geradores, ambientes, resultados, navegação, persistência, exports e comandos locais |
| `tests/fiscal-xsd.test.cjs` | 8 | Integridade, identificação, XSD, rejeição de DTD e endpoint fiscal |
| `tests/ai.test.cjs` | 4 | Motor histórico e ferramentas com provedores simulados |
| `tests/http-api.test.cjs` | 5 | API histórica, identidade, limites e erros |
| `tests/local-api.test.cjs` | 2 | Rotas remotas aposentadas e servidor local |
| `tests/netlify.test.cjs` | 2 | Adaptador HTTP histórico |
| `tests/provider.test.cjs` | 3 | Protocolo dos provedores simulados |
| `tests/session-store.test.cjs` | 7 | Armazenamento, cotas, leases e Redis simulado históricos |

Passar nos testes históricos de IA não significa que o chat remoto está ativo. Na alpha.7, `/api/chat` e `/api/status` continuam aposentados; comandos locais não dependem de provedor ou Redis.

### Auditoria de navegador

A execução padrão observou:

- Sete painéis: Home, XML Fiscal, Dados cadastrais, Cadastro geral, Editor, Validação e Comandos locais.
- Viewport CSS de 640 × 450, escala 2: simulação usada pelo auditor para 200%.
- 193 passos de teclado; zero nomes vazios, focos invisíveis ou focos sem contorno.
- Zero exceções, erros ou avisos no console da aplicação.
- Busca contextual, comandos locais, resultado estruturado, ações diretas para o editor e XMLs carregados no editor em largura 360 nos dois temas.
- Scroll interno do resultado longo: de 2.146 para 0 após nova renderização; posição da página: 80 antes e depois.
- 354.343 bytes de JavaScript local, 109.423 de CSS local e 1.558 nós DOM na amostra. Limites atuais: 600 KB, 150 KB e 2.500 nós; runtime Lucide: até 20 KB.

A matriz usa `360/768/1280/1920 × general/port × claro/escuro × sete painéis × sidebar expandida/recolhida`, com altura de 900 px: **224 combinações**. Há mais **56 estados** com disclosures/opções abertos em 360 e 1280 px. Todos passaram nas verificações geométricas disponíveis.

**Limites:** não é emulação de toque, dispositivo móvel físico, teclado virtual ou leitor de tela. A matriz não repete todos os asserts da auditoria padrão. Não é comparação pixel a pixel e não possui tolerâncias visuais aprovadas.

### Matriz de fluxos críticos

| ID | Fluxo e contrato a preservar | Cobertura atual | Próxima cobertura útil |
| --- | --- | --- | --- |
| REG-01 | Inicialização e scripts clássicos na ordem atual | JSDOM e servidor do auditor | Navegador com servidor real e smoke via `file://` |
| REG-02 | `general`/`port`, projeções e resultados preservados | Node + auditor + matriz | Percurso de usuário com contexto de navegador novo |
| REG-03 | Sidebar, busca, `/`, Ctrl+K, Ctrl+Enter e Escape | Node + teclado do auditor | Ativar também os controles por Enter/Space, além de percorrer foco |
| REG-04 | Geração direta/configurada, cópia e download | Node; navegador cobre alguns caminhos | Download real e comparação com o resultado exibido |
| REG-05 | Cadastro por grupos/entidades, edição e restauração | Node + estados vazios na matriz | Gerar, editar e restaurar em navegador |
| REG-06 | Tema, favoritos, recentes e chaves legadas | Node | Reload e isolamento entre contextos reais |
| REG-07 | NF-e/CT-e, editor, validação local/XSD | Node + auditor; XSD falha | Regressão fiscal como trilha separada; não ocultar as quatro falhas |
| REG-08 | Cenários portuários relacionados | **Não disponível no runtime atual** | Planejar somente se houver contrato posterior explícito |
| REG-09 | Comandos locais, catálogo, anexos, lotes e scroll | Node + roteiro de comandos no auditor | Anexo/rascunho e conversa longa em navegador |
| REG-10 | Temas, larguras e sidebar | Matriz completa e capturas | Snapshots determinísticos com revisão humana |
| REG-11 | Nomes, foco, zoom e movimento reduzido | Node + auditor | Axe, cores forçadas, escuta humana e toque real |
| REG-12 | Escape, limites, rotas e exclusão de arquivos privados | Node + fronteira de build | Análises especializadas futuras; não equivalem a auditoria de segurança completa |

O teste atual `Cenários de teste não fazem parte da navegação nem do runtime público` explicita a ausência de uma tela operacional de cenários. README, roadmap e o plano mestre ainda mencionam essa capacidade; não restaurá-la automaticamente para satisfazer um inventário histórico.

## Persistência e fronteiras

Chaves relevantes observadas: `gerador:tema`, `thegenerator:sidebar-collapsed`, `futureg:environment`, `thegenerator:favorite-generators`, `thegenerator:recent-generators`, `thegenerator:registry-version`, `futureg:activity-v1`, `gerador:historico`, `gerador:historico_docs`, campos/quantidade/lock/NCM de XML e `futureg:comandos-favoritos:<ambiente>`.

Favoritos/recentes guardam IDs; a atividade tem allowlist e não contém resultados. Históricos detalhados de restauração são um contrato separado. Conversa e último comando ficam em memória. Nenhuma dessas chaves ou regras foi modificada.

O build publica apenas HTML, manifesto e assets permitidos em `.generated-public`. Evidências ficam em `artifacts/`, ignorado pelo Git e excluído do diretório público; docs e changes não são copiados pelo build.

## Evidências e inspeção visual

Arquivos locais, não publicados:

- `artifacts/quality/baseline/environment.json`: versões, engines e licenças declaradas, sem despejo de variáveis de ambiente.
- `artifacts/quality/baseline/summary.json`: resultados, tempos e métricas consolidados.
- `artifacts/quality/baseline/npm-*.log` e `npm-*.json`: saída bruta e status de cada comando.
- `artifacts/quality/baseline/source-before.json` e `source-comparison.json`: integridade dos arquivos originais.
- `artifacts/quality/baseline/schema-integrity.json`: hashes dos schemas e diagnóstico de fins de linha.
- `artifacts/quality/baseline/browser-audit.json`: resultado padrão preservado desta execução.
- `artifacts/quality/baseline/matrix/`: capturas e `measurements.json` copiados da saída da matriz.

O auditor também grava imagens e JSON em `artifacts/visual-review`. Sua matriz original sai em `../artifacts/refactor-the-generator-ui/final`, relativamente à aplicação; a cópia acima mantém uma referência autocontida nesta entrega.

Foram abertas e inspecionadas dez capturas representativas da nova matriz:

- Home geral em 360 px, sidebar recolhida, claro/escuro.
- Home portuária em 1920 px, sidebar expandida, claro/escuro.
- Cadastro geral em 768 px, sidebar recolhida, claro/escuro.
- Dados portuários em 1280 px, sidebar recolhida, claro/escuro.
- Comandos locais em 360 px, sidebar recolhida, claro/escuro.

Essa inspeção confirma os estados retratados e a ausência de corte lateral nessas amostras; **não representa aprovação humana de todas as imagens**. Em 360 px o composer e as sugestões demandam análise específica com teclado virtual; a screenshot de desktop estreito não resolve esse caso.

O arquivo antigo `future-g-home-dark.png` gerado pelo roteiro padrão recebe uma captura de Dados cadastrais, após a fixture longa. Não usá-lo como baseline de Home. A matriz, com nomes de painel explícitos, é a referência desta entrega; o defeito do coletor foi registrado sem alterar o script existente.

## Comprovado, hipótese e não executado

**Comprovado nesta fase:** versões locais; ausência de `.git`; resultados e tempos dos comandos; sete hashes XSD divergentes e diagnóstico CRLF em memória; geometria da matriz; inspeção de dez capturas; identidade dos 253 arquivos originais preservada.

**Hipóteses a investigar:** anúncios repetidos em regiões live, comportamento com teclado virtual, impacto de fontes realmente carregadas sobre layout e desempenho de uso com lotes/conversas extensos. Não foram convertidas em afirmações de conformidade ou defeitos confirmados.

**Não executado:** Playwright Test, axe, fast-check, Lighthouse CI, ESLint, CodeQL, Dependabot, GitHub Actions, leitor de tela real, repetição em três execuções limpas, Node 20.19/22, builds públicos remotos, testes com dados reais, alteração de proteção de branch ou deploy. Não há alegação de segurança, desempenho ou acessibilidade completos.

## Reprodução

Executar na pasta que contém `package.json`, com as dependências do lockfile já presentes. Este roteiro não instala dependências:

```powershell
node --version
npm.cmd --version
npm.cmd ls --depth=0
npm.cmd test
npm.cmd run build
npm.cmd run audit:browser
$env:AUDIT_MATRIX = '1'
try {
  npm.cmd run audit:browser
} finally {
  Remove-Item Env:AUDIT_MATRIX
}
npx.cmd --no-install playwright-cli --version
```

Registrar cada exit code, não interromper a coleta de build/auditoria por causa das falhas fiscais já identificadas e não interpretar esse procedimento como liberação de release. Futuras execuções devem usar diretórios de evidências distintos e não sobrescrever referências visuais aprovadas.

## Próxima entrega

[Proposta de base E2E](next-e2e-proposal.md): Playwright Test com 3–5 fluxos de alto valor, sem refatoração da aplicação. As correções de bugs atuais são changes separadas. Baselines de screenshots precisam de determinismo e revisão antes de serem tratadas como referência aprovada.

O registro OpenSpec da Fase 0 fica em `openspec/changes/archive/2026-11-02-quality-baseline/`. A manutenção documental não cria requisito funcional novo e usa `skip_specs: true`, como changes documentais anteriores. A CLI OpenSpec não foi instalada para validar o arquivo; revisão estrutural local é registrada como tal.
