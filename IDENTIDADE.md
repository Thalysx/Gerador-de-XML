# Identidade da FUTURE G

Status: identidade FUTURE G aplicada ao produto em 25/09/2026; documentação alinhada ao shell vigente em 07/11/2026. O [guia de design](DESIGN.md) consolida tokens, componentes e contratos atuais.

![Logo da FUTURE G para fundos claros](assets/brand/future-g-logo-light.png)

## Nome e posicionamento

**Nome:** FUTURE G<br>
**Assinatura do shell:** Dados sintéticos para testes.

A FUTURE G reúne geradores gerais, ferramentas de QA portuário, documentos brasileiros e XML fiscal. A comunicação deve deixar claro que os dados são fictícios e que a ferramenta não emite documentos fiscais nem consulta cadastros oficiais.

## Símbolo

O “G” modular preserva o conceito geométrico anterior: registros entram, são combinados e resultam em dados ou documentos de teste. A paleta passou a usar azul-marinho como base e azul para interação e identidade.

## Arquivos oficiais

| Arquivo | Uso |
| --- | --- |
| `future-g-mark.svg` e `.png` | Símbolo isolado e aplicações flexíveis |
| `future-g-logo-light.svg` e `.png` | Logotipo sobre fundo claro |
| `future-g-logo-dark.svg` e `.png` | Logotipo sobre fundo escuro |
| `future-g-logo-mono-black.svg` e `.png` | Impressão ou aplicação monocromática clara |
| `future-g-logo-mono-white.svg` e `.png` | Aplicação monocromática escura |
| `favicon.svg`, `favicon-192.png` e `favicon-512.png` | Navegador e instalação da aplicação |
| `future-g-concepts.jpg` | Registro dos estudos visuais anteriores |

Os arquivos ficam em `assets/brand`. `npm run brand:export` recria os PNGs a partir dos SVGs.

## Sistema visual

| Uso | Cor |
| --- | --- |
| Ação principal, nos dois temas | `#2563eb` |
| Hover principal, nos dois temas | `#1d4ed8` |
| Link/foco no tema escuro | `#7db6ff` |
| Fundo claro / escuro | `#f7f8fa` / `#090d14` |
| Superfície clara / escura | `#ffffff` / `#111925` |
| Texto principal claro / escuro | `#172033` / `#f8fafc` |

Esta é a base da interface em `assets/css/base.css`; a tabela completa e os tokens estão em [Cores e temas](DESIGN.md#cores-e-temas). Os SVGs de marca mantêm suas próprias aplicações existentes. A interface usa superfícies neutras, azul compartilhado nas ações e cores semânticas de feedback, inclusive nos Comandos locais. Paletas roxas e a antiga divisão de tema por ambiente pertencem ao histórico.

- **Inter:** interface, títulos e nome da marca.
- **DM Mono:** códigos, identificadores e detalhes técnicos.
- Escrever sempre **FUTURE G**, em caixa alta e com espaço.
- Usar símbolo e nome juntos no menu aberto, documentação e apresentações.
- Usar somente o símbolo no favicon, menu compacto e ícones sociais.
- Não girar, distorcer, adicionar sombras fortes ou trocar o azul por cores de alerta.

## Histórico de nomenclatura

Até a linha 2.x o produto usava o nome **TheGenerator**. A mudança para FUTURE G acompanha a ampliação do escopo além da geração de XML. Chaves persistidas `thegenerator:*` continuam aceitas para preservar preferências e históricos locais. A triagem pública feita anteriormente se referia ao nome antigo e não constitui análise jurídica ou de disponibilidade de FUTURE G.
