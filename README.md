# 📄 Gerador Unificado — Documentos Fiscais & Identificação

Ferramenta web all-in-one para geração e validação de documentos fiscais brasileiros, dados cadastrais e identificadores de carga. Desenvolvida para uso em testes, homologação de sistemas e preenchimento de formulários com dados fictícios válidos.

---

## ✨ Funcionalidades

### 📄 Aba: XML NFe / CTe
Gera arquivos XML de **Nota Fiscal Eletrônica (NFe)** e **Conhecimento de Transporte Eletrônico (CTe)** com estrutura completa e válida.

- Regeneração automática de números, códigos e chaves de acesso
- Cálculo automático do **Dígito Verificador (DV)** da chave de acesso
- Edição manual de todos os campos: emitente, destinatário, remetente, recebedor, transportador
- Suporte a múltiplos produtos/itens com catálogo de **20 mercadorias** pré-cadastradas (açúcar, soja, milho, café, celulose, etc.)
- Seleção de unidade comercial: **KG** ou **Tonelada**
- **Bloqueio seletivo de campos**: congela CNPJs e razões sociais enquanto regenera chaves e números
- Geração automática dos XMLs ao editar qualquer campo
- **Download direto** dos arquivos `NFe.xml` e `CTe.xml`

### 🪪 Aba: Dados Cadastrais
Geração avulsa de documentos e identificadores com cópia rápida.

| Documento | Detalhes |
|-----------|----------|
| **CPF** | Com validação por dígitos verificadores |
| **CNPJ numérico** | Padrão tradicional |
| **CNPJ alfanumérico** | Novo formato com letras (Receita Federal 2026) |
| **CNH** | Registro Nacional de Habilitação com DVs |
| **Telefone** | Celular brasileiro com DDD válido |
| **E-mail** | Gerado a partir do nome da pessoa |
| **Placa Mercosul** | Formato `ABC1D23` com visual de placa |
| **Contêiner + Lacre** | Número de contêiner com DV ISO 6346 + lacre de armador |

**Recursos adicionais:**
- Toggle para gerar **nome junto** (pessoa física ou razão social)
- Toggle para **aplicar/remover máscara** (CPF, CNPJ, telefone)
- Validador de CPF e CNPJ (numérico e alfanumérico)
- Visualização gráfica da placa Mercosul

### 🧾 Aba: Cadastro Geral
Geração de um **perfil completo de motorista** com todos os dados associados em uma única ação.

**Campos gerados:**
- Nome completo, CPF, RG, CNH, Crachá
- Telefone, E-mail, Endereço completo com CEP
- Documento estrangeiro da pessoa (Passaporte ou Identidade estrangeira)
- Razão Social, CNPJ (normal ou alfanumérico)
- Documento estrangeiro da empresa
- Placa Mercosul, Número de Contêiner, Lacre de armador

**Outros recursos:**
- Geração individual por campo com botão "Novo"
- Painel de resultado visual com cópia por campo
- **Exportação em JSON** de todos os dados
- **Histórico** dos últimos 20 cadastros gerados com restauração e cópia rápida por chip

---

## ⚙️ Como usar

1. Abra o arquivo `index.html` diretamente no navegador — sem instalação, sem servidor
2. Navegue pelas abas conforme a necessidade
3. Clique em **"Gerar tudo"** ou nos botões individuais para obter os dados
4. Use os botões **Copiar** para levar os valores para outros sistemas
5. Na aba XML, clique em **Baixar NFe.xml / CTe.xml** para fazer o download

---

## 🛠️ Tecnologias

- **HTML5 + CSS3 + JavaScript puro** — zero dependências externas
- **DOMParser / XMLSerializer** para manipulação dos XMLs
- **Web Clipboard API** para cópia rápida
- **CSS Grid** para layout responsivo
- Fontes: [Syne](https://fonts.google.com/specimen/Syne), [Inter](https://fonts.google.com/specimen/Inter), [DM Mono](https://fonts.google.com/specimen/DM+Mono)

---

## 🎨 Interface

- Tema **claro e escuro** com alternância por botão
- Design responsivo para desktop e mobile
- Paleta roxa/violeta com tipografia Syne para identidade visual consistente

---

## 📋 Catálogo de Produtos (NFe)

Açúcar Cristal · Açúcar Refinado · Soja em Grão · Milho em Grão · Farinha de Soja · Óleo de Soja Bruto · Farelo de Soja · Trigo em Grão · Café Verde em Grão · Algodão em Pluma · Minério de Ferro · Celulose · Etanol Hidratado · Carne Bovina Congelada · Frango Inteiro Congelado · Produtos Siderúrgicos · Papel e Papelão · Farinha de Trigo · Arroz Beneficiado · Fertilizante Nitrogenado

---

## ⚠️ Aviso

> Os dados gerados por esta ferramenta são **fictícios e destinados exclusivamente a testes e homologação**. CNPJs, CPFs e chaves de acesso são matematicamente válidos, mas não correspondem a nenhuma pessoa, empresa ou documento real. Não utilize em sistemas de produção ou para fins ilegais.

---

## 📁 Estrutura do Projeto

```
index.html          # Arquivo único — toda a aplicação
```

A aplicação é um **single-file app**: HTML, CSS e JavaScript estão contidos em um único arquivo, facilitando a distribuição e o uso offline.
