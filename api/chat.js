const {runtime}=require('../scripts/public-runtime.cjs');
module.exports=(req,res)=>runtime(req,res,'chat');
