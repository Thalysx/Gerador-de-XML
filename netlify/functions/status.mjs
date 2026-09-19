import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire(path.join(process.cwd(),'package.json'));
const {runtime}=require('./scripts/public-runtime.cjs');
const {createNetlifyHandler}=require('./scripts/netlify-adapter.cjs');
export default createNetlifyHandler(runtime,'status');
export const config={path:'/api/status'};
