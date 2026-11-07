const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function motor() {
  const context = vm.createContext({
    crypto: webcrypto,
    TIPOS_DADOS: { 'ipv4-documentacao': 'IPv4 de documentação', 'uuid-v4': 'UUID v4' },
    registerGeneratorUse() {}
  });
  for (const name of ['aleatorio', 'development-generators', 'geracao-dados']) {
    const file = path.join(__dirname, '..', 'assets', 'js', `${name}.js`);
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  }
  return code => vm.runInContext(code, context);
}

function conferirIPv4(records, quantity) {
  assert.equal(records.length, quantity);
  assert.equal(new Set(records.map(record => record.valor)).size, quantity);
  for (const record of records) {
    assert.equal(record.tipo, 'ipv4-documentacao');
    assert.match(record.valor, /^(192\.0\.2|198\.51\.100|203\.0\.113)\.(?:[1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/);
  }
}

test('IPv4 completa seis lotes consecutivos de 500 sem esgotar nem repetir dentro do lote', () => {
  const run = motor();
  for (let batch = 0; batch < 6; batch++) {
    const records = run("gerarLoteDados([{tipo:'ipv4-documentacao',quantidade:500}])");
    conferirIPv4(records, 500);
  }
});

test('IPv4 mantém geração individual e lotes únicos mesmo com índice aleatório constante', () => {
  const run = motor();
  run('rand = () => 0');
  const recent = [];
  for (let index = 0; index < 1600; index++) {
    const value = run('gerarIPv4Documentacao()');
    assert.ok(!recent.includes(value), `repetição entre os últimos 500: ${value}`);
    recent.push(value);
    if (recent.length > 500) recent.shift();
  }
  conferirIPv4(run("gerarLoteDados([{tipo:'ipv4-documentacao',quantidade:500}])"), 500);
});

test('IPv4 preserva unicidade de pedidos mistos e fracionados após geração individual', () => {
  const run = motor();
  run('for (let i = 0; i < 499; i++) gerarIPv4Documentacao()');
  const records = run("gerarLoteDados([{tipo:'ipv4-documentacao',quantidade:250},{tipo:'uuid-v4',quantidade:2},{tipo:'ipv4-documentacao',quantidade:248}])");
  assert.equal(records.length, 500);
  conferirIPv4(records.filter(record => record.tipo === 'ipv4-documentacao'), 498);
  const uuids = records.filter(record => record.tipo === 'uuid-v4');
  assert.equal(uuids.length, 2);
  assert.notEqual(uuids[0].valor, uuids[1].valor);
  conferirIPv4(run("gerarLoteDados([{tipo:'ipv4-documentacao',quantidade:500}])"), 500);
});
