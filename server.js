var express = require('express');
var bodyParser = require('body-parser');
var multiParty = require('connect-multiparty');
var mongodb = require('mongodb');
var objectId = require('mongodb').ObjectId;
var fs = require('fs'); //FileSystem - Módulo nativo para manipular arquivo
var fse = require('fs-extra'); //Não é nativo, tem que instalar. Tivemos que utilizar porque o "fs.rename" não conseguiu mover o arquivo de outra unidade de disco

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(multiParty());

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

//==========> POST
app.post('/api', function(req, res) {

	/*Access-Control-Allow-Origin - Quando um aplicação de um domínio "http://localhost:8080/api" 
	se comunica com um aplicação de outro domínio "http://localhost" é necessario que a aplicação 
	que responde seja feito uma configuração no header dessa resposta*/

	/*Responde para qualquer domínio - CORS Domain*/
	//res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Origin", "http://localhost")

	var date = new Date();
	var time_stamp = date.getTime();

	var url_image = time_stamp + '_' + req.files.arquivo.originalFilename;
 
	/*res.files - Contém os dados do arquivo de upload*/
	var path_origem = req.files.arquivo.path;
	var path_destino = './uploads/' + url_image;

	fse.move(path_origem, path_destino, function(err) {
		if (err) {
			res.status(500).json({success: false, error: err});
			return;
		}

		var data = {
			titulo: req.body,
			url_image: url_image
		}
		
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
});


//==========> GET - All, Retorna todos os dados
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


//==========> GET - ID, Retorna um documento específico
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


//==========> PUT - ID, Atualiza um documento específico
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


//==========> DELETE - ID, Remove um documento específico
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
