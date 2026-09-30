// Verificações locais: não executa XSD, assinatura digital ou consulta à SEFAZ.
const LIMITE_XML_BYTES = 5 * 1024 * 1024;
const VISAO_VALIDACAO_PADRAO = 'resumo';
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

function caminhoXml(no, limite) {
  const partes = [];
  let atual = no;
  while (atual && atual.nodeType === 1 && atual !== limite) {
    const iguais = atual.parentElement ? [...atual.parentElement.children].filter(item => item.localName === atual.localName) : [];
    const indice = iguais.length > 1 ? `[${iguais.indexOf(atual) + 1}]` : '';
    partes.unshift(`${atual.localName}${indice}`);
    atual = atual.parentElement;
  }
  return partes.join(' > ');
}

function extrairResumoXml(doc, tipo, inf) {
  if (!doc?.documentElement || !inf) return { tipo };
  const tag = tipo === 'NF-e' ? 'NFe' : 'CTe';
  const emitente = inf.querySelector('emit');
  const destinatario = inf.querySelector('dest');
  const documento = bloco => bloco?.querySelector('CNPJ, CPF')?.textContent.trim() || '';
  const itens = tipo === 'NF-e' ? inf.querySelectorAll('det').length : inf.querySelectorAll('infDoc > infNFe, infDoc > infOutros').length;
  return {
    tipo,
    raiz: doc.documentElement.localName,
    chave: (inf.getAttribute('Id') || '').replace(new RegExp(`^${tag}`), ''),
    emitente: emitente?.querySelector('xNome')?.textContent.trim() || '',
    documentoEmitente: documento(emitente),
    destinatario: destinatario?.querySelector('xNome')?.textContent.trim() || '',
    documentoDestinatario: documento(destinatario),
    itens,
    valorTotal: inf.querySelector(tipo === 'NF-e' ? 'total > ICMSTot > vNF' : 'vPrest > vTPrest')?.textContent.trim() || '',
    pesoBruto: inf.querySelector(tipo === 'NF-e' ? 'transp > vol > pesoB' : 'infCarga > infQ > qCarga')?.textContent.trim() || ''
  };
}

function detalhesConsistencia(mensagem, inf) {
  let seletor = '';
  if (/CNPJ/i.test(mensagem)) seletor = 'CNPJ';
  else if (/chave|cDV/i.test(mensagem)) seletor = 'ide > cDV';
  else if (/\bcUF\b/i.test(mensagem)) seletor = 'ide > cUF';
  else if (/\bmod\b/i.test(mensagem)) seletor = 'ide > mod';
  else if (/\bserie\b/i.test(mensagem)) seletor = 'ide > serie';
  else if (/\bnNF\b/i.test(mensagem)) seletor = 'ide > nNF';
  else if (/\bnCT\b/i.test(mensagem)) seletor = 'ide > nCT';
  else if (/Total de produtos/i.test(mensagem)) seletor = 'total > ICMSTot > vProd';
  const item = /Item (\d+)/i.exec(mensagem);
  const no = item ? inf.querySelectorAll('det')[Number(item[1]) - 1] : (seletor ? inf.querySelector(seletor) : null);
  return no ? { tag:no.localName, valor:no.textContent.trim(), caminho:caminhoXml(no, inf.parentElement) } : {};
}

