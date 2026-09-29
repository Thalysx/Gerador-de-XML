// Identificadores e endereços próprios para fixtures, exemplos e testes.
function gerarOctetosAleatorios(quantidade) {
  const bytes = new Uint8Array(quantidade);
  if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(bytes);
  else for (let indice = 0; indice < quantidade; indice++) bytes[indice] = rand(256);
  return bytes;
}

function gerarUUIDv4() {
  return semRepeticaoRecente('uuid-v4', () => {
    const bytes = gerarOctetosAleatorios(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  });
}

function gerarIPv4Documentacao() {
  const blocos = [[192,0,2], [198,51,100], [203,0,113]];
  return semRepeticaoRecente('ipv4-documentacao', () => `${pick(blocos).join('.')}.${1 + rand(254)}`);
}

function gerarIPv6Documentacao() {
  return semRepeticaoRecente('ipv6-documentacao', () => {
    const grupos = Array.from({length: 6}, () => (1 + rand(0xffff)).toString(16));
    return `2001:db8:${grupos.join(':')}`;
  });
}

function gerarMacLocal() {
  return semRepeticaoRecente('mac-local', () => {
    const bytes = gerarOctetosAleatorios(6);
    bytes[0] = (bytes[0] | 0x02) & 0xfe;
    return [...bytes].map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).join(':');
  });
}
