# Catálogo único — registro da entrega

> O padrão de design já implementado foi consolidado em [DESIGN.md](../DESIGN.md), em 07/11/2026. As propostas de exploração visual deste registro continuam históricas e não foram implementadas por essa consolidação documental. Para disponibilidade e pendências atuais, veja o [inventário vigente](current-capabilities.md) e os [registros de qualidade](quality/known-issues.md).

> Registro da entrega de unificação. A etapa posterior de [integridade fiscal](quality/fiscal-schema-integrity.md) resolveu BASE-01 e elevou o resultado Node abaixo de 123/127 para **127/127**; os resultados originais desta change ficam preservados como histórico.

Decisão do usuário em 02/11/2026: **um catálogo único, com todas as ferramentas existentes e filtros por categoria, sem alternar entre Geral e QA Portuário**. Essa decisão substitui a restrição anterior de preservar a divisão da interface. A identidade FUTURE G, os motores, contratos de dados e demais restrições continuam vigentes.

Implementação local na branch `feat/unified-catalog`, no checkout `future-g-e2e`. As alterações da infraestrutura E2E anterior foram preservadas no mesmo working tree; não há commit, push, PR ou publicação desta entrega.

## Comportamento entregue

- Sidebar sem seletor de ambientes, com a marca FUTURE G e as mesmas sete áreas.
- Home com acessos rápidos dos dois domínios; busca e categorias alcançam o catálogo completo. Dados cadastrais, busca global, lotes e comandos também oferecem os dois domínios juntos.
- Cadastro geral com um único seletor **Tipo de cadastro**: Perfil pessoal e os tipos completos existentes de pessoas, empresas, veículos, contêineres e cargas. O seletor não afeta outras telas. Os grupos e a edição do perfil pessoal permanecem disponíveis; restaurar o histórico escolhe a ficha correta.
- Favoritos e recentes de geradores aparecem juntos, preservando IDs e chaves antigas. Atividade apresenta entradas das duas origens e novas operações juntas, sem persistir resultados; seu botão agora informa **Limpar atividade** e limpa a lista inteira.
- Favoritos de comandos reúnem os textos válidos e distintos das duas listas antigas, com limite global de vinte para acomodar os dez de cada origem. As chaves legadas não são apagadas; após salvar ou remover na lista unificada, a nova lista prevalece, inclusive vazia.
- Cabeçalho do resultado do Cadastro quebra linha quando necessário para acomodar tipos e nomes longos no mobile. Selecionar outra entidade não permite copiar uma ficha incompatível como se pertencesse ao novo tipo.

NF-e/CT-e, modelos e schemas fiscais, APIs, algoritmos de geração, formatos de exportação, nomes contextuais dos downloads, estruturas dos históricos e funções de rolagem não foram alterados. Nenhuma funcionalidade ausente, como a antiga tela de cenários operacionais, foi recriada.

## Compatibilidade técnica

O contexto de apresentação é `unified`. Os metadados `general`/`port` do registry são classificações legadas de domínio, sem restringir a interface. Eles permitem ler registros anteriores e manter nomes de arquivos de exportação. `definirAmbiente` e seu evento permanecem como pontos de compatibilidade, mas não reativam o seletor nem escondem geradores. A preferência `futureg:environment` antiga fica intacta e não decide o catálogo ou o formulário inicial.

O controle `cad-port-tipo` foi reaproveitado, movido para uma área comum e recebeu a opção `perfil`. O mesmo ID e os motores existentes são reutilizados. Nenhuma ficha foi clonada ou fundida com campos incompatíveis. Os formatos pessoal e `tipo_cadastro: portuario` do histórico continuam distintos e restauráveis.

A leitura inicial de favoritos de comandos usa a união das listas antigas enquanto `futureg:comandos-favoritos:unified` não existir. A primeira alteração salva a lista unificada; isso evita ressuscitar um item removido. Em falha de armazenamento, o fallback em memória continua disponível.

## Verificação

| Verificação da versão final | Resultado |
| --- | --- |
| `npm test` | 127 testes: **123 aprovados**, quatro falhas XSD preexistentes, nenhum ignorado |
| `npm run build` | Aprovado, 0,703 s; subset Lucide preservado em 51 ícones/11.744 bytes |
| `npm run audit:browser` | Aprovado, 6,870 s |
| E2E `unified-1` | 10/10, 12,211 s |
| E2E `unified-2` | 10/10, 12,364 s |
| E2E `unified-3` | 10/10, 12,098 s |
| Matriz responsiva | 112 combinações + 28 estados expandidos; nenhuma falha geométrica detectada |
| Playwright CLI | 16 capturas: Home, Dados, Cadastro e Comandos em 1280/390 px, claro/escuro; zero exceções observadas |
| OpenSpec | Change válida em modo estrito; dois avisos legados de comprimento de requisito ainda impedem a aprovação global |

Os E2E finais tiveram zero retries, falhas intermitentes ou testes ignorados. O envio por comandos mantém a validação de clipboard/download reais e da ausência de chat remoto. A busca agora verifica os resultados do catálogo inteiro: pesquisar CPF também pode encontrar ferramentas que o utilizam, como Motorista.

