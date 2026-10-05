// Canonical tool identities. Adapters call existing engines; no generation algorithm lives here.
const APP_ENVIRONMENTS = Object.freeze({
  general: Object.freeze({ label: 'Geradores Gerais', summary: 'Geradores Gerais', documentTypes: Object.freeze(['nfe','cte']), brandMark: 'assets/brand/future-g-mark-general.svg', themeColor: '#2d1b45' }),
  port: Object.freeze({ label: 'QA Portuário', summary: 'QA Portuário', documentTypes: Object.freeze(['nfe','cte']), brandMark: 'assets/brand/future-g-mark.svg', themeColor: '#071a33' })
});

const APP_NAVIGATION = Object.freeze([
  {id:'home',label:'Início',description:'Escolha uma ferramenta e gere dados de teste com rapidez.',group:'Visão geral',environments:['general','port'],icon:'layout-grid'},
  {id:'xml',label:'XML fiscal',description:'Prepare NF-e e CT-e de teste no mesmo espaço.',group:'Gerar',environments:['general','port'],icon:'file-code-2'},
  {id:'docs',label:'Dados cadastrais',description:'Gere documentos e identificadores, individualmente ou em lote.',group:'Gerar',environments:['general','port'],icon:'contact'},
  {id:'cadastro',label:'Cadastro geral',description:'Monte fichas completas e organize seus dados de teste.',group:'Gerar',environments:['general','port'],icon:'panels-top-left'},
  {id:'editor',label:'Editor XML',description:'Importe documentos, ajuste campos e revise as alterações.',group:'Trabalhar com XML',environments:['general','port'],icon:'square-pen'},
  {id:'validacao',label:'Validação XML',description:'Confira a sintaxe e a consistência básica dos documentos.',group:'Trabalhar com XML',environments:['general','port'],icon:'shield-check'},
  {id:'chat',label:'Comandos locais',description:'Gere dados, consulte XMLs e crie cópias de teste com comandos locais.',group:'Assistente',environments:['general','port'],icon:'message-circle-more'}
].map(item=>Object.freeze({...item,environments:Object.freeze(item.environments)})));

const GENERATOR_CATEGORIES = Object.freeze({pessoa:'Pessoa física',empresa:'Pessoa jurídica',contato:'Contato',endereco:'Endereço',veiculo:'Veículo',carga:'Carga',documento:'Documentos portuários',desenvolvimento:'Desenvolvimento',financeiro:'Finanças sintéticas',logistica:'Logística',xml:'XML'});
const GENERAL_ENVIRONMENT = Object.freeze(['general']);
const PORT_ENVIRONMENT = Object.freeze(['port']);
const SHARED_ENVIRONMENTS = Object.freeze(['general','port']);

