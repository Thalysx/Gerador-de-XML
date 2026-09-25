// Canonical tool identities. Adapters call existing engines; no generation algorithm lives here.
const GENERATOR_CATEGORIES = Object.freeze({pessoa:'Pessoa',empresa:'Empresa',contato:'Contato',veiculo:'Veículo',logistica:'Logística',xml:'XML'});
const GENERATORS = Object.freeze([
  {id:'cpf',label:'CPF',description:'Documento de pessoa física',category:'pessoa',priority:true,run:()=>gerarCPFComToggle(),name:true,mask:true,validate:true},
  {id:'nome',label:'Nome completo',description:'Nome de pessoa fictícia',category:'pessoa',priority:true,run:()=>gerarDocumentoExtra('nome')},
  {id:'cnpj',label:'CNPJ',description:'Cadastro empresarial numérico',category:'empresa',priority:true,run:()=>gerarCNPJComToggle(),name:true,mask:true,validate:true},
  {id:'empresa',label:'Razão social',description:'Nome de empresa fictícia',category:'empresa',priority:true,run:()=>gerarDocumentoExtra('empresa')},
  {id:'telefone',label:'Telefone',description:'Fixo ou celular, com DDD por UF',category:'contato',priority:true,run:()=>gerarTelefone(),mask:true},
  {id:'placa',label:'Placa Mercosul',description:'Formato ABC1D23',category:'veiculo',priority:true,run:()=>gerarPlaca('mercosul'),validate:true},
  {id:'nfe',label:'NF-e',description:'Nota fiscal eletrônica de teste',category:'xml',tool:'xml',batch:false,priority:true},
  {id:'cadastro',label:'Cadastro completo',description:'Pessoa, empresa e logística',category:'pessoa',tool:'cadastro',priority:true},
  {id:'rg',label:'RG',description:'Registro geral para testes',category:'pessoa',run:()=>gerarDocumentoExtra('rg'),mask:true},
  {id:'cnh',label:'CNH',description:'Registro RENACH para testes',category:'pessoa',run:()=>gerarCNH()},
  {id:'cnpj-alfa',label:'CNPJ alfanumérico',description:'Cadastro empresarial alfanumérico',category:'empresa',run:()=>gerarCNPJAlfanumericoComToggle(),name:true,mask:true,validate:true},
  {id:'email',label:'E-mail',description:'Endereço baseado em nome',category:'contato',aliases:'email',run:()=>gerarEmailDocs()},
  {id:'placa-antiga',label:'Placa antiga',description:'Formato ABC-1234',category:'veiculo',domainType:'placa',batch:false,run:()=>gerarPlaca('antiga'),validate:true},
  {id:'conteiner',label:'Contêiner',description:'Identificador ISO 6346',category:'logistica',run:()=>gerarConteiner(),validate:true},
  {id:'conteiner-lacre',label:'Contêiner e lacre',description:'Identificador e lacre de armador',category:'logistica',run:()=>gerarConteinerComLacre()},
  {id:'lacre',label:'Lacre',description:'Lacre de armador',category:'logistica',run:()=>gerarLacreSomente()},
  {id:'imo',label:'IMO',description:'Identificador de embarcação',category:'logistica',run:()=>gerarIMO(),validate:true},
  {id:'booking',label:'Booking',description:'Reserva logística fictícia',category:'logistica',run:()=>gerarDocumentoExtra('booking')},
  {id:'due',label:'DU-E',description:'Declaração de exportação de exemplo',category:'logistica',run:()=>gerarDocumentoExtra('due'),mask:true},
  {id:'motorista',label:'Motorista',description:'Dados de motorista em lote',category:'pessoa',batchOnly:true},
  {id:'cte',label:'CT-e',description:'Conhecimento de transporte',category:'xml',tool:'xml',batch:false}
].map(item=>Object.freeze({tool:'docs',batch:true,domainType:item.id,...item})));
const TIPOS_DADOS = Object.freeze(Object.fromEntries(GENERATORS.filter(g=>g.batch).map(g=>[g.id,g.id==='placa'?'Placa':g.id==='nome'?'Nome':g.id==='due'?'DU-E (exemplo)':g.label])));
function generatorById(id) { return GENERATORS.find(g=>g.id===id); }
function normalizeGeneratorText(value) { return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
function matchesGenerator(g,term,category='todos') {return (category==='todos'||category==='todas'||g.category===category) && normalizeGeneratorText([g.label,g.description,g.aliases,GENERATOR_CATEGORIES[g.category]].join(' ')).includes(normalizeGeneratorText(term));}
function generatorIcon(g) {
  const paths={pessoa:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 8 0 0 1 16 0v2',empresa:'M4 21V3h12v18M8 7h4M8 11h4M8 15h4M16 9h4v12',contato:'M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4c0 5-18-1-18-14z',veiculo:'M3 17v-6l3-6h12l3 6v6H3m0-6h18M6 17v3m12-3v3M6 14h2m8 0h2',logistica:'m3 7 9-4 9 4v10l-9 4-9-4V7m0 0 9 4 9-4m-9 4v10',xml:'M5 3h10l4 4v14H5V3m4 8-2 3 2 3m6-6 2 3-2 3'};
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[g.category]}"/></svg>`;
}
const PERSONALIZATION_VERSION='thegenerator:registry-version';
const FAVORITES_KEY='thegenerator:favorite-generators', RECENTS_KEY='thegenerator:recent-generators';
function readGeneratorIds(key) {
  const saved=storageGet(key,[]);
  return Array.isArray(saved)?[...new Set(saved.filter(id=>generatorById(id)))]:[];
}
function migrateGeneratorPreferences() {
  if(storageGet(PERSONALIZATION_VERSION,0)>=1)return;
  for(const key of [FAVORITES_KEY,RECENTS_KEY]) {
    const old=storageGet(key,[]);
    storageSet(key,Array.isArray(old)?[...new Set(old.map(id=>id==='conteiner'?'conteiner-lacre':id).filter(id=>generatorById(id)))].slice(0,key===FAVORITES_KEY?8:5):[]);
  }
  storageSet(PERSONALIZATION_VERSION,1);
}
function registerGeneratorUse(id) {
  if(!generatorById(id))return;
  storageSet(RECENTS_KEY,[id,...readGeneratorIds(RECENTS_KEY).filter(value=>value!==id)].slice(0,5));
  document.dispatchEvent(new CustomEvent('generator-used',{detail:{id}}));
}
migrateGeneratorPreferences();
