// Documentos isolados: nenhuma operação substitui os campos do XML Fiscal.
function gerarXmlComando(tipo,quantidade=1) {
  const parser=new DOMParser();
  const xml={nfeList:[parser.parseFromString(normalizarAssinaturaExemplo(nfeModel),'application/xml')],cte:parser.parseFromString(normalizarAssinaturaExemplo(cteModel),'application/xml')};
  const nfe=xml.nfeList[0],inf=nfe.querySelector('infNFe'),modelo=inf.querySelector('det').cloneNode(true);
  inf.querySelectorAll('det').forEach(no=>no.remove());
  for(let i=0;i<quantidade;i++) {
    const item=modelo.cloneNode(true),produto=pick(catalogoProdutos),q=1+rand(100),valor=(q*(10+rand(90))).toFixed(2);
    item.setAttribute('nItem',String(i+1));
    const set=(tag,v)=>{const no=item.querySelector('prod > '+tag);if(no)no.textContent=String(v);};
    set('cProd',produto.codigo);set('xProd',produto.nome);set('NCM',produto.ncm);set('qCom',q.toFixed(4));set('qTrib',q.toFixed(4));set('uCom','KG');set('uTrib','KG');set('vProd',valor);set('vUnCom',(Number(valor)/q).toFixed(10));set('vUnTrib',(Number(valor)/q).toFixed(10));
    inf.insertBefore(item,inf.querySelector('total'));
  }
  geraNovosNumerosCodigosAleatorios(xml,{nfe:getHierarquiaNFe(),cte:getHierarquiaCTe()});
  const dados=gerarDadosAleatoriosNFe();
  aplicarDadosDinamicosNFe(nfe,dados,nfe.querySelector('emit > xNome').textContent);
  recalcularTotaisEPesoNFe(nfe);
  const chaves={};
  for(const [id,doc,h] of [['nfe',nfe,getHierarquiaNFe()],['cte',xml.cte,getHierarquiaCTe()]]) {
    const partes=getChaveParts(doc.querySelector(h.chave).textContent.trim());
    partes.cnpj=doc.querySelector(h.emit).textContent;partes.numero=doc.querySelector(h.numero).textContent.padStart(9,'0');partes.codigo=doc.querySelector(h.codigo).textContent.padStart(8,'0');
    partes.uf=doc.querySelector(h.uf).textContent;
    const chave=formarNovaChave({partes}).chave;chaves[id]=chave;
    doc.querySelector(h.inf_Id).setAttribute('Id',(id==='nfe'?'NFe':'CTe')+chave);
    doc.querySelector(h.reference_URI).setAttribute('URI','#'+(id==='nfe'?'NFe':'CTe')+chave);
    doc.querySelector(h.chave).textContent=chave;doc.querySelector(h.dv).textContent=chave.at(-1);
    // Ambiente de homologação e assinaturas de exemplo; nenhuma autorização oficial.
    doc.querySelectorAll('tpAmb').forEach(no=>no.textContent='2');
  }
  xml.cte.querySelector(getHierarquiaCTe().chaveNFe).textContent=chaves.nfe;
  xml.cte.querySelector(getHierarquiaCTe().qrCode).textContent=`https://cte.fazenda.mg.gov.br/portalcte/sistema/qrcode.xhtml?chCTe=${chaves.cte}&tpAmb=2`;
  registerGeneratorUse(tipo);
  return {xml:{texto:serializarXml(tipo==='nfe'?nfe:xml.cte),nome:`${tipo.toUpperCase()}-comando.xml`,tipo},titulo:`${tipo==='nfe'?'NF-e':'CT-e'} de teste gerado`,texto:'Dados sintéticos, assinatura de exemplo e ambiente de homologação. O XML Fiscal foi preservado.'};
}
function fonteXmlComando(fonte='') {
  const anexo=document.getElementById('chat-anexo').value.trim();
  if(fonte==='anexado'||(!fonte&&anexo)) {
    if(!anexo)throw new Error('Adicione um XML pelo botão + antes de usar “XML anexado”.');
    if(new Blob([anexo]).size>100000)throw new Error('O anexo ultrapassa 100 KB. Remova-o ou use um arquivo menor.');
    return {texto:anexo,nome:anexoChatNome||'XML colado'};
  }
  if(fonte==='atual'||fonte.endsWith(' atual')) {
    const tipo=fonte.startsWith('nf')?'nfe':fonte.startsWith('ct')?'cte':document.getElementById('chat-anexo-tipo').value;
    if(!xmlsGerados[tipo])throw new Error('Gere um XML no XML Fiscal ou adicione um anexo pelo botão +.');
    return {texto:serializarXml(xmlsGerados[tipo].cloneNode(true)),nome:`${tipo.toUpperCase()} atual`};
  }
  const xml=[...conversasChat].reverse().find(c=>c.xml)?.xml;
  if(xml)return {...xml};
  throw new Error('Adicione um XML pelo botão +, gere um XML por comando ou indique “NF-e atual” ou “CT-e atual”.');
}
function executarXmlComando(comando,fonteSelecionada) {
  if(comando.acao==='gerar-xml')return gerarXmlComando(comando.tipo,comando.quantidade);
  const fonte=fonteSelecionada||fonteXmlComando(comando.fonte),relatorio=analisarXml(fonte.texto,fonte.nome);
  const escopo='Validação local: sintaxe e regras de domínio. XSD e autorização SEFAZ não foram executados.';
  if(comando.acao==='validar'||comando.acao==='erros') {
    const achados=relatorio.verificacoes.filter(v=>comando.acao!=='erros'||v.nivel==='erro');
    return {titulo:comando.acao==='erros'?'Erros encontrados':'Validação local',texto:`Fonte: ${fonte.nome}\n${escopo}\n\n`+(achados.map(v=>`${v.nivel.toUpperCase()} · ${v.mensagem}${v.localizacao?'\n'+v.localizacao:''}`).join('\n\n')||'Nenhum erro encontrado nas verificações locais.'),fonte};
  }
  if(!relatorio.editavel)throw new Error('Este XML não pôde ser consultado. Use “validar XML anexado” para conferir a sintaxe e o tipo.');
  const doc=normalizarDocumentoValidacao(new DOMParser().parseFromString(fonte.texto,'application/xml'));
  const tipo=relatorio.tipo==='NF-e'?'nfe':relatorio.tipo==='CT-e'?'cte':null;
  if(!tipo)throw new Error('As consultas fiscais atendem NF-e e CT-e. Use validar para conferir a sintaxe de outro XML.');
  if(comando.acao==='negativo') {
    const negativo=criarVarianteNegativaXml(tipo,comando.variante,doc);
    if(!negativo)throw new Error('A cópia de teste não pode ser criada: o campo necessário não existe ou já contém o erro solicitado.');
    return {titulo:`Cópia de teste: ${negativo.rotulo}`,texto:`Fonte: ${fonte.nome}\n${negativo.descricao}\nErro intencional. O original foi preservado.`,xml:{texto:negativo.texto,nome:negativo.nome,tipo,intencional:true}};
  }
  const resumo=relatorio.resumo;
  if(comando.acao==='destinatario')return {titulo:'Destinatário',texto:`Fonte: ${fonte.nome}\nNome: ${resumo.destinatario||'Não informado'}\nDocumento: ${resumo.documentoDestinatario||'Não informado'}`,fonte};
  if(comando.acao==='produtos') {
    if(tipo!=='nfe')throw new Error('Produtos detalhados são uma consulta de NF-e. Para CT-e, use “resumir XML anexado”.');
    const registros=[...doc.querySelectorAll('det')].slice(0,500).map(det=>({tipo:'produto-xml',rotulo:`Produto ${det.getAttribute('nItem')||''}`,valor:Object.fromEntries([['código','cProd'],['descrição','xProd'],['NCM','NCM'],['quantidade','qCom'],['unidade','uCom'],['valor','vProd']].map(([r,t])=>[r,det.querySelector('prod > '+t)?.textContent||'']))}));
    return {titulo:`${registros.length} produtos do XML`,texto:`Fonte: ${fonte.nome}`,registros,fonte};
  }
  const rotulos={tipo:'Tipo',raiz:'Raiz',chave:'Chave',emitente:'Emitente',documentoEmitente:'Documento do emitente',destinatario:'Destinatário',documentoDestinatario:'Documento do destinatário',itens:'Itens',valorTotal:'Valor total',pesoBruto:'Peso bruto'};
  return {titulo:'Resumo do XML',texto:`Fonte: ${fonte.nome}\n`+Object.entries(resumo).map(([k,v])=>`${rotulos[k]||k}: ${v||'Não informado'}`).join('\n'),fonte};
}
