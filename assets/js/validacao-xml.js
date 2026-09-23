// Verificações locais: não executa XSD, assinatura digital ou consulta à SEFAZ.
const LIMITE_XML_BYTES = 5 * 1024 * 1024;
let relatoriosXml = [];
let validacaoXmlVersao = 0;

function normalizarDocumentoValidacao(original) {
  const copia = document.implementation.createDocument(null, null);
  function copiar(no) {
    if (no.nodeType !== 1) return copia.importNode(no, true);
    const el = copia.createElementNS(no.namespaceURI, no.localName);
    for (const attr of no.attributes) {
      if (attr.namespaceURI !== 'http://www.w3.org/2000/xmlns/') el.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    }
    for (const filho of no.childNodes) el.appendChild(copiar(filho));
    return el;
  }
  copia.appendChild(copiar(original.documentElement));
  return copia;
}

function analisarXml(texto, nome = 'XML colado') {
  const r = { nome, tipo:'Não identificado', status:'erro', verificacoes:[], texto, editavel:false };
  const add = (nivel, etapa, mensagem, localizacao) => r.verificacoes.push({ nivel, etapa, mensagem, ...(localizacao ? {localizacao} : {}) });
  if (!texto.trim()) { add('erro','Entrada','O conteúdo está vazio.'); return r; }
  if (new Blob([texto]).size > LIMITE_XML_BYTES) {
    r.texto = ''; add('erro','Entrada','O limite é de 5 MB por XML.'); return r;
  }
  const markup = texto.replace(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>/g, '');
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(markup)) {
    add('erro','Sintaxe','Documentos com DTD ou entidades declaradas não são suportados nesta tela.'); return r;
  }
  const original = new DOMParser().parseFromString(texto, 'application/xml');
  if (original.getElementsByTagNameNS('*','parsererror').length) {
    const detalhe=original.documentElement.textContent.trim();
    const ponto=detalhe.match(/(?:linha|line)?\s*(\d+)\s*[:;,]\s*(?:coluna|column)?\s*(\d+)/i);
    add('erro','Sintaxe','XML malformado: ' + detalhe.slice(0,1200),ponto ? `Linha ${ponto[1]}, coluna ${ponto[2]}` : 'Posição não informada pelo navegador'); return r;
  }
  add('sucesso','Sintaxe','XML bem formado: tags, atributos e caracteres puderam ser interpretados.');
  const raiz = original.documentElement.localName;
  const tipos = { NFe:'NF-e', nfeProc:'NF-e', CTe:'CT-e', cteProc:'CT-e' };
  if (!Object.hasOwn(tipos, raiz)) {
    r.tipo = raiz; r.status = 'nao-suportado';
    add('aviso','Estrutura',`Raiz ${raiz}: apenas a sintaxe foi conferida. As regras desta tela atendem NF-e e CT-e.`); return r;
  }
  r.tipo = tipos[raiz];
  const tag = r.tipo === 'NF-e' ? 'NFe' : 'CTe';
  const namespace = 'http://www.portalfiscal.inf.br/' + (tag === 'NFe' ? 'nfe' : 'cte');
  if (original.documentElement.namespaceURI !== namespace) add('erro','Estrutura','Namespace fiscal ausente ou diferente do esperado.');
  const doc = normalizarDocumentoValidacao(original);
  const fiscal = raiz === tag ? doc.documentElement : [...doc.documentElement.children].find(el => el.localName === tag);
  const inf = fiscal && [...fiscal.children].find(el => el.localName === (tag === 'NFe' ? 'infNFe' : 'infCte'));
  if (!inf || inf.namespaceURI !== namespace) { add('erro','Estrutura',`Estrutura principal de ${r.tipo} ausente ou com namespace incorreto.`); return r; }
  r.editavel = true;
  add('sucesso','Estrutura',`Estrutura principal de ${r.tipo} identificada.`);
  const campos = ['ide > cUF','ide > mod','ide > serie','ide > cDV','emit > CNPJ','emit > xNome', tag === 'NFe' ? 'ide > nNF' : 'ide > nCT'];
  if (tag === 'NFe') campos.push('total > ICMSTot > vProd');
  const infNome=tag === 'NFe' ? 'infNFe' : 'infCte';
  for (const campo of campos) if (!inf.querySelector(campo)?.textContent.trim()) add('erro','Campos básicos',`Campo ausente ou vazio: ${campo}.`,`${tag} > ${infNome} > ${campo}`);
  if (!new RegExp(`^${tag}\\d{44}$`).test(inf.getAttribute('Id') || '')) add('erro','Chave',`Id deve começar com ${tag} e conter uma chave numérica de 44 dígitos.`,`${tag} > ${infNome} atributo Id`);
  if (inf.querySelector('ide > mod')?.textContent.trim() !== (tag === 'NFe' ? '55' : '57')) add('erro','Identificação',`Modelo diferente do esperado para ${r.tipo}.`,`${tag} > ${infNome} > ide > mod`);
  const problemas = verificarConsistenciaXml(doc);
  problemas.forEach(mensagem => add('erro','Consistência',mensagem));
  if (!problemas.length) add('sucesso','Consistência','Nenhuma divergência nas verificações compartilhadas de chave, CNPJ e produtos.');
  const protocolo = doc.querySelector(tag === 'NFe' ? 'protNFe > infProt' : 'protCTe > infProt');
  if (protocolo) {
    const chave = protocolo.querySelector(tag === 'NFe' ? 'chNFe' : 'chCTe')?.textContent.trim();
    if (chave !== (inf.getAttribute('Id') || '').slice(3)) add('erro','Protocolo','Chave do protocolo diverge do Id do documento.');
  } else add('aviso','Protocolo','Protocolo não encontrado. O XML pode ser um documento ainda não processado.');
  if (tag === 'NFe') {
    const numeros = new Set();
    inf.querySelectorAll('det').forEach((item, idx) => {
      const numero = item.getAttribute('nItem');
      if (!/^[1-9]\d*$/.test(numero || '') || numeros.has(numero)) add('erro','Produtos',`Item ${idx+1}: nItem ausente, inválido ou repetido.`,`det[${idx+1}] atributo nItem`);
      numeros.add(numero);
      for (const campo of ['xProd','qCom','vUnCom','vProd']) if (!item.querySelector('prod > ' + campo)?.textContent.trim()) add('erro','Produtos',`Item ${idx+1}: ${campo} ausente ou vazio.`,`det[${idx+1}] > prod > ${campo}`);
    });
  }
  add('aviso','Cobertura','Não foram verificados XSD, assinatura digital, todas as regras tributárias nem autorização na SEFAZ.');
  r.status = r.verificacoes.some(v => v.nivel === 'erro') ? 'erro' : 'sem-erros';
  return r;
}

