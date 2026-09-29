// Cenários operacionais coerentes do QA Portuário.
const TEST_SCENARIO_SCHEMA = 'future-g.test-scenario.v1';
const TEST_SCENARIO_LIBRARY = Object.freeze([
  {id:'gate-in',label:'Gate IN',description:'Agendamento, liberação e entrada no terminal',steps:[1,2,3,4,5]},
  {id:'gate-out',label:'Gate OUT',description:'Operação, pesagem de saída e liberação do veículo',steps:[8,9,10]},
  {id:'recebimento',label:'Recebimento',description:'Fluxo de recebimento de carga conteinerizada',steps:[1,2,3,4,5,6,7,8],operation:'Recebimento'},
  {id:'expedicao',label:'Expedição',description:'Fluxo de expedição até a saída do terminal',steps:[3,4,5,6,7,8,9,10],operation:'Expedição'},
  {id:'agendamento',label:'Agendamento',description:'Processo interno, janela e agendamento',steps:[1,2,3]},
  {id:'processo-entrada',label:'Processo interno de entrada',description:'Entrada operacional do processo ao recebimento',steps:[1,2,3,4,5,6,7,8],operation:'Entrada'},
  {id:'processo-saida',label:'Processo interno de saída',description:'Separação, pesagem e Gate OUT',steps:[8,9,10],operation:'Saída'},
  {id:'conteiner',label:'Operação com contêiner',description:'Ciclo portuário de carga conteinerizada',steps:[3,5,6,7,8,9,10],operation:'Movimentação de contêiner'},
  {id:'carga-solta',label:'Operação com carga solta',description:'Recebimento e pesagem sem contêiner',steps:[3,4,5,6,7,8,9,10],operation:'Movimentação de carga solta',loose:true},
  {id:'fluxo-completo',label:'Fluxo operacional completo',description:'Do processo interno ao Gate OUT',steps:[1,2,3,4,5,6,7,8,9,10],operation:'Fluxo completo'}
]);

const TEST_SCENARIO_STEPS = Object.freeze([
  'Processo interno','Disponibilidade de janela','Agendamento','Liberação do motorista','Gate IN',
  'Classificação','Pesagem de entrada','Operação','Pesagem de saída','Gate OUT'
]);

let cenarioTesteAtual = null;
let historicoCenariosTeste = [];

function identificadorCenario(prefixo) {
  return `${prefixo}-${Date.now().toString(36).toUpperCase()}-${randomDigits(6).join('')}`;
}

function dataHoraCenario(dias=1,hora=8) {
  const data=new Date();
  data.setDate(data.getDate()+dias);
  data.setHours(hora,0,0,0);
  return data.toISOString();
}

function criarEtapasCenario(definicao,referencias,operacao,pesos) {
  return definicao.steps.map(ordem=>({
    id:`${referencias.processo_id}-ET${String(ordem).padStart(2,'0')}`,
    ordem,
    etapa:TEST_SCENARIO_STEPS[ordem-1],
    status:'CONCLUÍDO',
    referencias:{...referencias},
    detalhes:ordem===2?{janela_inicio:dataHoraCenario(1,8),janela_fim:dataHoraCenario(1,10)}:
      ordem===3?{agendamento_id:referencias.agendamento_id,data_hora:dataHoraCenario(1,9)}:
      ordem===7?{peso_entrada_kg:pesos.entrada}:
      ordem===8?{operacao}:
      ordem===9?{peso_saida_kg:pesos.saida,peso_movimentado_kg:pesos.movimentado}:{}
  }));
}