function analisarXml(texto, nome = 'XML colado', opcoes = {}) {
  const r = {
    nome,
    tipo:'Não identificado',
    status:'erro',
    verificacoes:[],
    resumo:{ tipo:'Não identificado' },
    texto,
    editavel:false,
    visao:opcoes.visao || VISAO_VALIDACAO_PADRAO,
    intencional:Boolean(opcoes.intencional),
    varianteNegativa:opcoes.varianteNegativa || null
  };
  const add = (nivel, etapa, mensagem, detalhes = {}) => {
    if (typeof detalhes === 'string') detalhes = { caminho:detalhes };
    const linha = detalhes.linha ? Number(detalhes.linha) : undefined;
    const coluna = detalhes.coluna ? Number(detalhes.coluna) : undefined;
    const caminho = detalhes.caminho || '';
    const posicao = linha ? `Linha ${linha}${coluna ? `, coluna ${coluna}` : ''}` : '';
    r.verificacoes.push({
      id:`achado-${r.verificacoes.length + 1}`,
      nivel,
      severidade:nivel,
      etapa,
      mensagem,
      problema:mensagem,
      ...(detalhes.codigo ? {codigo:detalhes.codigo} : {}),
      ...(detalhes.tag ? {tag:detalhes.tag} : {}),
      ...(Object.hasOwn(detalhes,'valor') ? {valor:String(detalhes.valor)} : {}),
      ...(caminho ? {caminho,localizacao:caminho} : {}),
      ...(linha ? {linha} : {}),
      ...(coluna ? {coluna} : {}),
      ...(!caminho && posicao ? {localizacao:posicao} : {}),
      ...(detalhes.localizacao && !caminho && !posicao ? {localizacao:detalhes.localizacao} : {})
    });
  };
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
    add('erro','Sintaxe','XML malformado: ' + detalhe.slice(0,1200),ponto
      ? { linha:ponto[1], coluna:ponto[2], codigo:'xml-malformado' }
      : { localizacao:'Posição não informada pelo navegador', codigo:'xml-malformado' });
    return r;
  }
  add('informacao','Sintaxe','XML bem formado: tags, atributos e caracteres puderam ser interpretados.',{codigo:'xml-bem-formado'});
  const raiz = original.documentElement.localName;
  const tipos = { NFe:'NF-e', nfeProc:'NF-e', CTe:'CT-e', cteProc:'CT-e' };
  if (!Object.hasOwn(tipos, raiz)) {
    r.tipo = raiz; r.resumo = {tipo:raiz,raiz}; r.status = 'nao-suportado';
    add('aviso','Estrutura',`Raiz ${raiz}: apenas a sintaxe foi conferida. As regras desta tela atendem NF-e e CT-e.`,{tag:raiz,valor:raiz,caminho:raiz,codigo:'raiz-nao-suportada'}); return r;
  }
  r.tipo = tipos[raiz];
  const tag = r.tipo === 'NF-e' ? 'NFe' : 'CTe';
  const namespace = 'http://www.portalfiscal.inf.br/' + (tag === 'NFe' ? 'nfe' : 'cte');
  if (original.documentElement.namespaceURI !== namespace) add('erro','Estrutura','Namespace fiscal ausente ou diferente do esperado.',{tag:raiz,valor:original.documentElement.namespaceURI || '',caminho:raiz,codigo:'namespace-invalido'});
  const doc = normalizarDocumentoValidacao(original);
  const fiscal = raiz === tag ? doc.documentElement : [...doc.documentElement.children].find(el => el.localName === tag);
  const infNome=tag === 'NFe' ? 'infNFe' : 'infCte';
  const inf = fiscal && [...fiscal.children].find(el => el.localName === infNome);
  if (!inf || inf.namespaceURI !== namespace) {
    add('erro','Estrutura',`Estrutura principal de ${r.tipo} ausente ou com namespace incorreto.`,{tag:infNome,caminho:`${tag} > ${infNome}`,codigo:'estrutura-principal-ausente'}); return r;
  }
  r.editavel = true;
  r.resumo = extrairResumoXml(doc,r.tipo,inf);
  add('informacao','Estrutura',`Estrutura principal de ${r.tipo} identificada.`,{tag:infNome,caminho:`${tag} > ${infNome}`,codigo:'estrutura-identificada'});

  const campos = ['ide > cUF','ide > mod','ide > serie','ide > cDV','emit > CNPJ','emit > xNome', tag === 'NFe' ? 'ide > nNF' : 'ide > nCT'];
  if (tag === 'NFe') campos.push('dest > xNome','total > ICMSTot > vProd','total > ICMSTot > vNF');
  else campos.push('vPrest > vTPrest');
  for (const campo of campos) {
    const no=inf.querySelector(campo);
    if (!no?.textContent.trim()) add('erro','Campos básicos',`Campo ausente ou vazio: ${campo}.`,{tag:campo.split(' > ').at(-1),valor:no?.textContent.trim() || '',caminho:`${tag} > ${infNome} > ${campo}`,codigo:'campo-obrigatorio'});
  }

  const id = inf.getAttribute('Id') || '';
  const chave = id.slice(3);
  if (!new RegExp(`^${tag}\\d{44}$`).test(id)) add('erro','Chave',`Id deve começar com ${tag} e conter uma chave numérica de 44 dígitos.`,{tag:'Id',valor:id,caminho:`${tag} > ${infNome} atributo Id`,codigo:'chave-formato'});
  if (inf.querySelector('ide > mod')?.textContent.trim() !== (tag === 'NFe' ? '55' : '57')) {
    const no=inf.querySelector('ide > mod');
    add('erro','Identificação',`Modelo diferente do esperado para ${r.tipo}.`,{tag:'mod',valor:no?.textContent.trim() || '',caminho:`${tag} > ${infNome} > ide > mod`,codigo:'modelo-invalido'});
  }

  for (const no of inf.querySelectorAll('CNPJ, CPF')) {
    const valor=no.textContent.trim();
    const valido=no.localName === 'CPF' ? validarCPF(valor) : validarCNPJ(valor);
    if (!valido) add('erro','Documentos',`${no.localName} ausente ou inconsistente em ${no.parentElement.localName}.`,{tag:no.localName,valor,caminho:caminhoXml(no,inf.parentElement),codigo:`${no.localName.toLowerCase()}-invalido`});
  }

  if (tag === 'NFe') {
    const itens=[...inf.querySelectorAll('det')];
    if (!itens.length) add('erro','Produtos','A NF-e não possui produtos.',{tag:'det',caminho:`${tag} > ${infNome} > det`,codigo:'produtos-ausentes'});
    const numeros = new Set();
    itens.forEach((item,idx) => {
      const numero=item.getAttribute('nItem') || '';
      if (!/^[1-9]\d*$/.test(numero) || numeros.has(numero)) add('erro','Produtos',`Item ${idx+1}: nItem ausente, inválido ou repetido.`,{tag:'nItem',valor:numero,caminho:`${tag} > ${infNome} > det[${idx+1}] atributo nItem`,codigo:'item-numero'});
      numeros.add(numero);
      for (const campo of ['xProd','qCom','vUnCom','vProd']) {
        const no=item.querySelector('prod > ' + campo);
        const valor=no?.textContent.trim() || '';
        if (!valor) add('erro','Produtos',`Item ${idx+1}: ${campo} ausente ou vazio.`,{tag:campo,valor,caminho:`${tag} > ${infNome} > det[${idx+1}] > prod > ${campo}`,codigo:'produto-campo'});
        else if (['qCom','vUnCom','vProd'].includes(campo) && (!Number.isFinite(Number(valor)) || Number(valor) < 0 || (campo === 'qCom' && Number(valor) <= 0))) {
          add('erro','Produtos',`Item ${idx+1}: ${campo} possui formato ou valor inválido.`,{tag:campo,valor,caminho:`${tag} > ${infNome} > det[${idx+1}] > prod > ${campo}`,codigo:'produto-valor'});
        }
      }
    });
  }

  const mensagens = new Set(r.verificacoes.map(item => item.mensagem));
  for (const mensagem of verificarConsistenciaXml(doc)) {
    if (!mensagens.has(mensagem)) add('erro','Consistência',mensagem,{...detalhesConsistencia(mensagem,inf),codigo:'consistencia'});
  }
  if (!r.verificacoes.some(v => v.nivel === 'erro')) add('informacao','Consistência','Nenhuma divergência nas verificações compartilhadas de chave, documentos, valores e produtos.',{codigo:'consistencia-ok'});

  const protocolo = doc.querySelector(tag === 'NFe' ? 'protNFe > infProt' : 'protCTe > infProt');
  if (protocolo) {
    const chaveProtocolo = protocolo.querySelector(tag === 'NFe' ? 'chNFe' : 'chCTe');
    const valor = chaveProtocolo?.textContent.trim() || '';
    if (valor !== chave) add('erro','Protocolo','Chave do protocolo diverge do Id do documento.',{tag:chaveProtocolo?.localName || (tag === 'NFe' ? 'chNFe' : 'chCTe'),valor,caminho:caminhoXml(chaveProtocolo,doc.documentElement.parentElement),codigo:'protocolo-chave'});
  } else add('aviso','Protocolo','Protocolo não encontrado. O XML pode ser um documento ainda não processado.',{codigo:'protocolo-ausente'});

  add('aviso','Cobertura','Não foram verificados XSD, assinatura digital, todas as regras tributárias nem autorização na SEFAZ.',{codigo:'cobertura-local'});
  r.status = r.verificacoes.some(v => v.nivel === 'erro') ? 'erro' : 'sem-erros';
  return r;
}

