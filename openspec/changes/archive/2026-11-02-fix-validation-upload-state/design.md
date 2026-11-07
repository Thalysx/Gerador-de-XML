# Decisões

Reutilizar o contador `validacaoXmlVersao` como identidade da análise. Uma função de início incrementa a versão e devolve a entrada ao estado disponível; upload válido a ocupa novamente. Somente o upload ainda atual publica resultado e libera seus controles ao terminar. Checar versão logo após ler o arquivo impede iniciar XSD obsoleto.

Testar substituição por texto/gerador/negativo, seleção recusada e upload mais recente com leitores controlados, sem simular o parser de sucesso. Um finally antigo nunca deve desbloquear o upload novo. Não abortar silenciosamente pedidos XSD já iniciados nem modificar seu contrato.

Riscos: desbloqueio prematuro, resultado atrasado substituindo o atual ou status preso. Mitigar com verificações de estado antes/depois das conclusões em ordens diferentes e regressão de navegador.