const GENERATORS = Object.freeze([
  {id:'cpf',label:'CPF',description:'Documento de pessoa física',category:'pessoa',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarCPFComToggle(),name:true,mask:true,validate:true},
  {id:'nome',label:'Nome completo',description:'Nome de pessoa fictícia',category:'pessoa',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarDocumentoExtra('nome')},
  {id:'cnpj',label:'CNPJ',description:'Cadastro empresarial numérico',category:'empresa',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarCNPJComToggle(),name:true,mask:true,validate:true},
  {id:'empresa',label:'Razão social',description:'Nome de empresa fictícia',category:'empresa',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarDocumentoExtra('empresa')},
  {id:'telefone',label:'Telefone',description:'Fixo ou celular, com DDD por UF',category:'contato',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarTelefone(),mask:true,requiresConfiguration:true},
  {id:'placa',label:'Placa',description:'Padrões Mercosul e antigo',category:'veiculo',environments:GENERAL_ENVIRONMENT,priority:true,run:()=>gerarPlaca(document.getElementById('gerador-placa-tipo')?.value || 'mercosul'),validate:true},
  {id:'nfe',label:'NF-e',description:'Nota fiscal eletrônica de teste',category:'xml',environments:SHARED_ENVIRONMENTS,route:'xml',batch:false,priority:true},
  {id:'cadastro',label:'Cadastro completo',description:'Ficha sintética completa do ambiente atual',category:'pessoa',environments:SHARED_ENVIRONMENTS,route:'cadastro',priority:true},
  {id:'rg',label:'RG',description:'Registro de identidade no padrão de São Paulo',category:'pessoa',environments:GENERAL_ENVIRONMENT,run:()=>gerarDocumentoExtra('rg'),mask:true,validate:true},
  {id:'cnh',label:'CNH',description:'Número de registro nacional com dois dígitos verificadores',category:'pessoa',environments:GENERAL_ENVIRONMENT,run:()=>gerarCNH(),validate:true},
  {id:'cracha',label:'Crachá',description:'Identificação funcional sintética com avatar e validade',category:'pessoa',environments:GENERAL_ENVIRONMENT,keywords:['badge','funcionario','identificacao funcional'],run:()=>gerarCrachaIndividual()},
  {id:'cnpj-alfa',label:'CNPJ alfanumérico',description:'Cadastro empresarial alfanumérico',category:'empresa',environments:GENERAL_ENVIRONMENT,run:()=>gerarCNPJAlfanumericoComToggle(),name:true,mask:true,validate:true},
  {id:'nome-fantasia',label:'Nome fantasia',description:'Marca empresarial fictícia',category:'empresa',environments:GENERAL_ENVIRONMENT,run:()=>gerarDocumentoExtra('nome-fantasia')},
  {id:'email',label:'E-mail',description:'Endereço baseado em nome',category:'contato',environments:GENERAL_ENVIRONMENT,keywords:['email'],run:()=>gerarEmailDocs()},
  {id:'endereco',label:'Endereço completo',description:'Logradouro, bairro, cidade, UF e CEP sintéticos',category:'endereco',environments:GENERAL_ENVIRONMENT,keywords:['logradouro','bairro','cidade'],run:()=>gerarDocumentoExtra('endereco')},
  {id:'cep',label:'CEP',description:'Código postal sintético sem vínculo com endereço real',category:'endereco',environments:GENERAL_ENVIRONMENT,run:()=>gerarDocumentoExtra('cep'),mask:true},
  {id:'renavam',label:'RENAVAM',description:'Identificador veicular sintético com dígito verificador',category:'veiculo',environments:GENERAL_ENVIRONMENT,run:()=>gerarDocumentoExtra('renavam'),validate:true},
  {id:'uuid-v4',label:'UUID v4',description:'Identificador aleatório conforme RFC 9562',category:'desenvolvimento',environments:GENERAL_ENVIRONMENT,keywords:['guid'],run:()=>gerarDocumentoExtra('uuid-v4')},
  {id:'ipv4-documentacao',label:'IPv4 de documentação',description:'Endereço reservado em TEST-NET para exemplos',category:'desenvolvimento',environments:GENERAL_ENVIRONMENT,keywords:['ip','test-net','rede'],run:()=>gerarDocumentoExtra('ipv4-documentacao')},
  {id:'ipv6-documentacao',label:'IPv6 de documentação',description:'Endereço reservado no prefixo 2001:db8::/32',category:'desenvolvimento',environments:GENERAL_ENVIRONMENT,keywords:['ip','rede'],run:()=>gerarDocumentoExtra('ipv6-documentacao')},
  {id:'mac-local',label:'Endereço MAC local',description:'MAC unicast administrado localmente para testes',category:'desenvolvimento',environments:GENERAL_ENVIRONMENT,keywords:['mac address','rede'],run:()=>gerarDocumentoExtra('mac-local')},
  {id:'valor-brl',label:'Valor em BRL',description:'Valor monetário sintético para cenários de teste',category:'financeiro',environments:GENERAL_ENVIRONMENT,keywords:['dinheiro','moeda','real'],run:()=>gerarDocumentoExtra('valor-brl')},
  {id:'pix-evp',label:'Chave Pix EVP sintética',description:'UUID v4 não registrado no DICT',category:'financeiro',environments:GENERAL_ENVIRONMENT,keywords:['pix','chave aleatoria'],run:()=>gerarDocumentoExtra('pix-evp')},
  {id:'transacao-teste',label:'ID de transação de teste',description:'Referência fictícia sem vínculo financeiro',category:'financeiro',environments:GENERAL_ENVIRONMENT,keywords:['transacao','pagamento','referencia'],run:()=>gerarDocumentoExtra('transacao-teste')},
  {id:'placa-antiga',label:'Placa antiga',description:'Formato ABC-1234',category:'veiculo',environments:GENERAL_ENVIRONMENT,domainType:'placa',batch:false,discoverable:false,variantOf:'placa',run:()=>gerarPlaca('antiga'),validate:true},
  {id:'conteiner',label:'Contêiner',description:'Identificador ISO 6346',category:'logistica',environments:PORT_ENVIRONMENT,keywords:['container'],run:()=>gerarConteiner(),validate:true},
  {id:'conteiner-lacre',label:'Contêiner e lacre',description:'Identificador e lacre de armador',category:'logistica',environments:PORT_ENVIRONMENT,keywords:['container'],run:()=>gerarConteinerComLacre()},
  {id:'lacre',label:'Lacre',description:'Lacre de armador',category:'logistica',environments:PORT_ENVIRONMENT,run:()=>gerarLacreSomente()},
  {id:'imo',label:'IMO',description:'Identificador de embarcação',category:'logistica',environments:PORT_ENVIRONMENT,run:()=>gerarIMO(),validate:true},
  {id:'conteiner-detalhado',label:'Contêiner detalhado',description:'Ficha completa disponível no Cadastro geral',category:'logistica',environments:PORT_ENVIRONMENT,batch:false,discoverable:false,legacyEngine:true,keywords:['container','iso 6346','reefer','dry','open top','flat rack'],run:()=>gerarDocumentoComposto('conteiner-detalhado')},
  {id:'booking',label:'Booking',description:'Reserva logística fictícia',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoExtra('booking')},
  {id:'due',label:'DU-E',description:'Declaração de exportação de exemplo',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoExtra('due'),mask:true},
  {id:'motorista',label:'Motorista',description:'Nome e CPF de motorista portuário',category:'pessoa',environments:PORT_ENVIRONMENT,priority:true,run:()=>gerarDocumentoComposto('motorista')},
  {id:'operador-portuario',label:'Operador portuário',description:'Nome e CPF de operador portuário',category:'pessoa',environments:PORT_ENVIRONMENT,keywords:['operador','nr29','turno'],run:()=>gerarDocumentoComposto('operador-portuario')},
  {id:'visitante-portuario',label:'Visitante portuário',description:'Nome e CPF de visitante portuário',category:'pessoa',environments:PORT_ENVIRONMENT,keywords:['visitante','acesso'],run:()=>gerarDocumentoComposto('visitante-portuario')},
  {id:'pessoa-portuaria',label:'Pessoa portuária',description:'Nome e CPF para operações portuárias',category:'pessoa',environments:PORT_ENVIRONMENT,keywords:['pessoa','perfil'],run:()=>gerarDocumentoComposto('pessoa-portuaria')},
  {id:'transportadora',label:'Transportadora',description:'Razão social e CNPJ',category:'empresa',environments:PORT_ENVIRONMENT,priority:true,run:()=>gerarDocumentoComposto('transportadora')},
  {id:'cliente-portuario',label:'Cliente portuário',description:'Razão social e CNPJ',category:'empresa',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('cliente-portuario')},
  {id:'depositante',label:'Depositante',description:'Razão social e CNPJ',category:'empresa',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('depositante')},
  {id:'importador',label:'Importador',description:'Razão social e CNPJ',category:'empresa',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('importador')},
  {id:'exportador',label:'Exportador',description:'Razão social e CNPJ',category:'empresa',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('exportador')},
  {id:'cavalo-mecanico',label:'Cavalo mecânico',description:'Placa e RENAVAM',category:'veiculo',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('cavalo-mecanico')},
  {id:'carreta',label:'Carreta',description:'Placa e RENAVAM',category:'veiculo',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('carreta')},
  {id:'conjunto-veicular',label:'Conjunto veicular',description:'Placas do cavalo mecânico e da carreta',category:'veiculo',environments:PORT_ENVIRONMENT,priority:true,run:()=>gerarDocumentoComposto('conjunto-veicular')},
  {id:'carga-solta',label:'Carga solta',description:'Descrição, NCM e referência',category:'carga',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('carga-solta')},
  {id:'granel-solido',label:'Granel sólido',description:'Descrição, NCM e referência',category:'carga',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('granel-solido')},
  {id:'granel-liquido',label:'Granel líquido',description:'Descrição, NCM e referência',category:'carga',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('granel-liquido')},
  {id:'carga-conteinerizada',label:'Carga conteinerizada',description:'Descrição e contêiner ISO 6346',category:'carga',environments:PORT_ENVIRONMENT,priority:true,run:()=>gerarDocumentoComposto('carga-conteinerizada')},
  {id:'chave-cte',label:'Chave de CT-e',description:'Chave sintética de 44 dígitos com DV consistente',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoExtra('chave-cte')},
  {id:'di',label:'DI de teste',description:'Referência sintética de declaração de importação',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoExtra('di')},
  {id:'duimp',label:'DUIMP de teste',description:'Referência sintética de declaração única de importação',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoExtra('duimp')},
  {id:'documento-carga',label:'Documentos de carga',description:'Manifesto e booking',category:'documento',environments:PORT_ENVIRONMENT,run:()=>gerarDocumentoComposto('documento-carga')},
  {id:'cte',label:'CT-e',description:'Conhecimento de transporte',category:'xml',environments:SHARED_ENVIRONMENTS,route:'xml',batch:false,priority:true}
].map(item=>{
  const route=item.route||'docs';
  const batch=item.batch!==false;
  const keywords=Object.freeze([...(item.keywords||[]),item.label,item.description,GENERATOR_CATEGORIES[item.category]]);
  const capabilities=Object.freeze({batch,export:batch,validate:!!item.validate,validInvalid:false});
  return Object.freeze({route,tool:route,batch:true,domainType:item.id,...item,batch,keywords,capabilities});
}));

