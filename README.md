# NodeJS-API-REST

Learning Nodejs - API usando o padrão REST com banco de dados não relacional mongoDB

## Status Code

Em APIs podemos utilizar o status code para responder alguns resultados da API

### POST 

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Duplicidade | 409 - conflict
Erro interno | 500 - internal server error

### GET

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Não Localizado | 404 - not found
Erro interno | 500 - internal server error

### PUT

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Sem Modificações | 304 - not modified
Erro interno | 500 - internal server error

### DELETE

Retorno|Status Code
-------|-----
Sucesso | 200 - OK
Parâmetros inválidos | 400 - bad resquet
Erro interno | 500 - internal server error

