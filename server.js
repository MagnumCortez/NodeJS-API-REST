var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var objectId = require('mongodb').ObjectId;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

console.log('Servidor HTTP escutando na porta ' + port);

app.get('/', function(req, res) {
	res.send({msg:'Hello word!'});
});


/*Criando Objeto de conexção do MongoDB*/
var db = new mongodb.Db(
	'instagram', //database
	new mongodb.Server('localhost', 27017,{}), //host 
	{}
);

// API REST
// (verbo HTTP + URI)

//===> POST
app.post('/api', function(req, res) {
	var data = req.body;

	/*Abrindo Conexão*/
	db.open(function(err, mongoClient) {

		/*Criando/Usando Collection "Tabela"*/
		mongoClient.collection('postagem', function(err, collection) {

			/*Inserindo os dados*/
			collection.insert(data, function(err, records) {
				if(err) {
					res.status(500).json({
						success: false,
						error: err
					});
				} else {
					res.status(200).json({
						success: true,
						result: records.ops
					});
				}

				/*Fechando conexão*/
				mongoClient.close();

			});
		});
	});
});

//===> GET - All, Retorna todos os dados
app.get('/api', function(req, res) {

	/*Abrindo Conexao*/
	db.open(function(err, mongoClient) {

		/*Usando Collection "Tabela"*/
		mongoClient.collection('postagem', function(err, collection) {

			/*Retornando os dados*/
			collection.find().toArray(function(err, results) {
				if(err) {
					res.status(500).json({
						success: false,
						error: err
					});
				} else {
					res.status(200).json(results);
				}

				/*Fechando conexão*/
				mongoClient.close();

			});
		});
	});
});

//===> GET - ID, Retorna um documento específico
app.get('/api/:ID', function(req, res) {
	/*Abrindo Conexao*/
	db.open(function(err, mongoClient) {

		/*Usando Colletion postagem*/
		mongoClient.collection('postagem', function(err, collection) {

			/*Retornando documento*/
			/*O ID é passado como string, porém para poder efetuar a consulta no mongoDB precisamos converter o ID para ObkectID*/
			/*req.params => Retorna os parâmetros da URI*/
			/*req.body => Retorna os parâmetros do body*/
			collection.find(objectId(req.params.ID)).toArray(function(err, result) {
				if(err) {
					res.status(500).json({
						success: false,
						error: err
					});
				} else {
					res.json(result);
				}

				/*Fechando conexão*/
				mongoClient.close();

			});
		});
	});
});

//===> PUT - ID, Atualiza um documento específico
app.put('/api/:ID', function(req, res) {

	/*Abrindo Conexao*/
	db.open(function(err, mongoClient) {

		/*Usando Colletion postagem*/
		mongoClient.collection('postagem', function(err, collection) {

			/*Atualizando documento*/
			/*O ID é passado como string, porém para poder efetuar a consulta no mongoDB precisamos converter o ID para ObkectID*/
			collection.update(
				{
					_id: objectId(req.params.ID)
				},{
					$set: {
						titulo: req.body.titulo,
						preco: req.body.preco, 
						autor: req.body.autor
					}
				},{
					//Flag opcional Multi - False = Atualizar somente o primeiro documento encontrado
				}, 
				function(err, record) {
					if(err) {
						res.status(500).json({
							success: false,
							error: err
						});
					} else {
						res.json({
							success: true,
							result: record
						});
					}

					/*Fechando conexão*/
					mongoClient.close();
				}
			);
		});
	});
});

//===> DELETE - ID, Remove um documento específico
app.delete('/api/:ID', function(req, res) {

	/*Abrindo Conexao*/
	db.open(function(err, mongoClient) {

		/*Usando Colletion postagem*/
		mongoClient.collection('postagem', function(err, collection) {

			/*Removendo documento*/
			/*O ID é passado como string, porém para poder efetuar a consulta no mongoDB precisamos converter o ID para ObkectID*/
			collection.remove({_id: objectId(req.params.ID)}, function(err, record) {
				if(err) {
					res.status(500).json({
						success: false,
						error: err
					});
				} else {
					res.json({
						success: true,
						result: record
					});
				}

				/*Fechando conexão*/
				mongoClient.close();
			});
		});
	});
});
