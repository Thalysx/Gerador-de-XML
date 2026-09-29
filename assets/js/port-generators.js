// Geradores compostos do QA Portuário. Mantêm regras de domínio fora da apresentação.
const PORT_PROFILE_TYPES = Object.freeze({
  motorista:{rotulo:'Motorista',funcao:'Motorista de carga',acesso:'Gate, pátio e balança'},
  operador:{rotulo:'Operador portuário',funcao:'Operador de terminal',acesso:'Pátio e área operacional'},
  visitante:{rotulo:'Visitante portuário',funcao:'Visitante',acesso:'Área administrativa'},
  pessoa:{rotulo:'Pessoa portuária',funcao:'Profissional portuário',acesso:'Conforme autorização'}
});

const PORT_COMPANY_TYPES = Object.freeze({
  transportadora:{rotulo:'Transportadora',atividade:'Transporte rodoviário de cargas'},
  cliente:{rotulo:'Cliente portuário',atividade:'Contratante de serviços portuários'},
  depositante:{rotulo:'Depositante',atividade:'Depósito de mercadoria sob controle'},
  importador:{rotulo:'Importador',atividade:'Comércio exterior — importação'},
  exportador:{rotulo:'Exportador',atividade:'Comércio exterior — exportação'}
});

const PORT_CONTAINER_TYPES = Object.freeze([
  {tamanho:"20'",categoria:'Dry',iso:'22G1',tara:2250,maximo:30480},
  {tamanho:"40'",categoria:'Dry',iso:'42G1',tara:3750,maximo:30480},
  {tamanho:'40HC',categoria:'Dry High Cube',iso:'45G1',tara:3900,maximo:30480},
  {tamanho:"20'",categoria:'Reefer',iso:'22R1',tara:3000,maximo:30480},
  {tamanho:'40HC',categoria:'Reefer',iso:'45R1',tara:4650,maximo:34000},
  {tamanho:"20'",categoria:'Open Top',iso:'22U1',tara:2400,maximo:30480},
  {tamanho:"40'",categoria:'Flat Rack',iso:'42P3',tara:5000,maximo:45000}
]);

const PORT_CARGO_TYPES = Object.freeze({
  'carga-solta':{rotulo:'Carga solta',unidade:'volumes',embalagens:['Caixa','Saco','Fardo','Pallet']},
  'granel-solido':{rotulo:'Granel sólido',unidade:'t',embalagens:['Sem embalagem']},
  'granel-liquido':{rotulo:'Granel líquido',unidade:'m³',embalagens:['Tanque']},
  'carga-conteinerizada':{rotulo:'Carga conteinerizada',unidade:'volumes',embalagens:['Caixa','Pallet','Big bag']}
});

const PORT_NCMS_PADRAO = Object.freeze(['09011110','10059010','12019000','17019900','26011100','27101921','39011010','44071100','72083990','84713012']);

function dataPortuariaFutura(diasMinimos=30,diasAdicionais=330) {
  const data=new Date();data.setDate(data.getDate()+diasMinimos+rand(diasAdicionais));
  return data.toISOString().slice(0,10);
}

function gerarPerfilPortuario(tipo='pessoa') {
  const config=PORT_PROFILE_TYPES[tipo]||PORT_PROFILE_TYPES.pessoa;
  const nome=gerarNomePessoa();
  const telefone=gerarTelefoneBR();
  const cracha=gerarDadosCracha({modelo:'funcionario',codigoBarras:true});
  const perfil={
    perfil:config.rotulo,nome,cpf:formatCPF(gerarCPFRaw()),rg:gerarRGBR(),
    telefone:telefone.formatted,email:gerarEmailPessoa(nome),cracha:cracha.codigo,
    funcao:config.funcao,acesso:config.acesso,endereco:gerarEnderecoBR(),status:'ATIVO'
  };
  if(tipo==='motorista')Object.assign(perfil,{cnh:gerarCNHRaw(),categoria_cnh:pick(['C','D','E']),validade_cnh:dataPortuariaFutura(180,1460),empresa:gerarNomeEmpresa(),placa:gerarPlacaMercosulRaw()});
  if(tipo==='operador')Object.assign(perfil,{turno:pick(['1º turno','2º turno','3º turno']),treinamento_nr29:dataPortuariaFutura(90,640),matricula:`OP-${randomDigits(8).join('')}`});
  if(tipo==='visitante')Object.assign(perfil,{empresa_origem:gerarNomeEmpresa(),motivo:pick(['Auditoria','Reunião','Inspeção','Manutenção']),validade_acesso:dataPortuariaFutura(1,14)});
  return perfil;
}

function gerarEmpresaPortuaria(tipo='cliente') {
  const config=PORT_COMPANY_TYPES[tipo]||PORT_COMPANY_TYPES.cliente;
  const razao=gerarNomeEmpresa(),fantasia=gerarNomeFantasia(),telefone=gerarTelefoneBR();
  return {
    entidade:config.rotulo,razao_social:razao,nome_fantasia:fantasia,
    cnpj:formatCNPJ(gerarCNPJRawNumerico()),ie:randomDigits(12).join(''),
    atividade:config.atividade,contato:gerarNomePessoa(),telefone:telefone.formatted,
    email:gerarEmailPessoa(fantasia),endereco:gerarEnderecoBR(),
    recinto_teste:`REC-${randomDigits(7).join('')}`,status:'ATIVA'
  };
}

