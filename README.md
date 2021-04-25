# Meet us

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
```
