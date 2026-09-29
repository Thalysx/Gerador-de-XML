# FUTURE G 08 — QA Portuário

Fase concluída localmente em 27/09/2026, sem iniciar a mudança seguinte do roadmap.

## Entrega

- Perfis sintéticos de Motorista, Operador, Visitante e Pessoa portuária, com documentos, contato, acesso e atributos próprios de cada função.
- Entidades Transportadora, Cliente, Depositante, Importador e Exportador, com CNPJ, IE, nomes empresarial e fantasia, contato, endereço e atributos de teste.
- Cavalo mecânico, carreta e conjunto veicular com placas, RENAVAM e características operacionais.
- Contêiner detalhado com número e dígito verificador consistentes com ISO 6346, código ISO, tipo, lacre, tara, peso líquido, peso bruto e capacidade.
- Carga solta, granel sólido, granel líquido e carga conteinerizada com unidade, embalagem, quantidade, pesos, NCM e vínculo logístico quando aplicável.
- Lista manual de NCM reutilizada no ambiente portuário, com prioridade sobre a lista padrão ao gerar cargas.
- Documentos portuários centralizados: CT-e/XML, chave CT-e, Booking, DI, DUIMP, DU-E, lacre e documento de carga.
- Todos os novos tipos integrados ao registry, Home, busca, favoritos, recentes, geração individual, histórico, lote, JSON, CSV, TXT e Assistente.

## Decisões de arquitetura

As regras do domínio foram isoladas em `assets/js/port-generators.js`. Elas produzem registros estruturados e reutilizam os controladores existentes, evitando um segundo fluxo de interface, histórico ou exportação.

Cada gerador pertence a um único ambiente. NF-e e sua chave permanecem em Geradores Gerais; CT-e e sua chave pertencem ao QA Portuário. A lista manual de NCM é compartilhada de propósito: serve aos produtos de NF-e no Geral e às cargas no Portuário, sem compartilhar documentos ou geradores.

O registry continua sendo a fonte de descoberta e capacidades. O mesmo contrato alimenta a interface local e a lista de ferramentas permitidas ao servidor da IA. O histórico consulta essa classificação para agrupar corretamente as novas pessoas, empresas e operações de transporte.

## Arquivos

Criado:

- `assets/js/port-generators.js`

Modificados nesta entrega:

- `index.html`
- `assets/js/generator-registry.js`
- `assets/js/geracao-dados.js`
- `assets/js/visual-layout.js`
- `assets/js/chat.js`
- `assets/js/historico.js`
- `scripts/ai.cjs`
- `tests/projeto.test.cjs`
- `README.md`
- `docs/ui-architecture.md`
- `CHANGELOG.md`
- `ATUALIZACOES.md`
- `openspec/changes/archive/2026-09-27-future-g-08-port-qa/proposal.md`
- `openspec/changes/archive/2026-09-27-future-g-08-port-qa/design.md`
- `openspec/changes/archive/2026-09-27-future-g-08-port-qa/tasks.md`
- `openspec/specs/port-qa/spec.md`

## Verificação

- `npm test`: 92 testes aprovados, 0 falhas.
- `npm run build`: distribuição pública criada com sucesso.
- `npm run audit:browser`: sete telas aprovadas em Chromium a 200%, 233 passos de teclado, sem overflow horizontal, controle sem nome, foco invisível ou foco sem contorno.
- A cobertura específica verifica os quatro perfis, cinco entidades empresariais, combinações veiculares, variedade e consistência de contêineres, NCM manual em cargas, documentos portuários, chave CT-e e integração completa com registry/lote/exportação.

## Limites e riscos

- Os registros são exclusivamente sintéticos e não consultam cadastros, recintos, transportadoras, NCM ou documentos reais.
- A conformidade de CT-e continua limitada às regras locais do gerador; não há validação XSD, assinatura digital, regra tributária completa ou autorização fiscal.
- Cenários completos encadeando agendamento, Gate, pátio, carga, veículo e documento permanecem fora do escopo desta fase.
- Nenhuma regressão conhecida permaneceu após a suíte completa, o build e a auditoria de navegador.
