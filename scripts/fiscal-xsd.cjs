const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {validateXML,memoryPages}=require('xmllint-wasm');

const root=path.resolve(__dirname,'..');
const schemaRoot=path.join(root,'schemas','fiscal');
const manifest=JSON.parse(fs.readFileSync(path.join(schemaRoot,'manifest.json'),'utf8'));
const MAX_XML_BYTES=4*1024*1024;
let verified=false;
const schemaCache=new Map();

function fail(status,message,code='requisicao-invalida') {
  return Object.assign(new Error(message),{status,code});
}

function safeSchemaPath(relative) {
  const resolved=path.resolve(schemaRoot,relative);
  if(!resolved.startsWith(schemaRoot+path.sep))throw fail(500,'Manifesto de schemas inválido.','schema-manifesto-invalido');
  return resolved;
}

function verifySchemas() {
  if(verified)return;
  for(const document of Object.values(manifest.documents)) {
    for(const file of document.files) {
      const contents=fs.readFileSync(safeSchemaPath(file.path));
      const actual=createHash('sha256').update(contents).digest('hex');
      if(actual!==file.sha256)throw fail(503,'A integridade dos schemas fiscais não pôde ser confirmada.','schema-integridade');
    }
  }
  verified=true;
}

function schemaInputs(definition,entry) {
  const cacheKey=`${definition.package}:${entry}`;
  if(schemaCache.has(cacheKey))return schemaCache.get(cacheKey);
  const entryName=path.basename(entry);
  const inputs=definition.files.map(file=>({fileName:path.basename(file.path),contents:fs.readFileSync(safeSchemaPath(file.path),'utf8')}));
  const value={main:inputs.find(file=>file.fileName===entryName),preload:inputs.filter(file=>file.fileName!==entryName)};
  schemaCache.set(cacheKey,value);
  return value;
}

function identifyDocument(xml) {
  const withoutProlog=xml
    .replace(/^\uFEFF/,'')
    .replace(/^\s*<\?xml[\s\S]*?\?>/i,'')
    .replace(/^(?:\s*<!--[\s\S]*?-->)+/,'');
  const rootMatch=/^\s*<(?:[A-Za-z_][\w.-]*:)?(NFe|nfeProc|CTe|cteProc)\b([^>]*)>/i.exec(withoutProlog);
  if(!rootMatch)throw fail(422,'A validação XSD atende somente NF-e e CT-e.','documento-nao-suportado');
  const canonical={nfe:'NFe',nfeproc:'nfeProc',cte:'CTe',cteproc:'cteProc'}[rootMatch[1].toLowerCase()];
  const kind=canonical.toLowerCase().startsWith('nfe')?'nfe':'cte';
  const infoTag=kind==='nfe'?'infNFe':'infCte';
  const rootVersion=/\bversao\s*=\s*(["'])([^"']+)\1/i.exec(rootMatch[2])?.[2];
  const infoVersion=new RegExp(`<(?:[A-Za-z_][\\w.-]*:)?${infoTag}\\b[^>]*\\bversao\\s*=\\s*(["'])([^"']+)\\1`,'i').exec(xml)?.[2];
  return {kind,root:canonical,version:rootVersion||infoVersion||''};
}

function sanitizeMessage(message) {
  return String(message||'Falha de conformidade com o schema.')
    .replace(/The value '[^']*'/gi,'O valor informado')
    .replace(/value '[^']*'/gi,'valor informado')
    .replace(/documento\.xml:\d+:\s*/gi,'')
    .replace(/Schemas validity error\s*:\s*/gi,'')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,600);
}

async function validateFiscalXml(xml) {
  if(typeof xml!=='string'||!xml.trim())throw fail(400,'Informe um XML textual.','xml-ausente');
  if(Buffer.byteLength(xml,'utf8')>MAX_XML_BYTES)throw fail(413,'O limite da validação XSD é de 4 MiB por XML.','xml-limite');
  const markup=xml.replace(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>/g,'');
  if(/<!DOCTYPE\b|<!ENTITY\b/i.test(markup))throw fail(422,'DTD e entidades declaradas não são aceitas.','xml-dtd-entidade');
  const identified=identifyDocument(xml);
  const key=`${identified.kind}:${identified.version}`;
  const definition=manifest.documents[key];
  if(!definition||!definition.entries[identified.root]) {
    return {documento:identified.kind,raiz:identified.root,versao:identified.version,cobertura:{xsd:'nao-suportado'},achados:[]};
  }
  verifySchemas();
  const entry=definition.entries[identified.root];
  const {main,preload}=schemaInputs(definition,entry);
  if(!main)throw fail(503,'O schema de entrada não está disponível.','schema-ausente');
  const result=await validateXML({
    xml:{fileName:'documento.xml',contents:xml},
    schema:main,
    preload,
    initialMemoryPages:256,
    maxMemoryPages:64*memoryPages.MiB
  });
  const achados=result.errors.slice(0,100).map((error,index)=>({
    codigo:`xsd-${String(index+1).padStart(3,'0')}`,
    severidade:'erro',
    nivel:'erro',
    etapa:'Schema XSD',
    origem:'xsd',
    mensagem:sanitizeMessage(error.message),
    problema:sanitizeMessage(error.message),
    ...(error.loc?.lineNumber?{linha:error.loc.lineNumber}: {})
  }));
  return {
    documento:identified.kind,
    raiz:identified.root,
    versao:identified.version,
    pacote:definition.package,
    cobertura:{xsd:result.valid?'aprovado':'reprovado'},
    achados
  };
}

module.exports={MAX_XML_BYTES,identifyDocument,manifest,validateFiscalXml,verifySchemas};
