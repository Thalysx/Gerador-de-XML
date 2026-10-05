// Gramática fechada: um pedido só executa após ser compreendido por inteiro.
const NOMES_COMANDOS = Object.freeze({
  cpf:['CPFs','cpfs?'],cnpj:['CNPJs','cnpjs?'],nome:['nomes','nomes?(?: de pessoas?)?|pessoas?'],empresa:['empresas','nomes? de empresas?|razoes sociais|razao social|empresas?'],
  cadastro:['cadastros','cadastros?(?: completos?)?'],rg:['RGs','rgs?'],cnh:['CNHs','cnhs?'],cracha:['crachás','crachas?'],
  'cnpj-alfa':['CNPJs alfanuméricos','cnpjs? alfanumericos?'],'nome-fantasia':['nomes fantasia','nomes? fantasia'],email:['e-mails','e-?mails?'],
  endereco:['endereços completos','enderecos?(?: completos?)?'],cep:['CEPs','ceps?'],telefone:['telefones','telefones?|celulares?|celular'],placa:['placas','placas?(?: mercosul)?'],renavam:['RENAVAMs','renavams?'],
  'uuid-v4':['UUIDs','uuids?(?: v4)?|guids?'],'ipv4-documentacao':['IPv4s','ipv4s?(?: de documentacao)?'],'ipv6-documentacao':['IPv6s','ipv6s?(?: de documentacao)?'],
  'mac-local':['MACs locais','macs?(?: locais| local)?|enderecos? mac(?: locais| local)?'],'valor-brl':['valores em BRL','valores? em brl|valor em brl'],
  'pix-evp':['chaves Pix','chaves? pix(?: evp)?(?: sinteticas?)?'],'transacao-teste':['IDs de transação','ids? de transacao(?: de teste)?'],
  conteiner:['contêineres','conteiner(?:es)?|containers?'],'conteiner-lacre':['contêineres e lacres','(?:conteiner(?:es)?|containers?) (?:com|e) lacres?'],lacre:['lacres','lacres?'],imo:['IMOs','imos?'],booking:['bookings','bookings?'],due:['DU-Es','du-?es?'],
  motorista:['motoristas','(?:dados para (?:um |uma )?)?motoristas?'],'operador-portuario':['operadores portuários','operadores? portuarios?'],'visitante-portuario':['visitantes portuários','visitantes? portuarios?'],'pessoa-portuaria':['pessoas portuárias','pessoas? portuarias?'],
  transportadora:['transportadoras','transportadoras?'],'cliente-portuario':['clientes portuários','clientes? portuarios?'],depositante:['depositantes','depositantes?'],importador:['importadores','importador(?:es)?'],exportador:['exportadores','exportador(?:es)?'],
  'cavalo-mecanico':['cavalos mecânicos','cavalos? mecanicos?'],carreta:['carretas','carretas?'],'conjunto-veicular':['conjuntos veiculares','conjuntos? veicular(?:es)?'],
  'carga-solta':['cargas soltas','cargas? soltas?'],'granel-solido':['granéis sólidos','granel solido|graneis solidos'],'granel-liquido':['granéis líquidos','granel liquido|graneis liquidos'],'carga-conteinerizada':['cargas conteinerizadas','cargas? conteinerizadas?'],
  'chave-cte':['chaves de CT-e','chaves? de ct-?e'],di:['DIs de teste','dis?(?: de teste)?'],duimp:['DUIMPs de teste','duimps?(?: de teste)?'],'documento-carga':['documentos de carga','documentos? de carga']
});
const EXEMPLOS_XML_COMANDOS = Object.freeze([
  'gerar NF-e com 3 produtos','gerar CT-e','resumir XML anexado','mostrar produtos do XML anexado','mostrar destinatário do XML anexado',
  'validar XML anexado','mostrar apenas erros do XML anexado','criar cópia com CNPJ inválido','remover campo obrigatório',
  'criar cópia com CPF inválido','criar cópia com chave inválida','criar cópia com formato inválido','criar cópia com tag inválida','criar cópia com XML malformado',
  'repetir último comando','ajuda'
]);
function catalogoComandos(ambiente=activeEnvironmentId()) {
  return [
    ...generatorsForEnvironment(ambiente).filter(g=>g.batch).map(g=>({texto:`3 ${NOMES_COMANDOS[g.id][0]}`,rotulo:g.label,categoria:GENERATOR_CATEGORIES[g.category],tipo:g.id})),
    ...EXEMPLOS_XML_COMANDOS.map(texto=>({texto,rotulo:texto,categoria:'XML e comandos'}))
  ];
}
function normalizarComando(texto) { return normalizeGeneratorText(texto).replace(/^\//,'').replace(/[.!?]+$/,'').trim(); }
function interpretarPedido(texto, mascaraPadrao=true) {
  let restante=normalizarComando(texto);
  if(!restante || texto.length>500)throw new Error('Escreva um comando de até 500 caracteres. Abra o catálogo para ver exemplos.');
  const opcoes={mascara:mascaraPadrao};
  restante=restante.replace(/\b(sem|com) mascara\b/g,(_,modo)=>{opcoes.mascara=modo==='com';return ' ';});
  restante=restante.replace(/\b(sem|com) codigo(?: de)? barras\b/g,(_,modo)=>{opcoes.codigoBarras=modo==='com';return ' ';});
  restante=restante.replace(/\b(?:uf|estado)\s+([a-z]{2})\b/g,(_,uf)=>{
    opcoes.uf=uf.toUpperCase();if(!DDD_POR_UF[opcoes.uf])throw new Error('Use a sigla de uma UF, como SP ou BA.');return ' ';
  });
  restante=restante.replace(/\bfixos?\b/g,()=>{opcoes.telefoneTipo='fixo';return ' ';});
  restante=restante.replace(/\bantigas?\b/g,()=>{opcoes.placaTipo='antiga';return ' ';});
  const quantidades={um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,dez:10};
  restante=restante.replace(/\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\b/g,p=>String(quantidades[p]));
  const pedidos=[];
  // Longest nouns first so compound generators cannot be split into simple ones.
  const aliases=Object.entries(NOMES_COMANDOS).sort((a,b)=>(b[0]==='mac-local'?100:b[1][0].length)-(a[0]==='mac-local'?100:a[1][0].length));
  for(const [tipo,[,alias]] of aliases) {
    const regex=new RegExp('(?:\\b(\\d+)\\s+(?:de\\s+)?)?\\b(?:'+alias+')\\b','g');
    restante=restante.replace(regex,(_,quantidade)=>{pedidos.push({tipo,quantidade:quantidade===undefined?1:Number(quantidade)});return ' ';});
  }
  const sobra=restante.replace(/\b(?:preciso|quero|gere|gerar|crie|criar|me|de|do|da|dos|das|e|para|por|favor|dados|com|sem|o|a|os|as)\b/g,' ').replace(/[\s,;.!?]+/g,'');
  if(sobra || !pedidos.length)throw new Error('Não entendi o comando completo. Use o catálogo; exemplo: “3 CPFs e 2 CNPJs”.');
  const total=pedidos.reduce((n,p)=>n+p.quantidade,0);
  if(total>500 || pedidos.some(p=>!Number.isSafeInteger(p.quantidade)||p.quantidade<1))throw new Error('Use quantidades inteiras de 1 a 500 registros no total.');
  return {pedidos,opcoes};
}
function interpretarComando(texto,mascara=true) {
  const t=normalizarComando(texto);
  if(!t || texto.length>500)throw new Error('Escreva um comando de até 500 caracteres.');
  if(/^(ajuda|comandos|catalogo)$/.test(t))return {acao:'ajuda'};
  if(/^repetir(?: (?:o )?ultimo comando)?$/.test(t))return {acao:'repetir'};
  const gerar=/^(?:gerar|gere|criar|crie) (?:xml )?(nf-?e|ct-?e)(?: com (\d+) (?:produtos?|itens?))?$/.exec(t);
  if(gerar) {
    const tipo=gerar[1].startsWith('nf')?'nfe':'cte',quantidade=Number(gerar[2]||1);
    if((tipo==='cte'&&gerar[2])||!Number.isInteger(quantidade)||quantidade<1||quantidade>20)throw new Error('Use “gerar NF-e com 1 a 20 produtos” ou “gerar CT-e”.');
    return {acao:'gerar-xml',tipo,quantidade};
  }
  const fontes='(?: do)?(?: xml)?(?: (anexado|atual|resultado|nf-?e atual|ct-?e atual))?';
  const consultar=new RegExp('^(resumir|mostrar resumo|mostrar produtos|mostrar destinatario|validar|mostrar apenas erros)'+fontes+'$').exec(t);
  if(consultar)return {acao:{resumir:'resumo','mostrar resumo':'resumo','mostrar produtos':'produtos','mostrar destinatario':'destinatario',validar:'validar','mostrar apenas erros':'erros'}[consultar[1]],fonte:consultar[2]||''};
  const negativo=new RegExp('^(?:criar|crie|gerar|gere) copia com (cpf invalido|cnpj invalido|chave invalida|campo obrigatorio ausente|formato invalido|tag invalida|xml malformado)'+fontes+'$').exec(t);
  if(negativo)return {acao:'negativo',variante:{'cpf invalido':'cpf-invalido','cnpj invalido':'cnpj-invalido','chave invalida':'chave-invalida','campo obrigatorio ausente':'campo-ausente','formato invalido':'formato-invalido','tag invalida':'tag-invalida','xml malformado':'xml-malformado'}[negativo[1]],fonte:negativo[2]||''};
  const remover=new RegExp('^remover campo obrigatorio'+fontes+'$').exec(t);
  if(remover)return {acao:'negativo',variante:'campo-ausente',fonte:remover[1]||''};
  return {acao:'registros',...interpretarPedido(texto,mascara)};
}
