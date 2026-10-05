export default () => new Response(JSON.stringify({error:'O assistente usa comandos locais.',mode:'local'}),{status:410,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export const config={path:'/api/status'};
