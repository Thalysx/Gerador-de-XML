# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Single-file web app (`index.html`) — no build step, no dependencies to install. Open `index.html` directly in a browser to run it. All CSS, HTML, and JavaScript are self-contained in that one file.

The app is written in **Portuguese (pt-BR)** throughout: UI labels, variable names, function names, comments, and user-facing text are all in Portuguese.

## Architecture

The entire application lives in `index.html` and is divided into three sections:

**HTML** — Three tab panels:
- `#tab-xml` — CTe/NFe XML generator with editable form fields
- `#tab-docs` — Individual document generators (CPF, CNPJ, CNH, phone, e-mail, plate, container)
- `#tab-cadastro` — Full driver profile form generator

**CSS** — CSS custom properties (variables) define the light/dark theme. All theming is done via `body.dark` class toggle on `<body>`. No preprocessor.

**JavaScript** — Inline `<script>` at the bottom. Key functional areas:

| Area | Key functions |
|------|--------------|
| XML generation | `processarXML()`, `finalizarEGerarXML()`, `alteraCamposEmFuncaoDasNovasChaves()` |
| Access key (chave) calculation | `calcularDV()`, `formarNovaChave()`, `getChaveParts()` |
| Lock mode | `toggleLock()`, `salvarCamposTravados()`, `restaurarCamposTravados()` |
| CPF | `gerarCPF()`, `calcDigitoCPF()` |
| CNPJ (numeric + alphanumeric) | `gerarCNPJRawNumerico()`, `gerarCNPJRawAlfanumerico()`, `calcDVCNPJ()` |
| CNH | `gerarCNHRaw()`, `calcDSP()` |
| Container ISO number | `gerarNumeroConteiner()`, `calcDVConteiner()` |
| IMO vessel number | `gerarIMO()`, `calcDVIMO()` |
| Vehicle plates | `gerarPlaca()`, `gerarPlacaMercosulRaw()` |
| Full profile (cadastro) | `gerarCadastroCompleto()`, `cadGerar()` |
| Persistence | `storageGet()` / `storageSet()` wrapping `localStorage` |
| History (historico) | `registrarHistoricoDocs()`, `renderHistorico()`, `renderHistoricoDocs()` |

## XML model templates

`nfeModel` and `cteModel` are hardcoded XML strings (template literals) embedded in the script. They are parsed with `DOMParser` on each generation cycle. The CSS selector hierarchy returned by `getHierarquiaNFe()` and `getHierarquiaCTe()` maps field IDs to XML nodes — these two functions are the authoritative mapping between form fields and XML structure.

## Key invariants

- The 44-digit chave (access key) structure: `cUF(2) + AAMM(4) + CNPJ(14) + mod(2) + serie(3) + number(9) + tpEmis(1) + code(8) + DV(1)`. `calcularDV()` expects exactly 43 clean digits and returns `false` if validation fails.
- CNPJ DV weights: first DV uses `[5,4,3,2,9,8,7,6,5,4,3,2]`, second uses `[6,5,4,3,2,9,8,7,6,5,4,3,2]`. Alphanumeric CNPJ uses the same weights but applies `charParaValorDV()` which maps letters via `charCode - 48` (not `- 65`).
- Container check digit: ISO 6346 algorithm via `calcDVConteiner()`. A result of 10 maps to 0.
- All user-generated output visible to the user passes through `escapeHtml()` before being inserted into the DOM.

## State persistence (localStorage keys)

| Key | Contents |
|-----|----------|
| `gerador:tema` | `'light'` or `'dark'` |
| `gerador:xml_campos` | Snapshot of all XML form field values |
| `gerador:lock` | Boolean for lock mode |
| `gerador:historico` | Array of full cadastro profile history entries |
| `gerador:historico_docs` | Array of individual document history entries |

## Development workflow

No build tools. Edit `index.html`, refresh browser. To test the XML key calculation independently, `calcularDV()` can be called from the browser console.

External CDN dependencies (loaded from `cdn.jsdelivr.net`): Bootstrap 5.3.3 CSS+JS, Bootstrap Icons 1.11.3. Google Fonts: DM Mono, Syne, Inter. No npm packages, no bundler.
