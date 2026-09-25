const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const output=path.resolve(root,'.generated-public');
// Only this generated directory is cleaned; source files are never moved.
if(path.dirname(output)!==root||path.basename(output)!=='.generated-public')throw Error('Invalid build directory');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
fs.copyFileSync(path.join(root,'index.html'),path.join(output,'index.html'));
fs.copyFileSync(path.join(root,'site.webmanifest'),path.join(output,'site.webmanifest'));
const publicAssets={css:new Set(['.css']),js:new Set(['.js']),brand:new Set(['.svg','.png','.jpg','.jpeg'])};
for(const [type,extensions] of Object.entries(publicAssets)) {
  const source=path.join(root,'assets',type),destination=path.join(output,'assets',type);
  fs.mkdirSync(destination,{recursive:true});
  for(const entry of fs.readdirSync(source,{withFileTypes:true})) {
    if(entry.isFile()&&extensions.has(path.extname(entry.name).toLowerCase()))fs.copyFileSync(path.join(source,entry.name),path.join(destination,entry.name));
  }
}
console.log('Arquivos públicos preparados em .generated-public');