function renderValidacaoXml() {
  document.getElementById('validacao-exportar').disabled = !relatoriosXml.length;
  document.getElementById('validacao-filtro-area').hidden = !relatoriosXml.length;
  const filtro = document.getElementById('validacao-filtro').value;
  const erros = relatoriosXml.filter(r => r.status === 'erro').length;
  document.getElementById('validacao-resumo').textContent = relatoriosXml.length
    ? `${relatoriosXml.length} XML(s) analisado(s); ${erros} com erro(s). Consulte a cobertura em cada relatório.`
    : 'Importe arquivos, cole um XML ou use o documento do gerador.';
  document.getElementById('validacao-resultados').innerHTML = relatoriosXml.map((r, idx) => {
    const contagem = nivel => r.verificacoes.filter(v => v.nivel === nivel).length;
    const visiveis = r.verificacoes.filter(v => filtro === 'todos' || v.nivel === filtro);
    const titulo = { erro:'Erros encontrados', 'sem-erros':'Sem erros nas verificações executadas', 'nao-suportado':'Somente sintaxe verificada' }[r.status];
    return `<article class="painel-novo validacao-relatorio"><div class="painel-cabecalho"><h3>${escapeHtml(r.nome)}</h3><span class="validacao-selo">${escapeHtml(r.tipo)}</span></div>
      <p class="validacao-conclusao">${titulo}</p>
      <p class="texto-apoio">${contagem('erro')} erros · ${contagem('aviso')} avisos · ${contagem('sucesso')} verificações sem erro</p>
      ${visiveis.length ? `<ul class="validacao-lista">${visiveis.map(v => `<li class="validacao-${v.nivel}"><strong>${{erro:'Erro',aviso:'Aviso',sucesso:'OK'}[v.nivel]} · ${escapeHtml(v.etapa)}</strong>${v.localizacao ? `<span class="validacao-localizacao">Local: ${escapeHtml(v.localizacao)}</span>` : ''}<span>${escapeHtml(v.mensagem)}</span></li>`).join('')}</ul>` : '<p class="texto-apoio">Nenhuma verificação nesta categoria. Selecione Todas para consultar o relatório completo.</p>'}
      ${r.editavel ? `<button type="button" onclick="abrirValidacaoNoEditor(${idx})">Abrir cópia no editor</button>` : ''}
      ${r.texto ? `<details class="validacao-fonte"><summary>Ver conteúdo analisado</summary><pre>${escapeHtml(r.texto)}</pre></details>` : ''}</article>`;
  }).join('');
}

