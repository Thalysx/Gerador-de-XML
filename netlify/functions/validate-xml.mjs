import {createRequire} from 'node:module';
import path from 'node:path';
import 'xmllint-wasm';
const require=createRequire(path.join(process.cwd(),'package.json'));
const {fiscalValidationRuntime}=require('./scripts/fiscal-validation-api.cjs');
const {createNetlifyHandler}=require('./scripts/netlify-adapter.cjs');
export default createNetlifyHandler(fiscalValidationRuntime,'validate-xml');
export const config={path:'/api/validate-xml'};
