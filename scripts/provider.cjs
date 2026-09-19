// Provider-specific protocols stay outside the generator/tool loop.
const PROVIDERS = {
  openai: { key: 'OPENAI_API_KEY', model: 'OPENAI_MODEL', fallback: 'gpt-5-mini', url: 'https://api.openai.com/v1/responses' },
  groq: { key: 'GROQ_API_KEY', model: 'GROQ_MODEL', fallback: 'llama-3.3-70b-versatile', url: 'https://api.groq.com/openai/v1/chat/completions' }
};

function chatMessages(input, instructions) {
  const messages = [{ role:'system', content:instructions }];
  for (const item of input) {
    if (item.type === 'reasoning') continue;
    if (item.type === 'function_call') {
      // Adjacent calls must belong to the same assistant turn.
      let previous = messages.at(-1);
      if (previous.role !== 'assistant' || !previous.tool_calls) {
        previous = { role:'assistant', content:null, tool_calls:[] };
        messages.push(previous);
      }
      previous.tool_calls.push({ id:item.call_id, type:'function', function:{name:item.name,arguments:item.arguments} });
    } else if (item.type === 'function_call_output') {
      messages.push({ role:'tool', tool_call_id:item.call_id, content:item.output });
    } else if (item.role === 'user') {
      messages.push({role:'user',content:item.content});
    } else if (item.type === 'message') {
      const content = (item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n');
      if (content) messages.push({role:'assistant',content});
    }
  }
  return messages;
}

function createProvider({ provider = process.env.AI_PROVIDER || 'openai', apiKey, model, fetchImpl = fetch } = {}) {
  const config = PROVIDERS[provider];
  if (!config) throw new Error('AI_PROVIDER deve ser openai ou groq.');
  const key = apiKey === undefined ? process.env[config.key] : apiKey;
  const modelName = model || process.env[config.model] || config.fallback;
  return {
    name:provider,
    configured:Boolean(key),
    missingKey:config.key,
    async respond({input,instructions,tools,signal}) {
      if (!key) throw Object.assign(new Error(`Configure ${config.key} no servidor para ativar a IA. O modo local continua disponível.`),{status:503});
      const body = provider === 'openai'
        ? { model:modelName,instructions,tools,input,store:false,include:['reasoning.encrypted_content'],max_output_tokens:5000,parallel_tool_calls:false }
        : { model:modelName,messages:chatMessages(input,instructions),tools:tools.map(tool=>({type:'function',function:{name:tool.name,description:tool.description,parameters:tool.parameters}})),tool_choice:'auto',parallel_tool_calls:false,max_completion_tokens:3000,stream:false };
      let response;
      try {
        response = await fetchImpl(config.url,{method:'POST',signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(body)});
      } catch(e) {
        if (signal?.aborted) throw e;
        throw new Error('Não foi possível conectar ao provedor de IA. Tente novamente.');
      }
      if (!response.ok) throw Object.assign(new Error(response.status === 429
        ? 'O provedor atingiu um limite de uso. Tente novamente mais tarde.'
        : 'Não foi possível obter resposta da IA. Verifique a chave, o modelo e a conexão do servidor.'), {status:response.status===429 ? 429 : 502});
      const result = await response.json();
      if (provider === 'openai') return result;
      const choice = result.choices?.[0];
      if (!choice?.message) throw new Error('Resposta inválida do provedor.');
      const output=[];
      if (typeof choice.message.content === 'string' && choice.message.content) output.push({type:'message',role:'assistant',content:[{type:'output_text',text:choice.message.content}]});
      for (const call of choice.message.tool_calls || []) {
        if (call.type !== 'function' || typeof call.id !== 'string' || typeof call.function?.name !== 'string' || typeof call.function?.arguments !== 'string') throw new Error('Resposta de ferramenta inválida.');
        output.push({type:'function_call',call_id:call.id,name:call.function.name,arguments:call.function.arguments});
      }
      return {status:choice.finish_reason === 'length' ? 'incomplete' : 'completed',output};
    }
  };
}
module.exports = {createProvider,chatMessages};
