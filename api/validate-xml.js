const {fiscalValidationRuntime}=require('../scripts/fiscal-validation-api.cjs');
module.exports=(req,res)=>fiscalValidationRuntime(req,res);
