// Contexto da ferramenta ativa, sem alterar o funcionamento dos geradores.
const descricoesLayout = {
  xml:['XML fiscal','Prepare NF-e e CT-e de teste e confira os documentos gerados.'],
  docs:['Dados cadastrais','Gere documentos e identificadores, individualmente ou em lote.'],
  cadastro:['Cadastro geral','Monte perfis completos e organize seus dados de teste.'],
  editor:['Editor XML','Importe documentos, ajuste campos e revise as alterações.'],
  chat:['Assistente de geração','Converse sobre dados, gere documentos e explore seus XMLs.'],
  validacao:['Validação XML','Confira a sintaxe e a consistência básica dos documentos.']
};
function atualizarCabecalhoLayout() {
  if (!window.document?.documentElement) return;
  const tab=document.querySelector('.tab-btn[aria-selected="true"]');
  const chave=tab?.getAttribute('aria-controls')?.replace('tab-','');
  const textos=descricoesLayout[chave];
  if (!textos) return;
  document.getElementById('app-title').textContent=textos[0];
  document.querySelector('.page-header-text p').textContent=textos[1];
}
document.querySelectorAll('.tab-btn').forEach(tab=>{
  const rotulo=tab.textContent.trim();
  tab.setAttribute('aria-label',rotulo); tab.title=rotulo;
  const icone=tab.querySelector('i');
  const texto=document.createElement('span'); texto.textContent=rotulo;
  tab.replaceChildren();
  if (icone) tab.append(icone);
  else { const novo=document.createElement('i'); novo.className='bi bi-shield-check'; novo.setAttribute('aria-hidden','true'); tab.append(novo); }
  tab.append(texto);
});
new MutationObserver(atualizarCabecalhoLayout).observe(document.querySelector('.tab-nav'),{subtree:true,attributes:true,attributeFilter:['aria-selected']});
atualizarCabecalhoLayout();
