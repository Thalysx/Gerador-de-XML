// Fonte compartilhada por todos os geradores. Rejeição evita viés do módulo.
function rand(n) {
  if (!Number.isSafeInteger(n) || n < 1 || n > 0x100000000) throw new RangeError('Intervalo aleatório inválido.');
  if (!globalThis.crypto?.getRandomValues) return Math.floor(Math.random() * n);
  const limite = Math.floor(0x100000000 / n) * n;
  const buffer = new Uint32Array(1);
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= limite);
  return buffer[0] % n;
}

function pick(lista) { return lista[rand(lista.length)]; }
function randomDigits(n) { return Array.from({ length: n }, () => rand(10)); }

const recentesGerados = new Map();
function semRepeticaoRecente(tipo, gerar) {
  if (!recentesGerados.has(tipo)) recentesGerados.set(tipo, new Set());
  const recentes = recentesGerados.get(tipo);
  for (let tentativa = 0; tentativa < 100; tentativa++) {
    const valor = gerar();
    if (recentes.has(valor)) continue;
    recentes.add(valor);
    if (recentes.size > 2000) recentes.delete(recentes.values().next().value);
    return valor;
  }
  throw new Error('Não foi possível gerar um valor diferente. Tente novamente.');
}