function aplicarInconsistenciaCenario(cenario) {
  const regras={
    'conteiner':'conteiner-dv','carga-solta':'peso-invertido','agendamento':'data-passada',
    'gate-in':'placa-invalida','gate-out':'placa-invalida','processo-saida':'placa-invalida',
    'recebimento':'cpf-invalido','expedicao':'cpf-invalido','processo-entrada':'cpf-invalido','fluxo-completo':'cpf-invalido'
  };
  const regra=regras[cenario.template_id]||'cpf-invalido';
  if(regra==='conteiner-dv'&&cenario.entidades.conteiner) {
    const atual=cenario.entidades.conteiner.conteiner;
    const invalido=atual.slice(0,-1)+String((Number(atual.slice(-1))+1)%10);
    cenario.entidades.conteiner.conteiner=invalido;
    cenario.entidades.conteiner.digito_iso_consistente=false;
    cenario.entidades.carga.conteiner=invalido;
    cenario.inconsistencias.push({codigo:regra,campo:'entidades.conteiner.conteiner',descricao:'Dígito ISO 6346 alterado intencionalmente.'});
  } else if(regra==='peso-invertido') {
    cenario.entidades.carga.peso_bruto_kg=Math.max(1,cenario.entidades.carga.peso_liquido_kg-1);
    cenario.inconsistencias.push({codigo:regra,campo:'entidades.carga.peso_bruto_kg',descricao:'Peso bruto menor que o peso líquido.'});
  } else if(regra==='data-passada') {
    const data=new Date();data.setDate(data.getDate()-2);
    cenario.operacao.janela_inicio=data.toISOString();
    const etapa=cenario.etapas.find(item=>item.ordem===2);
    if(etapa)etapa.detalhes.janela_inicio=cenario.operacao.janela_inicio;
    cenario.inconsistencias.push({codigo:regra,campo:'operacao.janela_inicio',descricao:'Janela de agendamento definida no passado.'});
  } else if(regra==='placa-invalida') {
    cenario.entidades.veiculo.placa_cavalo='PLACA-INVÁLIDA';
    cenario.inconsistencias.push({codigo:regra,campo:'entidades.veiculo.placa_cavalo',descricao:'Placa fora dos formatos admitidos.'});
  } else {
    cenario.entidades.motorista.cpf='000.000.000-00';
    cenario.inconsistencias.push({codigo:'cpf-invalido',campo:'entidades.motorista.cpf',descricao:'CPF inválido inserido intencionalmente.'});
  }
  return cenario;
}

function gerarCenarioTeste(templateId='fluxo-completo',modo='valido') {
  const definicao=TEST_SCENARIO_LIBRARY.find(item=>item.id===templateId)||TEST_SCENARIO_LIBRARY.at(-1);
  const modoSolicitado=['valido','invalido','aleatorio'].includes(modo)?modo:'valido';
  const modoAplicado=modoSolicitado==='aleatorio'?(rand(2)===0?'valido':'invalido'):modoSolicitado;
  const id=identificadorCenario('SCN');
  const referencias={
    processo_id:identificadorCenario('PRC'),agendamento_id:identificadorCenario('AGD'),
    motorista_id:identificadorCenario('MOT'),transportadora_id:identificadorCenario('EMP'),
    veiculo_id:identificadorCenario('VEI'),conteiner_id:definicao.loose?null:identificadorCenario('CNT'),
    carga_id:identificadorCenario('CRG')
  };
  const motorista={id:referencias.motorista_id,...gerarPerfilPortuario('motorista')};
  const transportadora={id:referencias.transportadora_id,...gerarEmpresaPortuaria('transportadora')};
  const veiculo={id:referencias.veiculo_id,...gerarVeiculoPortuario('conjunto'),tara_conjunto_kg:12000+rand(7001)};
  const conteiner=definicao.loose?null:{id:referencias.conteiner_id,...gerarConteinerDetalhado()};
  const carga={id:referencias.carga_id,...gerarCargaPortuaria(definicao.loose?'carga-solta':'carga-conteinerizada')};
  let pesoMovimentado=carga.peso_bruto_kg;
  if(conteiner) {
    const capacidade=Math.max(1000,conteiner.peso_bruto_maximo_kg-conteiner.tara_kg-100);
    pesoMovimentado=1000+rand(Math.max(1,capacidade-999));
    carga.peso_bruto_kg=pesoMovimentado;
    carga.peso_liquido_kg=Math.max(1,pesoMovimentado-50-rand(Math.min(1000,pesoMovimentado-49)));
    carga.conteiner=conteiner.conteiner;carga.lacre=conteiner.lacre;
    conteiner.peso_liquido_kg=pesoMovimentado;
    conteiner.peso_bruto_kg=conteiner.tara_kg+pesoMovimentado;
  }
  const pesos={entrada:veiculo.tara_conjunto_kg+(conteiner?conteiner.peso_bruto_kg:pesoMovimentado),saida:veiculo.tara_conjunto_kg,movimentado:conteiner?conteiner.peso_bruto_kg:pesoMovimentado};
  const operacao={
    tipo:definicao.operation||definicao.label,
    janela_inicio:dataHoraCenario(1,8),janela_fim:dataHoraCenario(1,10),
    sentido:definicao.id.includes('saida')||definicao.id==='expedicao'||definicao.id==='gate-out'?'SAÍDA':'ENTRADA',
    recinto:`REC-${randomDigits(7).join('')}`,pesagens:pesos
  };
  const cenario={
    schema:TEST_SCENARIO_SCHEMA,id,template_id:definicao.id,nome:definicao.label,
    descricao:definicao.description,modo_solicitado:modoSolicitado,modo_aplicado:modoAplicado,
    gerado_em:new Date().toISOString(),dado_sintetico:true,referencias,
    entidades:{motorista,transportadora,veiculo,conteiner,carga},operacao,
    etapas:criarEtapasCenario(definicao,referencias,operacao.tipo,pesos),inconsistencias:[]
  };
  if(modoAplicado==='invalido')aplicarInconsistenciaCenario(cenario);
  return cenario;
}