function validarXmlColado(event) {
  event?.preventDefault(); validacaoXmlVersao++;
  relatoriosXml = [analisarXml(document.getElementById('validacao-texto').value)];
  renderValidacaoXml(); return false;
}

function validarXmlDoGerador() {
  validacaoXmlVersao++; gerarXMLComCampos();
  const tipo = document.getElementById('validacao-gerado-tipo').value;
  const doc = xmlsGerados[tipo];
  if (!doc) { mostrarStatus('Gere um XML primeiro.','error'); return; }
  relatoriosXml = [analisarXml(serializarXml(doc),`${tipo.toUpperCase()} do gerador`)]; renderValidacaoXml();
}

function lerArquivoValidacao(file) {
  return new Promise((resolve,reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    leitor.onabort = () => reject(new Error('Leitura interrompida.'));
    leitor.readAsText(file,'UTF-8');
  });
}

async function validarArquivosXml(files) {
  const arquivos = Array.from(files);
  if (!arquivos.length) return;
  const versao = ++validacaoXmlVersao;
  if (arquivos.length > 10) { renderValidacaoXml(); mostrarStatus('Selecione no máximo 10 arquivos por análise.','error'); return; }
  document.getElementById('validacao-resumo').textContent = 'Lendo e analisando os arquivos…';
  const resultados = [];
  for (const file of arquivos) {
    if (versao !== validacaoXmlVersao) return;
    try {
      if (!/\.xml$/i.test(file.name)) throw new Error('Selecione um arquivo com extensão .xml.');
      if (file.size > LIMITE_XML_BYTES) throw new Error('O limite é de 5 MB por XML.');
      resultados.push(analisarXml(await lerArquivoValidacao(file),file.name));
    } catch (erro) {
      resultados.push({ nome:file.name,tipo:'Não identificado',status:'erro',texto:'',editavel:false,verificacoes:[{nivel:'erro',etapa:'Leitura',mensagem:erro.message}] });
    }
  }
  if (versao !== validacaoXmlVersao) return;
  relatoriosXml = resultados; renderValidacaoXml();
}

function limparValidacaoXml() {
  validacaoXmlVersao++; relatoriosXml = [];
  document.getElementById('validacao-filtro').value = 'todos';
  document.getElementById('validacao-texto').value = '';
  document.getElementById('validacao-arquivos').value = ''; renderValidacaoXml();
}

function exportarRelatorioXml() {
  if (!relatoriosXml.length) return;
  const documentos = relatoriosXml.map(({texto,editavel,...relatorio}) => relatorio);
  baixarTexto('relatorio-validacao-xml.json',JSON.stringify({geradoEm:new Date().toISOString(),cobertura:'Sintaxe e verificações básicas locais; sem XSD, assinatura digital ou consulta SEFAZ.',documentos},null,2),'application/json');
}

function abrirValidacaoNoEditor(idx) {
  const r = relatoriosXml[idx];
  if (!r?.editavel) return;
  const doc = new DOMParser().parseFromString(r.texto,'application/xml');
  editorGarantirGrupoPadrao();
  const id = editorProxId++;
  const nome = /\.xml$/i.test(r.nome) ? r.nome : `validacao-${id}.xml`;
  editorArquivos.push({id,nome,doc,original:serializarXml(doc),modificado:false,grupoId:editorGrupoAtivo,_estrutura:null});
  editorSubTabAtual = 'estrutura'; editorPosCarga(id); switchTab('editor');
  mostrarStatus('Cópia aberta no editor. O relatório mantém o conteúdo analisado.');
}

function inicializarValidacaoXml() {
  const input = document.getElementById('validacao-arquivos');
  input.addEventListener('change',() => { validarArquivosXml(input.files); input.value = ''; });
  const drop = document.getElementById('validacao-dropzone');
  drop.addEventListener('dragover',e => { e.preventDefault(); drop.classList.add('arrastando'); });
  drop.addEventListener('dragleave',() => drop.classList.remove('arrastando'));
  drop.addEventListener('drop',e => { e.preventDefault(); drop.classList.remove('arrastando'); validarArquivosXml(e.dataTransfer.files); });
  renderValidacaoXml();
}
