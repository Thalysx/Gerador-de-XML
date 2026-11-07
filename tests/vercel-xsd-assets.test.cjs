const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

test('pacote XSD da Vercel inclui o runtime dinâmico e valida fora do node_modules original', async t => {
  const root = path.resolve(__dirname, '..');
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const include = config.functions['api/*.js'].includeFiles;
  // Expand the simple brace/glob form used by this project's includeFiles.
  const patterns = (Array.isArray(include) ? include : [include]).flatMap(pattern => {
    const braces = /^\{([^{}]+)\}$/.exec(pattern);
    return braces ? braces[1].split(',') : [pattern];
  }).map(pattern => new RegExp('^' + pattern.split('**').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*')).join('.*') + '$'));
  const original = path.dirname(require.resolve('xmllint-wasm'));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'future-g-xsd-package-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  // Entry and Worker are statically traceable; the binary is loaded dynamically.
  const selected = new Set(['index-node.js', 'xmllint-node.js']);
  for (const name of fs.readdirSync(original)) {
    const relative = 'node_modules/xmllint-wasm/' + name;
    if (patterns.some(pattern => pattern.test(relative)) && fs.statSync(path.join(original, name)).isFile()) selected.add(name);
  }
  for (const name of selected) fs.copyFileSync(path.join(original, name), path.join(temp, name));
  const { validateXML } = require(path.join(temp, 'index-node.js'));
  const schema = { fileName: 'teste.xsd', contents: '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="teste" type="xs:string"/></xs:schema>' };
  const options = { schema, initialMemoryPages: 256, maxMemoryPages: 1024 };
  const positive = await validateXML({ ...options, xml: { fileName: 'documento.xml', contents: '<teste>sintético</teste>' } });
  assert.equal(positive.valid, true);
  const negative = await validateXML({ ...options, xml: { fileName: 'documento.xml', contents: '<outro/>' } });
  assert.equal(negative.valid, false);
  assert.ok(negative.errors.length > 0);
});
