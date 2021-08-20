# Meet us

## Demo
https://meet-us-frontend-inz.herokuapp.com

### App supports
* GraphQL
* Seeders based on faker
* Mailer
* JWT tokens for authorisation requests to api
* Typeorm for MySQL
* Password encryption

### Dev Tools
* [pretter](https://github.com/prettier/prettier)
* [eslint](https://github.com/eslint/eslint)
* [husky](https://github.com/typicode/husky)
* [lint-staged](https://github.com/conventional-changelog/commitlint)
* [commitlint](https://commitlint.js.org/#/)

## Run in docker
```bash
$ docker compose up -d
```

### Use docker container terminal
```bash
$ docker exec -ti meet.us bash
```

## Installation


```bash
$ cp .env.sample .env
$ yarn install
```

1. Set values in .env file

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Generate documentation
[docs.nestjs.com/recipes/documentation](https://docs.nestjs.com/recipes/documentation)

```bash
npx @compodoc/compodoc -p tsconfig.json -s
# or
yarn doc
```