function verificarConsistenciaReferencialCenario(cenario) {
  const erros=[];
  if(!cenario||cenario.schema!==TEST_SCENARIO_SCHEMA)return {valido:false,erros:['Modelo de cenário desconhecido.']};
  const pares=[['motorista_id','motorista'],['transportadora_id','transportadora'],['veiculo_id','veiculo'],['conteiner_id','conteiner'],['carga_id','carga']];
  for(const [referencia,entidade] of pares) {
    const esperado=cenario.referencias?.[referencia];
    const recebido=cenario.entidades?.[entidade]?.id||null;
    if(esperado!==recebido)erros.push(`Referência ${referencia} não corresponde à entidade ${entidade}.`);
  }
  for(const etapa of cenario.etapas||[])for(const referencia of Object.keys(cenario.referencias||{})) {
    if(etapa.referencias?.[referencia]!==cenario.referencias[referencia])erros.push(`Etapa ${etapa.ordem} alterou ${referencia}.`);
  }
  const conteiner=cenario.entidades?.conteiner,carga=cenario.entidades?.carga;
  if(conteiner&&(carga?.conteiner!==conteiner.conteiner||carga?.lacre!==conteiner.lacre))erros.push('Carga não referencia o contêiner e o lacre do cenário.');
  return {valido:erros.length===0,erros};
}

function renderCenarioTeste(cenario) {
  const vazio=document.getElementById('scenario-empty'),resultado=document.getElementById('scenario-result');
  if(!vazio||!resultado)return;
  vazio.hidden=!!cenario;resultado.hidden=!cenario;
  document.getElementById('scenario-copy').disabled=!cenario;
  document.getElementById('scenario-download').disabled=!cenario;
  if(!cenario)return;
  const consistencia=verificarConsistenciaReferencialCenario(cenario);
  const entidades=Object.entries(cenario.entidades).filter(([,valor])=>valor).map(([tipo,valor])=>`<li><strong>${escapeHtml(tipo)}</strong><span>${escapeHtml(valor.id)}</span></li>`).join('');
  const etapas=cenario.etapas.map(item=>`<li><span class="scenario-step-order">${item.ordem}</span><div><strong>${escapeHtml(item.etapa)}</strong><small>${escapeHtml(item.status)} · ${escapeHtml(item.id)}</small></div></li>`).join('');
  const inconsistencias=cenario.inconsistencias.length?`<div class="scenario-warning" role="note"><strong>Dado intencionalmente inválido</strong><ul>${cenario.inconsistencias.map(item=>`<li>${escapeHtml(item.descricao)} <code>${escapeHtml(item.campo)}</code></li>`).join('')}</ul></div>`:'';
  resultado.innerHTML=`<div class="scenario-result-header"><div><span class="scenario-mode ${cenario.modo_aplicado}">${escapeHtml(cenario.modo_aplicado)}</span><h3>${escapeHtml(cenario.nome)}</h3><p>${escapeHtml(cenario.id)}</p></div><span class="scenario-consistency ${consistencia.valido?'ok':'error'}">${consistencia.valido?'Referências consistentes':'Referências inconsistentes'}</span></div>${inconsistencias}<div class="scenario-grid"><section><h4>Entidades relacionadas</h4><ul class="scenario-entities">${entidades}</ul></section><section><h4>Fluxo operacional</h4><ol class="scenario-steps">${etapas}</ol></section></div><details><summary>JSON completo</summary><pre id="scenario-json" tabindex="0">${escapeHtml(JSON.stringify(cenario,null,2))}</pre></details>`;
  renderLucideIcons(resultado);
}

