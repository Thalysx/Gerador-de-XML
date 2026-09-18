window.onload = () => {
  initializeTabs();
  initializeBootstrapUi();

  const temaSalvo = storageGet('gerador:tema', 'light');
  if (temaSalvo === 'dark') toggleTheme();

  processarXML(acao.inicio);
  restaurarEstadoXml();
  setupXmlAutoGenerate();

  historicoList = storageGet('gerador:historico', []);
  historicoDocsList = storageGet('gerador:historico_docs', []);
  renderHistorico();
  renderHistoricoDocs();

  editorInicializar();
  inicializarGeracao();
  inicializarWorkflowXml();
  inicializarValidacaoXml();
};
