// Vocabulários de composição fictícia; não são uma base de pessoas ou empresas reais.
const NOMES_ADICIONAIS = [
  'Abel','Abner','Adriel','Afonso','Álvaro','Amaro','Anderson','Anselmo','Ariel','Augusto',
  'Benício','Bento','Bernardo','Breno','Cauã','Cícero','Dante','Dênis','Douglas','Edson',
  'Elias','Eliel','Enzo','Estevão','Everton','Fabrício','Fernando José','Gael','Geraldo','Heitor',
  'Hélio','Isaac','Ítalo','Joaquim','Jonas','Josué','Leandro José','Levi','Lorenzo','Luan',
  'Luciano','Marcel','Mário','Mauro','Murilo José','Nathan','Noah','Otávio','Paulo César','Raul',
  'Ravi','Renê','Ruan','Saulo','Sérgio Luiz','Tales','Théo','Valentim','Vicente','Yuri',
  'Agatha','Alana','Alícia','Amélia','Amora','Antonella','Aurora','Bárbara','Betina','Catarina',
  'Cecília','Celina','Clarice','Cora','Cristiane','Dafne','Dalila','Diana','Dora','Elena',
  'Eloá','Emanuelle','Emília','Estela','Ester','Eva','Flora','Gabriela','Graça','Heloísa Maria',
  'Isadora','Jade','Joana Maria','Júlia','Laís','Lara','Lavínia','Lia','Lorena','Luana',
  'Luísa','Maitê','Manuela','Maya','Melissa','Milena','Mirela','Nicole','Olga','Pérola',
  'Pietra','Rita','Rosa','Sabrina Maria','Sofia','Solange','Stella','Teresa','Vitória','Zélia'
];
const SOBRENOMES_ADICIONAIS = [
  'Abrantes','Aguiar','Albuquerque','Alencar','Amaral','Amorim','Andrada','Assis','Ávila','Bandeira',
  'Barreto','Bastos','Beltrão','Bittencourt','Brandão','Bueno','Cabral','Camargo','Câmara','Caminha',
  'Carneiro','Carrasco','Chaves','Coelho','Conceição','Dantas','Diniz','Domingues','Drummond','Escobar',
  'Espíndola','Fagundes','Feliciano','Ferrari','Figueiró','Fontes','França','Freire','Frota','Furtado',
  'Gama','Garcia','Godoy','Gouveia','Gusmão','Holanda','Junqueira','Leite','Linhares','Lira',
  'Lopes Neto','Lucena','Macedo','Machado Neto','Magalhães','Maia','Maldonado','Marinho','Medeiros','Mendonça',
  'Mesquita','Miranda Neto','Montenegro','Mota','Muniz','Nóbrega','Noronha','Novaes','Pacheco','Padilha',
  'Peixoto','Pena','Pimentel','Pinheiro','Prado','Quintana','Rangel','Reis','Ribas','Rios',
  'Salazar','Salgado','Sampaio','Siqueira','Souto','Tavares','Toledo','Trindade','Valença','Vilela'
];
const MARCAS_EMPRESA = [
  'Aurora','Horizonte','Veredas','Ipê','Cedro','Jatobá','Araucária','Mandacaru','Vitória','Alvorada',
  'Nascente','Oceano','Atlântico','Pacífico','Pioneira','Vértice','Prisma','Órbita','Nexo','Origem',
  'Fronteira','Rota','Caminhos','Conexão','Integra','Elo','Essência','Cristal','Safira','Âmbar',
  'Esmeralda','Rubi','Ametista','Planalto','Chapada','Cerrado','Pampa','Caatinga','Sertão','Pantanal',
  'Serra Azul','Vale Verde','Porto Novo','Campo Belo','Rio Claro','Monte Alto','Costa Dourada','Terra Nova',
  'Sol Nascente','Boa Vista','Nova Era','Estrela do Sul','Ponto Norte','Mundo Novo','Via Sul','Vila Rica'
];
const SETORES_EMPRESA = [
  'Transportes','Logística','Distribuição','Comércio','Serviços','Indústria','Engenharia','Construções',
  'Alimentos','Agropecuária','Granéis','Exportação','Importação','Armazéns','Cargas','Soluções',
  'Consultoria','Refrigeração','Terminais','Navegação','Tecnologia','Sistemas','Energia','Embalagens',
  'Equipamentos','Têxtil','Móveis','Ferramentas','Materiais','Química','Mineração','Fertilizantes',
  'Sementes','Grãos','Café','Papel e Celulose','Automação','Manutenção','Telecomunicações','Reciclagem',
  'Metalurgia','Usinagem','Plásticos','Varejo','Atacado','Turismo','Educação','Comunicação'
];
const REGIOES_EMPRESA = ['Brasil','Sul','Norte','Nordeste','Sudeste','Centro-Oeste','Paulista','Mineira','Gaúcha','Catarinense','Baiana','Goiana','Capixaba','Paranaense','Fluminense','Amazônica','Sertaneja','Central'];
const DDD_POR_UF = {
  AC:[68], AL:[82], AP:[96], AM:[92,97], BA:[71,73,74,75,77], CE:[85,88], DF:[61], ES:[27,28],
  GO:[62,64], MA:[98,99], MT:[65,66], MS:[67], MG:[31,32,33,34,35,37,38], PA:[91,93,94],
  PB:[83], PR:[41,42,43,44,45,46], PE:[81,87], PI:[86,89], RJ:[21,22,24], RN:[84],
  RS:[51,53,54,55], RO:[69], RR:[95], SC:[47,48,49], SP:[11,12,13,14,15,16,17,18,19], SE:[79], TO:[63]
};