function renderHistoricoCenariosTeste() {
  const select=document.getElementById('scenario-history');if(!select)return;
  select.innerHTML='<option value="">Selecione uma massa gerada</option>'+historicoCenariosTeste.map((item,index)=>`<option value="${index}">${escapeHtml(item.nome)} · ${escapeHtml(item.modo_aplicado)} · ${escapeHtml(item.id)}</option>`).join('');
  document.getElementById('scenario-history-load').disabled=!historicoCenariosTeste.length;
  document.getElementById('scenario-history-clear').disabled=!historicoCenariosTeste.length;
}

function gerarCenarioTesteInterface() {
  const template=document.getElementById('scenario-template')?.value||'fluxo-completo';
  const modo=document.getElementById('scenario-mode')?.value||'valido';
  cenarioTesteAtual=gerarCenarioTeste(template,modo);
  historicoCenariosTeste.unshift(cenarioTesteAtual);historicoCenariosTeste=historicoCenariosTeste.slice(0,20);
  storageSet('gerador:cenarios_teste',historicoCenariosTeste);
  if(typeof recordProductivityActivity==='function')recordProductivityActivity('scenarios',{kind:'scenario',quantity:1});
  renderCenarioTeste(cenarioTesteAtual);renderHistoricoCenariosTeste();
  mostrarStatus(`Cenário ${cenarioTesteAtual.nome} gerado no modo ${cenarioTesteAtual.modo_aplicado}.`);
}

function carregarCenarioTesteHistorico() {
  const indice=Number(document.getElementById('scenario-history')?.value);
  if(!Number.isInteger(indice)||!historicoCenariosTeste[indice]){mostrarStatus('Selecione uma massa gerada.','error');return;}
  cenarioTesteAtual=historicoCenariosTeste[indice];renderCenarioTeste(cenarioTesteAtual);
  mostrarStatus('Massa de teste restaurada.');
}

function limparHistoricoCenariosTeste() {
  historicoCenariosTeste=[];cenarioTesteAtual=null;storageSet('gerador:cenarios_teste',[]);
  renderHistoricoCenariosTeste();renderCenarioTeste(null);mostrarStatus('Massas de cenário removidas.');
}

function copiarCenarioTeste() {
  return copiarTexto(cenarioTesteAtual?JSON.stringify(cenarioTesteAtual,null,2):'','Cenário copiado como JSON.');
}

function baixarCenarioTeste() {
  if(!cenarioTesteAtual){mostrarStatus('Gere um cenário antes de baixar.','error');return;}
  baixarTexto(`${cenarioTesteAtual.id.toLowerCase()}.json`,JSON.stringify(cenarioTesteAtual,null,2),'application/json;charset=utf-8');
}

function inicializarCenariosTeste() {
  const select=document.getElementById('scenario-template');if(!select)return;
  select.innerHTML=TEST_SCENARIO_LIBRARY.map(item=>`<option value="${item.id}">${escapeHtml(item.label)}</option>`).join('');
  select.value='fluxo-completo';
  const salvos=storageGet('gerador:cenarios_teste',[]);
  historicoCenariosTeste=Array.isArray(salvos)?salvos.filter(item=>item?.schema===TEST_SCENARIO_SCHEMA).slice(0,20):[];
  renderHistoricoCenariosTeste();renderCenarioTeste(null);
}
