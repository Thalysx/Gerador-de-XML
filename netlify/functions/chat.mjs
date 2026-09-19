import {createRequire} from 'node:module';
import path from 'node:path';
// Included files preserve the engine's filesystem paths after bundling.
const require=createRequire(path.join(process.cwd(),'package.json'));
const {runtime}=require('./scripts/public-runtime.cjs');
const {createNetlifyHandler}=require('./scripts/netlify-adapter.cjs');
export default createNetlifyHandler(runtime,'chat');
export const config={path:'/api/chat'};