function valorResumo(rotulo,valor) {
  if (valor === '' || valor === undefined || valor === null) return '';
  return `<div><dt>${escapeHtml(rotulo)}</dt><dd>${escapeHtml(String(valor))}</dd></div>`;
}

function renderResumoValidacao(r) {
  const resumo=r.resumo || {};
  const titulo={erro:'Erros encontrados','sem-erros':'Sem erros nas verificações executadas','nao-suportado':'Somente sintaxe verificada'}[r.status] || 'Análise concluída';
  return `<p class="validacao-conclusao">${titulo}</p>
    ${r.intencional ? `<div class="validacao-intencional" role="note"><strong>Dado sintético intencionalmente inválido</strong><span>${escapeHtml(r.varianteNegativa?.rotulo || 'Variante negativa')} — ${escapeHtml(r.varianteNegativa?.descricao || 'Use somente em testes controlados.')}</span></div>` : ''}
    <dl class="validacao-resumo-grade">
      ${valorResumo('Tipo',resumo.tipo || r.tipo)}${valorResumo('Raiz',resumo.raiz)}${valorResumo('Chave',resumo.chave)}
      ${valorResumo('Emitente',resumo.emitente)}${valorResumo('Documento do emitente',resumo.documentoEmitente)}
      ${valorResumo('Destinatário',resumo.destinatario)}${valorResumo('Documento do destinatário',resumo.documentoDestinatario)}
      ${valorResumo('Itens',resumo.itens)}${valorResumo('Valor total',resumo.valorTotal)}${valorResumo('Peso bruto',resumo.pesoBruto)}
    </dl>`;
}

