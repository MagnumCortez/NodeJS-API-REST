# NodeJS-API-REST

Learning Nodejs - API usando o padrão REST com banco de dados não relacional mongoDB


## Status Code

Em APIs podemos utilizar o status code para responder alguns resultados da API

#### POST 

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Duplicidade | 409 - conflict
Erro interno | 500 - internal server error

#### GET

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Não Localizado | 404 - not found
Erro interno | 500 - internal server error

#### PUT

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Sem Modificações | 304 - not modified
Erro interno | 500 - internal server error

#### DELETE

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Erro interno | 500 - internal server error



## Access Control Allow Origin

```
Access to XMLHttpRequest at 'http://localhost:8080/api' from origin 'http://localhost' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Quando um aplicação de um domínio "http://localhost:8080/api" se comunica com um aplicação de outro domínio "http://localhost" é necessario que a aplicação que responde seja feito uma configuração no header dessa resposta

```js
/*Responde para qualquer domínio - CORS Domain*/

res.setHeader("Access-Control-Allow-Origin", "*") // Habilita todos domínios de origem

res.setHeader("Access-Control-Allow-Origin", "http://localhost:80") // Habilita um domínio especifico
```


## Tipo Formulário <form>

Quando o form não possui arquivo o mesmo é do tipo:

`enctype = application/x-www-form-urlencode`

Por isso utilizamos o módulo "body-parser".

Quando o form possuir arquivo o mesmo passa a ser do tipo:

`enctype = multipart/form-data`

Nesse caso precisamos instalar o módulo "connect-multiparty"

```js
npm install connect-multparty" --save
```
