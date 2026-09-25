# Spec: Geradores Gerais

## Categories
The environment SHALL support progressive implementation of:
- Pessoas: CPF, RG, CNH, nome, nascimento, telefone, e-mail, Pessoa Física completa, Cadastro Geral.
- Empresas: CNPJ, IE, razão social, nome fantasia, Pessoa Jurídica completa.
- Endereços: CEP, logradouro, número, complemento, bairro, município, UF, endereço completo.
- Veículos: Placa Mercosul, placa padrão antigo, RENAVAM, veículo completo.
- Financeiro: agência, conta, PIX fictício and structurally valid test-card data; synthetic only.
- Desenvolvimento: UUID/GUID, JSON, XML, Base64, timestamp, hash, random string/number.
- Texto/utilidades: Lorem Ipsum, nomes, nicks, senhas, textos aleatórios, símbolos, sorteador.

## Naming
Section titles SHALL represent entities rather than button payloads: `Pessoa Física`, `Pessoa Jurídica`, `Carteira Nacional de Habilitação`, `RG`. Changing a section title MUST NOT implicitly change button labels.

## Person and RG
RG SHALL be treated as Person data alongside CPF while retaining an individual RG generator when useful.

## Vehicle plates
Mercosul and old-pattern plates SHALL live in the same vehicle/plate area with a pattern selection rather than duplicated conceptual sections.

## Cadastro Geral
Cadastro Geral SHALL support a registration-sheet presentation and selectable groups: Identificação, Documentos, Contato, Endereço and Dados profissionais, with Select all and Clear selection actions.

## Badge generator
A badge generator SHALL support synthetic avatar/photo, name, badge code, company, function, registration, validity, status and optional barcode/QR when relevant. Initial actions: regenerate and copy code. Architecture SHOULD support future Employee, Driver, Visitor and Contractor models.