const TIPOS_DADOS = Object.freeze(Object.fromEntries(GENERATORS.filter(g=>g.batch||g.legacyEngine).map(g=>[g.id,g.id==='placa'?'Placa':g.id==='nome'?'Nome':g.id==='due'?'DU-E (exemplo)':g.label])));
function activeEnvironmentId() { return APP_ENVIRONMENTS[document.body?.dataset.environment] ? document.body.dataset.environment : 'general'; }
function generatorById(id) { return GENERATORS.find(g=>g.id===id); }
function generatorNeedsConfiguration(generator) { return !!(generator?.requiresConfiguration || generator?.batchOnly || !generator?.run); }
function navigationById(id) { return APP_NAVIGATION.find(item=>item.id===id); }
function generatorSupportsEnvironment(generator,environment=activeEnvironmentId()) { return !!generator?.environments?.includes(environment); }
function navigationSupportsEnvironment(item,environment=activeEnvironmentId()) { return !!item?.environments?.includes(environment); }
function generatorsForEnvironment(environment=activeEnvironmentId()) { return GENERATORS.filter(generator=>generatorSupportsEnvironment(generator,environment)); }
function navigationForEnvironment(environment=activeEnvironmentId()) { return APP_NAVIGATION.filter(item=>navigationSupportsEnvironment(item,environment)); }
function generatorCategoriesForEnvironment(environment=activeEnvironmentId(),route) {
  const categories=new Set(generatorsForEnvironment(environment).filter(generator=>!route||generator.route===route).map(generator=>generator.category));
  return Object.fromEntries(Object.entries(GENERATOR_CATEGORIES).filter(([id])=>categories.has(id)));
}
function batchTypesForEnvironment(environment=activeEnvironmentId()) {
  return Object.fromEntries(generatorsForEnvironment(environment).filter(generator=>generator.batch).map(generator=>[generator.id,TIPOS_DADOS[generator.id]]));
}
function normalizeGeneratorText(value) { return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
function matchesGenerator(g,term,category='todos') {return !!g&&(category==='todos'||category==='todas'||g.category===category) && normalizeGeneratorText(g.keywords.join(' ')).includes(normalizeGeneratorText(term));}
function generatorIcon(g) {
  const icons={pessoa:'user',empresa:'building-2',contato:'phone',endereco:'map-pin',veiculo:'truck',carga:'boxes',documento:'files',desenvolvimento:'code-2',financeiro:'badge-dollar-sign',logistica:'package',xml:'file-code-2'};
  return `<i data-lucide="${icons[g.category]}" aria-hidden="true"></i>`;
}
const PERSONALIZATION_VERSION='thegenerator:registry-version';
const FAVORITES_KEY='thegenerator:favorite-generators', RECENTS_KEY='thegenerator:recent-generators';
function readGeneratorIds(key) {
  const saved=storageGet(key,[]);
  return Array.isArray(saved)?[...new Set(saved.filter(id=>generatorById(id)))]:[];
}
function generatorIdsForEnvironment(ids,environment=activeEnvironmentId()) { return ids.filter(id=>{const generator=generatorById(id);return generator?.discoverable!==false&&generatorSupportsEnvironment(generator,environment);}); }
function migrateGeneratorPreferences() {
  if(storageGet(PERSONALIZATION_VERSION,0)>=1)return;
  for(const key of [FAVORITES_KEY,RECENTS_KEY]) {
    const old=storageGet(key,[]);
    storageSet(key,Array.isArray(old)?[...new Set(old.map(id=>id==='conteiner'?'conteiner-lacre':id).filter(id=>generatorById(id)))].slice(0,key===FAVORITES_KEY?8:5):[]);
  }
  storageSet(PERSONALIZATION_VERSION,1);
}
function registerGeneratorUse(id,activityOptions) {
  if(!generatorById(id))return;
  storageSet(RECENTS_KEY,[id,...readGeneratorIds(RECENTS_KEY).filter(value=>value!==id)].slice(0,5));
  if(typeof recordProductivityActivity==='function')recordProductivityActivity(id,activityOptions);
  document.dispatchEvent(new CustomEvent('generator-used',{detail:{id}}));
}
migrateGeneratorPreferences();
