// Fixtures financeiras sintéticas: não representam saldo, conta ou transação real.
function formatarCentavosBRL(centavos) {
  const inteiro = String(Math.floor(centavos / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${inteiro},${String(centavos % 100).padStart(2, '0')}`;
}

function gerarValorBRLSintetico() {
  return semRepeticaoRecente('valor-brl', () => formatarCentavosBRL(1 + rand(99999999)));
}

function gerarChavePixEVPSintetica() {
  return semRepeticaoRecente('pix-evp', () => gerarUUIDv4());
}

function gerarIdTransacaoTeste() {
  return semRepeticaoRecente('transacao-teste', () => {
    const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const aleatorio = [...gerarOctetosAleatorios(8)].map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `TX-TESTE-${data}-${aleatorio}`;
  });
}