function renderAchadoValidacao(v) {
  const rotulo={erro:'Erro',aviso:'Aviso',informacao:'Informação'}[v.nivel] || v.nivel;
  const detalhes=[
    v.tag ? `<span><b>Tag:</b> ${escapeHtml(v.tag)}</span>` : '',
    Object.hasOwn(v,'valor') ? `<span><b>Valor:</b> ${escapeHtml(v.valor || '(vazio)')}</span>` : '',
    v.caminho ? `<span class="validacao-localizacao"><b>Caminho:</b> ${escapeHtml(v.caminho)}</span>` : '',
    v.linha ? `<span class="validacao-localizacao"><b>Posição:</b> linha ${v.linha}${v.coluna ? `, coluna ${v.coluna}` : ''}</span>` : (!v.caminho && v.localizacao ? `<span class="validacao-localizacao"><b>Local:</b> ${escapeHtml(v.localizacao)}</span>` : '')
  ].join('');
  return `<li class="validacao-${v.nivel}"><strong>${rotulo} · ${escapeHtml(v.etapa)}</strong>${detalhes}<span>${escapeHtml(v.mensagem)}</span></li>`;
}

function renderValidacaoXml() {
  document.getElementById('validacao-exportar').disabled = !relatoriosXml.length;
  document.getElementById('validacao-filtro-area').hidden = !relatoriosXml.length;
  const filtro = document.getElementById('validacao-filtro').value;
  const erros = relatoriosXml.filter(r => r.status === 'erro').length;
  document.getElementById('validacao-resumo').textContent = relatoriosXml.length
    ? `${relatoriosXml.length} XML(s) analisado(s); ${erros} com erro(s). Consulte a cobertura em cada relatório.`
    : 'Importe arquivos, cole um XML, use o documento do gerador ou crie uma variante negativa.';
  document.getElementById('validacao-resultados').innerHTML = relatoriosXml.map((r, idx) => {
    const contagem = nivel => r.verificacoes.filter(v => v.nivel === nivel).length;
    const visiveis = r.verificacoes.filter(v => filtro === 'todos' || v.nivel === filtro);
    const visao=r.visao || VISAO_VALIDACAO_PADRAO;
    const painel=(nome,conteudo)=>`<section id="validacao-painel-${idx}-${nome}" role="tabpanel" aria-labelledby="validacao-tab-${idx}-${nome}" ${visao === nome ? '' : 'hidden'}>${conteudo}</section>`;
    return `<article class="painel-novo validacao-relatorio" data-relatorio="${idx}"><div class="painel-cabecalho"><h3>${escapeHtml(r.nome)}</h3><div class="validacao-selos"><span class="validacao-selo">${escapeHtml(r.tipo)}</span>${r.intencional ? '<span class="validacao-selo validacao-selo-negativo">Teste negativo</span>' : ''}</div></div>
      <div class="validacao-abas" role="tablist" aria-label="Visualizações de ${escapeHtml(r.nome)}">
        ${['resumo','xml','validacao'].map(nome=>`<button type="button" role="tab" id="validacao-tab-${idx}-${nome}" aria-selected="${visao === nome}" aria-controls="validacao-painel-${idx}-${nome}" tabindex="${visao === nome ? '0' : '-1'}" onclick="alternarVisaoValidacao(${idx},'${nome}')" onkeydown="navegarAbasValidacao(event,${idx})">${{resumo:'Resumo',xml:'XML',validacao:'Validação'}[nome]}</button>`).join('')}
      </div>
      ${painel('resumo',renderResumoValidacao(r))}
      ${painel('xml',`${r.texto ? `<pre class="validacao-xml-fonte" tabindex="0" aria-label="Conteúdo XML de ${escapeHtml(r.nome)}">${escapeHtml(r.texto)}</pre><div class="acoes-inline">${r.editavel ? `<button type="button" onclick="abrirValidacaoNoEditor(${idx})">Abrir cópia no editor</button>` : ''}${r.intencional ? `<button type="button" onclick="baixarXmlTesteNegativo(${idx})">Baixar XML de teste</button>` : ''}</div>` : '<p class="texto-apoio">O conteúdo não foi mantido porque excedeu o limite de segurança.</p>'}`)}
      ${painel('validacao',`<p class="texto-apoio">${contagem('erro')} erros · ${contagem('aviso')} avisos · ${contagem('informacao')} informações</p>${visiveis.length ? `<ul class="validacao-lista">${visiveis.map(renderAchadoValidacao).join('')}</ul>` : '<p class="texto-apoio">Nenhuma verificação nesta categoria. Selecione Todas para consultar o relatório completo.</p>'}`)}
    </article>`;
  }).join('');
}

