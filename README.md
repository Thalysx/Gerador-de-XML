# FUTURE G

Plataforma de dados sintéticos para desenvolvimento e QA. Versão **3.0.0-alpha.8**: [abrir aplicação](https://gerador-de-xml.vercel.app/).

O catálogo reúne ferramentas gerais e portuárias, com busca e filtros por categoria. O assistente executa comandos locais no navegador. A aplicação gera dados fictícios para testes; não emite documentos fiscais nem consulta cadastros oficiais.

## Áreas disponíveis

| Área | Recursos |
| --- | --- |
| Início | Busca, ferramentas, favoritos, recentes e resumo da atividade |
| XML fiscal | NF-e/CT-e, produtos, NCMs, cenários XML salvos, prévia e downloads |
| Dados cadastrais | Geradores gerais e portuários, resultado individual, lotes de até 500 e exportações |
| Cadastro geral | Perfil por grupos e fichas por tipo, edição e histórico |
| Editor XML | Importação por grupos, edição de cópias e exportação |
| Validação XML | Sintaxe, regras locais, XSD para versões suportadas, relatórios e cópias negativas |
| Comandos locais | Geração, lotes, consultas XML, anexos, favoritos e repetição |

Cadastro geral escolhe a ficha em um único seletor de tipo. XML fiscal salva até 20 configurações neste navegador. A antiga biblioteca de fluxos operacionais portuários não integra a versão atual.

`Ctrl+K` pesquisa o catálogo inteiro. A atividade conserva até 50 entradas com identificador, tipo, quantidade e horário, sem valores gerados, prompts ou anexos. Favoritos e históricos detalhados continuam separados.

## Uso e desenvolvimento

Abra `index.html` com a pasta `assets` ao lado para usar os geradores e as funções locais. Bootstrap e fontes usam serviços externos. A etapa XSD precisa do servidor da aplicação.

Para desenvolvimento e testes, use Node.js 20.19 ou superior:

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:4173`. O build gera a distribuição em `.generated-public/`:

```sh
npm test
npm run build
node node_modules/@playwright/test/cli.js install chromium
npm run test:e2e
```

Veja o [guia de verificação](docs/quality.md) para cobertura, auditoria de navegador e limitações.

## XML e comandos

Experimente `3 CPFs e 2 CNPJs`, `5 UUIDs`, `gerar NF-e com 3 produtos` e `resumir XML anexado`. Favoritos guardam até 20 comandos em uma lista unificada. O anexo dos comandos tem limite de 100 KB; consultas e validações por comando são locais. [Exemplos e privacidade](docs/local-commands.md).

A Validação XML aceita até 10 arquivos de 5 MB cada. Sintaxe e regras locais rodam no navegador. NF-e/CT-e 4.00 compatíveis, com sintaxe válida e até 4 MiB, são enviados à API da aplicação para XSD. O endpoint não persiste, registra ou devolve a fonte XML. CT-e 3.00 tem somente verificações locais. Assinatura digital, regras tributárias completas e autorização SEFAZ não são verificadas. [Cobertura e manutenção dos schemas](docs/xml-validation.md).

## Organização do repositório

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` e `assets/` | Interface, estilos, marca, geração e regras no navegador |
| `api/` e `scripts/` | Endpoint XSD, servidor local, build e ferramentas de manutenção |
| `schemas/fiscal/` | Schemas oficiais e manifesto com fontes e hashes |
| `tests/` | Testes Node e regressões de navegador |
| `openspec/specs/` | Especificações canônicas do produto |
| `docs/` | Guias técnicos atuais |

[DESIGN.md](DESIGN.md) reúne identidade e contratos visuais; [arquitetura da interface](docs/ui-architecture.md) detalha responsabilidades, estado e compatibilidade. O [changelog](CHANGELOG.md), as tags e o histórico Git preservam as versões anteriores.

A publicação usa a integração Git do projeto `gerador-de-xml` na Vercel. Relatórios de execução, evidências, caches, credenciais locais e propostas arquivadas ficam fora do versionamento. `.env.example` contém somente o modelo de configuração; arquivos `.env` são ignorados. As rotas históricas de chat retornam HTTP 410; os comandos atuais não usam provedores de IA.
