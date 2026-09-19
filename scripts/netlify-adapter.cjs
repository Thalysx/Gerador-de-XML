const {Readable}=require('node:stream');

function createNetlifyHandler(runtime,route) {
  return async (request,context) => {
    const headers=Object.fromEntries(request.headers);
    headers.host=new URL(request.url).host;
    // Use platform metadata, never the caller's forwarded IP header.
    headers['x-forwarded-for']=context.ip || '';
    const req=request.body ? Readable.fromWeb(request.body) : Readable.from([]);
    req.method=request.method;
    req.headers=headers;
    const responseHeaders=new Headers();
    let body='';
    const res={statusCode:200,setHeader:(name,value)=>responseHeaders.set(name,value),end:value=>{body=value;}};
    await runtime(req,res,route);
    return new Response(body,{status:res.statusCode,headers:responseHeaders});
  };
}
module.exports={createNetlifyHandler};