function alternarVisaoValidacao(idx,visao) {
  const relatorio=relatoriosXml[idx];
  if (!relatorio || !['resumo','xml','validacao'].includes(visao)) return;
  relatorio.visao=visao; renderValidacaoXml();
  document.getElementById(`validacao-tab-${idx}-${visao}`)?.focus({preventScroll:true});
}

function navegarAbasValidacao(event,idx) {
  const visoes=['resumo','xml','validacao'];
  const atual=visoes.indexOf(relatoriosXml[idx]?.visao || VISAO_VALIDACAO_PADRAO);
  let proxima=-1;
  if (event.key === 'ArrowRight') proxima=(atual+1)%visoes.length;
  else if (event.key === 'ArrowLeft') proxima=(atual-1+visoes.length)%visoes.length;
  else if (event.key === 'Home') proxima=0;
  else if (event.key === 'End') proxima=visoes.length-1;
  if (proxima < 0) return;
  event.preventDefault(); alternarVisaoValidacao(idx,visoes[proxima]);
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

const VARIANTES_XML_NEGATIVAS = {
  'cpf-invalido':{rotulo:'CPF inválido',descricao:'Substitui o documento do destinatário por um CPF com dígitos inconsistentes.'},
  'cnpj-invalido':{rotulo:'CNPJ inválido',descricao:'Substitui o primeiro CNPJ por uma sequência com dígitos inconsistentes.'},
  'chave-invalida':{rotulo:'Chave inválida',descricao:'Altera o dígito final da chave de acesso sem recalcular o documento.'},
  'campo-ausente':{rotulo:'Campo obrigatório ausente',descricao:'Remove o nome do emitente da estrutura fiscal.'},
  'formato-invalido':{rotulo:'Formato inválido',descricao:'Troca o modelo fiscal numérico por um valor fora do formato esperado.'},
  'tag-invalida':{rotulo:'Tag inválida',descricao:'Renomeia uma tag obrigatória para simular estrutura desconhecida.'},
  'xml-malformado':{rotulo:'XML malformado',descricao:'Remove o fechamento da raiz para provocar erro de sintaxe.'}
};

function substituirTagXml(doc,no,novoNome,valor) {
  const novo=doc.createElementNS(no.namespaceURI,novoNome);
  for (const attr of no.attributes) novo.setAttributeNS(attr.namespaceURI,attr.name,attr.value);
  if (valor !== undefined) novo.textContent=valor;
  else while (no.firstChild) novo.appendChild(no.firstChild);
  no.parentNode.replaceChild(novo,no);
  return novo;
}

function criarVarianteNegativaXml(tipo,variante) {
  const base=xmlsGerados[tipo]?.cloneNode(true);
  const definicao=VARIANTES_XML_NEGATIVAS[variante];
  if (!base || !definicao) return null;
  const inf=base.querySelector(tipo === 'nfe' ? 'infNFe' : 'infCte');
  let texto='';
  if (variante === 'cpf-invalido') {
    const documento=inf.querySelector('dest > CNPJ, dest > CPF') || inf.querySelector('rem > CNPJ, rem > CPF');
    if (documento) substituirTagXml(base,documento,'CPF','00000000000');
  } else if (variante === 'cnpj-invalido') {
    const documento=inf.querySelector('CNPJ'); if (documento) documento.textContent='00000000000000';
  } else if (variante === 'chave-invalida') {
    const id=inf.getAttribute('Id') || ''; const ultimo=id.at(-1); inf.setAttribute('Id',id.slice(0,-1)+(ultimo === '9' ? '0' : String(Number(ultimo || 0)+1)));
  } else if (variante === 'campo-ausente') {
    inf.querySelector('emit > xNome')?.remove();
  } else if (variante === 'formato-invalido') {
    const modelo=inf.querySelector('ide > mod'); if (modelo) modelo.textContent='XX';
  } else if (variante === 'tag-invalida') {
    const nome=inf.querySelector('emit > xNome'); if (nome) substituirTagXml(base,nome,'xNomeInvalido');
  }
  texto=serializarXml(base);
  if (variante === 'xml-malformado') texto=texto.replace(/<\/[^>]+>\s*$/,'');
  return {texto,nome:`${tipo.toUpperCase()}-teste-${variante}.xml`,rotulo:definicao.rotulo,descricao:definicao.descricao,variante};
}

function gerarXmlNegativo() {
  validacaoXmlVersao++; gerarXMLComCampos();
  const tipo=document.getElementById('validacao-negativa-tipo').value;
  const variante=document.getElementById('validacao-negativa-variante').value;
  const negativo=criarVarianteNegativaXml(tipo,variante);
  if (!negativo) { mostrarStatus('Não foi possível criar a variante negativa.','error'); return; }
  const {texto,...metadados}=negativo;
  const relatorio=analisarXml(texto,negativo.nome,{intencional:true,varianteNegativa:metadados});
  relatoriosXml=[relatorio];
  document.getElementById('validacao-texto').value=negativo.texto;
  renderValidacaoXml();
  document.getElementById('validacao-resultados').focus({preventScroll:true});
  mostrarStatus(`Variante “${negativo.rotulo}” criada para teste controlado.`);
}

function baixarXmlTesteNegativo(idx) {
  const r=relatoriosXml[idx];
  if (!r?.intencional || !r.texto) return;
  baixarTexto(r.nome,r.texto,'application/xml');
  mostrarStatus('XML intencionalmente inválido preparado para download.');
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

function definirValidacaoOcupada(ocupada) {
  const entrada = document.querySelector('.validacao-entrada');
  const input = document.getElementById('validacao-arquivos');
  const seletor = document.querySelector('.validacao-dropzone-inner');
  entrada?.setAttribute('aria-busy',String(ocupada));
  if (input) input.disabled = ocupada;
  if (seletor) seletor.disabled = ocupada;
}

async function validarArquivosXml(files) {
  const arquivos = Array.from(files);
  if (!arquivos.length) return;
  const versao = ++validacaoXmlVersao;
  const uploadStatus=document.getElementById('validacao-upload-status');
  const nomes=arquivos.map(file=>file.name).join(', ');
  if (arquivos.length > 10) { uploadStatus.textContent='Seleção recusada: mais de 10 arquivos.';renderValidacaoXml(); mostrarStatus('Selecione no máximo 10 arquivos por análise.','error'); return; }
  definirValidacaoOcupada(true);
  uploadStatus.textContent=`Analisando ${arquivos.length} arquivo(s): ${nomes}`;
  document.getElementById('validacao-resumo').textContent = 'Lendo e analisando os arquivos…';
  const resultados = [];
  try {
    for (const file of arquivos) {
      if (versao !== validacaoXmlVersao) return;
      try {
        if (!/\.xml$/i.test(file.name)) throw new Error('Selecione um arquivo com extensão .xml.');
        if (file.size > LIMITE_XML_BYTES) throw new Error('O limite é de 5 MB por XML.');
        resultados.push(analisarXml(await lerArquivoValidacao(file),file.name));
      } catch (erro) {
        resultados.push({ nome:file.name,tipo:'Não identificado',status:'erro',resumo:{tipo:'Não identificado'},texto:'',editavel:false,visao:VISAO_VALIDACAO_PADRAO,intencional:false,varianteNegativa:null,verificacoes:[{id:'achado-1',nivel:'erro',severidade:'erro',etapa:'Leitura',mensagem:erro.message,problema:erro.message}] });
      }
    }
    if (versao !== validacaoXmlVersao) return;
    relatoriosXml = resultados; renderValidacaoXml();
    uploadStatus.textContent=`${arquivos.length} arquivo(s) carregado(s): ${nomes}. Selecione ou arraste novamente para substituir a análise.`;
  } finally {
    if (versao === validacaoXmlVersao) definirValidacaoOcupada(false);
  }
}

function limparValidacaoXml() {
  validacaoXmlVersao++; relatoriosXml = [];
  definirValidacaoOcupada(false);
  document.getElementById('validacao-filtro').value = 'todos';
  document.getElementById('validacao-texto').value = '';
  document.getElementById('validacao-arquivos').value = '';
  document.getElementById('validacao-upload-status').textContent='Até 10 arquivos, com no máximo 5 MB cada';
  renderValidacaoXml();
}

function exportarRelatorioXml() {
  if (!relatoriosXml.length) return;
  const documentos = relatoriosXml.map(({texto,editavel,visao,...relatorio}) => relatorio);
  baixarTexto('relatorio-validacao-xml.json',JSON.stringify({geradoEm:new Date().toISOString(),cobertura:'Sintaxe e verificações estruturais e de domínio disponíveis localmente; sem XSD, assinatura digital ou consulta SEFAZ.',documentos},null,2),'application/json');
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
  drop.addEventListener('dragend',() => drop.classList.remove('arrastando'));
  drop.addEventListener('drop',e => { e.preventDefault(); drop.classList.remove('arrastando'); validarArquivosXml(e.dataTransfer.files); });
  renderValidacaoXml();
}