Os testes Node que exigiam isolamento visual entre ambientes foram atualizados para a mudança explicitamente solicitada. Acrescentaram-se testes de preservação dos vinte favoritos legados, remoção após reload, leitura conjunta de atividade e restauração dos dois tipos de ficha. Testes fiscais não foram desabilitados ou enfraquecidos.

Evidências locais ignoradas e fora do build público:

- `artifacts/unified-catalog/results.json` e logs Node/build/auditoria.
- `artifacts/e2e/unified-1/`, `unified-2/`, `unified-3/`: relatórios HTML/JSON.
- `artifacts/unified-catalog/captures.json`, `*.png` e `cli.log`: estado real conferido antes das capturas.
- `artifacts/unified-catalog/matrix/`: medidas e 140 imagens da matriz unificada.
- `artifacts/unified-catalog/openspec-all.json`: resultado estrito com os avisos legados separados.

Oito amostras foram abertas inicialmente, cobrindo as quatro telas, ambos os temas e larguras. O Cadastro mobile foi capturado e inspecionado novamente após o ajuste do cabeçalho. A CLI usa viewport redimensionado, não um celular físico; o projeto E2E mobile tem emulação de toque. Recursos externos opcionais são omitidos nesta trilha offline. Essas capturas são evidências diagnósticas, não baselines de pixels aprovadas. A matriz cobre principalmente geometria, não comprova legibilidade de todo texto ou comportamento de teclado virtual.

## Direção proposta para o plano visual

Esta seção é proposta para a próxima change, não um redesign já executado. A pergunta principal da interface passa a ser **“Qual dado ou ferramenta preciso?”**, em vez de escolher um ambiente antes de começar.

| Superfície | Direção | Critério a verificar |
| --- | --- | --- |
| Home | Busca como entrada principal; acesso rápido e favoritos pessoais; categorias pelos objetos de trabalho | Encontrar CPF, Transportadora e Contêiner sem conhecer a origem da ferramenta |
| Dados cadastrais | Catálogo escalável por busca/categoria, ferramenta selecionada clara e resultado próximo das ações | Evitar listas longas que afastem configuração e resultado; nomes legíveis no mobile |
| Cadastro | Tipo da ficha primeiro, configuração aplicável depois e resultado com identidade do tipo | Trocar tipo sem perder campos pessoais; cópia e histórico sempre correspondem à ficha exibida |
| Navegação | Sidebar única e estável, com os grupos existentes e nomes acessíveis | Nenhum item some conforme a ferramenta; navegação completa alcançável em zoom e viewport baixa |
| Comandos locais | Descoberta do catálogo completo com poucos exemplos contextuais e composer utilizável | Exemplos não ocupam a maior parte da conversa no mobile; anexo não obstrui Enviar |

O [DESIGN.md](../DESIGN.md) consolida a base já implementada: superfícies neutras, azul de interação, Inter, DM Mono, temas, componentes, hierarquia, estados e responsividade. A tabela acima preserva uma proposta histórica de exploração visual; sua implementação, aplicação de skills de art direction e eventual uso de referências visuais não fazem parte dessa consolidação documental.

O roteiro de dez etapas anterior continua como backlog de qualidade, agora sobre o catálogo único. Integridade XSD e bugs conhecidos continuam prioritários; a aprovação de referências visuais deve aguardar a correção dos defeitos que elas retratariam. As changes seguintes não são iniciadas automaticamente.

## Pendências e riscos

- BASE-01 permanece: quatro testes fiscais falham por divergência dos bytes dos schemas. Aprovar este catálogo não libera a validação fiscal ou uma release.
- BASE-11 permanece: anexo pode obstruir Enviar no composer mobile. O E2E usa Enter após anexar; não declara esse clique aprovado. A maior quantidade de exemplos também precisa da revisão de densidade prevista acima.
- Os outros problemas conhecidos permanecem rastreados separadamente. A captura incorretamente nomeada da auditoria antiga não foi corrigida por esta change; usar as capturas novas com estado registrado.
- OpenSpec global ainda rejeita `ai-assistant` e `ui-system`, cada um por um requisito legado acima de 500 caracteres, fora das partes alteradas. Os requisitos de ambientes modificados foram alinhados com a decisão do usuário, sem enfraquecer requisitos de XML ou resultados.
- O maior catálogo pode aumentar esforço de busca; categorias e favoritos existentes estão preservados, e a próxima proposta visual deve medir essa descoberta.
- Sem testes de leitor de tela real, teclado virtual, navegadores alternativos ou integração online das fontes nesta entrega.

Registro OpenSpec: `openspec/changes/archive/2026-11-02-unify-generator-catalog/`. Reversão deve restaurar os arquivos de UI/specs/testes deste incremento como conjunto, preservando históricos, preferências antigas e a lista unificada de comandos. Não apagar storage para voltar à interface anterior; itens criados depois da unificação exigem adaptação do leitor antigo para permanecerem visíveis.