function gerarVeiculoPortuario(tipo='conjunto') {
  const marcas=['Mercedes-Benz','Volvo','Scania','DAF','Iveco','Randon','Facchini','Librelato'];
  const cores=['Branco','Prata','Azul','Vermelho','Cinza'];
  const unidade=(classe)=>({
    classe,placa:gerarPlacaMercosulRaw(),renavam:gerarRenavamRaw(),marca:pick(marcas),
    ano:2015+rand(12),cor:pick(cores),eixos:classe==='Cavalo mecânico'?2+rand(2):2+rand(3)
  });
  if(tipo==='cavalo')return {...unidade('Cavalo mecânico'),capacidade_tracao_kg:45000+rand(30001)};
  if(tipo==='carreta')return {...unidade('Carreta'),carroceria:pick(['Baú','Graneleira','Porta-contêiner','Sider','Tanque']),capacidade_carga_kg:24000+rand(26001)};
  const cavalo=unidade('Cavalo mecânico'),carreta=unidade('Carreta');
  return {tipo:'Conjunto cavalo + carreta',placa_cavalo:cavalo.placa,renavam_cavalo:cavalo.renavam,marca_cavalo:cavalo.marca,placa_carreta:carreta.placa,renavam_carreta:carreta.renavam,carroceria:pick(['Graneleira','Porta-contêiner','Sider','Tanque']),eixos_total:cavalo.eixos+carreta.eixos,capacidade_carga_kg:30000+rand(25001)};
}

function gerarConteinerDetalhado() {
  const modelo=pick(PORT_CONTAINER_TYPES);
  const bruto=modelo.tara+1000+rand(Math.max(1,modelo.maximo-modelo.tara-1000));
  return {
    conteiner:gerarNumeroConteiner(),digito_iso_consistente:true,tamanho:modelo.tamanho,
    categoria:modelo.categoria,codigo_iso:modelo.iso,lacre:gerarLacreArmador(),
    tara_kg:modelo.tara,peso_liquido_kg:bruto-modelo.tara,peso_bruto_kg:bruto,
    peso_bruto_maximo_kg:modelo.maximo,estado:pick(['Vazio liberado','Cheio no pátio','Em inspeção','Programado para Gate'])
  };
}

function ncmPortuario() {
  return typeof ncmsManuais!=='undefined'&&ncmsManuais.length?pick(ncmsManuais):pick(PORT_NCMS_PADRAO);
}

function gerarCargaPortuaria(tipo='carga-solta') {
  const config=PORT_CARGO_TYPES[tipo]||PORT_CARGO_TYPES['carga-solta'];
  const descricoes=['Café em grãos','Açúcar bruto','Milho','Óleo vegetal','Bobinas de aço','Peças automotivas','Resina termoplástica','Celulose'];
  const liquido=1000+rand(49001),bruto=liquido+50+rand(2001);
  const carga={tipo_carga:config.rotulo,descricao:pick(descricoes),quantidade:1+rand(500),embalagem:pick(config.embalagens),unidade:config.unidade,peso_liquido_kg:liquido,peso_bruto_kg:bruto,ncm:ncmPortuario(),mercadoria_perigosa:rand(8)===0?'SIM':'NÃO'};
  if(tipo==='carga-conteinerizada')Object.assign(carga,{conteiner:gerarNumeroConteiner(),lacre:gerarLacreArmador()});
  return carga;
}

function calcularDvChavePortuaria(base43) {
  let peso=2,soma=0;
  for(let i=base43.length-1;i>=0;i--){soma+=Number(base43[i])*peso;peso=peso===9?2:peso+1;}
  const digito=11-(soma%11);return digito===10||digito===11?0:digito;
}

function gerarChaveCtePortuaria() {
  const hoje=new Date(),ano=String(hoje.getFullYear()).slice(-2),mes=String(hoje.getMonth()+1).padStart(2,'0');
  const base=`35${ano}${mes}${gerarCNPJRawNumerico()}57${String(1+rand(999)).padStart(3,'0')}${String(1+rand(999999999)).padStart(9,'0')}1${randomDigits(8).join('')}`;
  return base+calcularDvChavePortuaria(base);
}

function gerarDocumentoPortuario(tipo) {
  if(tipo==='chave-cte')return gerarChaveCtePortuaria();
  if(tipo==='di')return `DI-${String(new Date().getFullYear()).slice(-2)}/${randomDigits(7).join('')}-${rand(10)}`;
  if(tipo==='duimp')return `DUIMP-BR-${String(new Date().getFullYear())}-${randomDigits(10).join('')}`;
  if(tipo==='documento-carga')return {manifesto:`MDFE-TESTE-${randomDigits(12).join('')}`,ordem_carga:`OC-${randomDigits(10).join('')}`,ticket_balanca:`TB-${randomDigits(10).join('')}`,booking:gerarBooking(),emissao:new Date().toISOString().slice(0,10),status:'DOCUMENTO SINTÉTICO'};
  throw new Error('Documento portuário não reconhecido.');
}
