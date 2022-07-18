<h1 align="center">
    <img alt="CIC" title="CIC" src=".github/CIC.jpg" />
</h1>

# Api do desafio da CIC

Api desenvolvido como parte do processo seletivo em que é necessário realizar um backend.

## Sobre a api

Esta aplicação é uma api rest onde conecta com o banco de dados sqlite3 em ambiente de desenvolvimento para poder criar um usuário comum ou um vendedor.


Este usuário apresenta primeiro nome, telefone, cpf, email e se é vendedor e sua criação necessita obritatoriamente que tanto cpf, email e telefone sejão valores válidos para assim poder ser introduizdo no banco de dados.

Com o usuário criado, o vendedor pode adicionar catálogos de livros ou submeter um único livro, se este não existir no banco, com o título, publicação, autor, preço e estes livros podem ser filtrados de diversas formas e requisitados pelo cliente comum.

Ainda é apresentável testes que ajudam a verificar se há vulnerabilidades e bugs.

## Dependências

Para o funcionamento da aplicação é necessário primeiro baixar as dependências com:

```
npm install
ou
yarn
```

## Migrations

Neste projeto foi utlizado o [TypeORM](https://typeorm.io/#/using-ormconfig) e é necessário rodar as migrations de forma que as tabelas possam ser criados no banco de dados

```
npm run typeorm migration:run
ou
yarn typeorm migration:run
```

## Rodando a api

Instalado as dependências e rodado as migrations, você pode simplesmente rodar:

```
npm run dev
ou
yarn dev
```

Para rodar o servidor na porta 3333.

## Testes

Para rodar os testes, basta rodar:

```
npm run test
ou
yarn test
```

E o [Jest](https://jestjs.io/pt-BR/) vai criar um banco de dados de testes e realizar os todos os testes do controller da aplicação, deletando as informações do banco teste após a requisição.

## Swagger e requisições

Além dos testes práticos e pelo jest, também está documentado os métodos através do link do
<a href="https://app.swaggerhub.com/apis-docs/RenatoDTH/CIC/1.0.0#/" target="_blank">Swagger</a> onde poderá visualizar cada um das requisições da api. ( Caso o site não abra, o html dele está na pasta public e pode ser vista <a href="https://htmlpreview.github.io/?https://github.com/RenatoDTH/Desafio_CIC/blob/master/public/swaggerDocumentation.html" target="_blank">aqui</a> ).

Entre as requisições temos o

/users (POST)

onde é necessário enviar um body em json como no exemplo:

{
	"name": "Renato Castro",
	"phone": "11972487714",
	"email": "renato5@renato.com",
	"isSeller": "true",
	"cpf": "35736606062"
}

Se os campos forem válidos e telefone, email e cpf não existirem, o usuário será criado, sendo o isSeller true para vendedor e false para usuário comum:

{
	"success": true,
	"id": "472a5a8b-8905-4962-89db-92b1cebadd0b",
	"name": "Renato Castro",
	"phone": "11972487714",
	"cpf": "35736606062",
	"email": "renato5@renato.com",
	"isSeller": true,
	"updated_at": "2022-07-17T19:05:35.000Z",
	"created_at": "2022-07-17T19:05:35.000Z"
}

/books/csv (POST)

Esta rota é onde o vendedor cadastra um catálogo no banco. Se por acaso um usuário comum tentar ou arquivo ser diferente de csv ou o usuário não existir, ele não prosseguirá. A requisição é multipart e um exemplo de requisição está a seguir:

upload: teste.csv
name: Eduardo
email: Eduardo@hotmail.com

com a resposta em json:

{
	"success": true,
	"message": "Catálogo adicionado."
}

/books/pdf (POST)

Nesta rota, o usuário assim como na rota anterior pode fazer a submissão de um arquivo, desta vez de um pdf, onde, se possível, a api irá extrair as informações e cadastrar no banco. Caso não consiga pegar o título ele não dá sequencia, e se por acaso a data de publicação estiver faltando, ele seta um valor padrão para que não conflite nos filtros da requisição GET.

upload: test.pdf
name: Eduardo
email: Eduardo@hotmail.com
price: 70

e a resposta:

{
	"success": true,
	"dataToBeSaved": {
		"seller": "Eduardo",
		"sellerId": "e068cc73-859b-41fa-bb91-c317f0d335c5",
		"price": 70,
		"numPages": 350,
		"title": "Dracula",
		"authors": "Bram Stoker",
		"publicationDate": "01/01/2000",
		"publisher": "Project Gutenberg"
	}
}

/books (GET)

Nesta rota é possível listar todos os livros, trazendo somente os mais baratos (Se houver 2 livros iguais de vendedores diferentes, retorna o mais barato) e suportando filtros como nome, data de publicação, preço e ordenação.

exemplo de resposta com query de título:

[
	{
		"id": "e068cc73-859b-41fa-bb91-c317f0d335f7",
		"title": "book test 3",
		"authors": "author test 3",
		"numPages": 220,
		"publicationDate": "09/01/2003",
		"publisher": "publisher test3",
		"price": 74.1,
		"seller": "Eduardo",
		"sellerId": "e068cc73-859b-41fa-bb91-c317f0d335c5",
		"updated_at": "2021-05-17T20:01:45.000Z",
		"created_at": "2021-05-17T20:01:45.000Z"
	}
]

exemplo de resposta com query de ordem de publicação:

[
	{
		"id": "e068cc73-859b-41fa-bb91-c317f0d333c7",
		"title": "book test 1",
		"authors": "author test 1",
		"numPages": 200,
		"publicationDate": "09/01/2003",
		"publisher": "publisher test",
		"price": 84.2,
		"seller": "Mario",
		"sellerId": "eace4909-89b4-448d-8d4a-65eea3fe9229",
		"updated_at": "2021-05-17T20:01:45.000Z",
		"created_at": "2021-05-17T20:01:45.000Z"
	},
	{
		"id": "e068cc73-859b-41fa-bb91-c317f0d335f7",
		"title": "book test 3",
		"authors": "author test 3",
		"numPages": 220,
		"publicationDate": "09/01/2003",
		"publisher": "publisher test3",
		"price": 74.1,
		"seller": "Eduardo",
		"sellerId": "e068cc73-859b-41fa-bb91-c317f0d335c5",
		"updated_at": "2021-05-17T20:01:45.000Z",
		"created_at": "2021-05-17T20:01:45.000Z"
	},
	{
		"id": "e068cc73-859b-41fa-bb91-c317f0d335d8",
		"title": "book test 2",
		"authors": "author test 2",
		"numPages": 210,
		"publicationDate": "09/01/2005",
		"publisher": "publisher test2",
		"price": 94.35,
		"seller": "Eduardo",
		"sellerId": "e068cc73-859b-41fa-bb91-c317f0d335c5",
		"updated_at": "2021-05-17T20:01:45.000Z",
		"created_at": "2021-05-17T20:01:45.000Z"
	}
]

/books/buy (POST)

Nesta rota, o usuário pode solicitar a compra de um livro, se existir, passando o título da obra:

{
	"title": "book test 3"
}

E retornado:

{
	"success": true,
	"title": "book test 3",
	"authors": "author test 3",
	"price": 74.1,
	"seller": "Eduardo"
}

Para estes testes em específico, ao longo do projeto, foi utilizado além dos testes, o [Insomnia](https://insomnia.rest/download) e seu arquivo está na pasta public para importação.
Além disso os livros usados para estes casos de uso estão na pasta books dentro da pasta public, além do arquivo original csv e dois "recortados" para testes.
