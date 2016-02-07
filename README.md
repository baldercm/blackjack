baldercm/blackjack
==============
Simple blackjack game in Node.js.

## System Requirements
- node.js v4.2.0 or later
- OPTIONAL
  + MongoDB (tested with 3.0)
  + Docker (tested with 1.9.1)
  + nodemon

## Basic Usage via `npm`
- use `npm install` to download dependencies
- use `npm test` to run tests
- use `npm start` to run the shell client demo

## Basic Usage via `make`
- use `make dev-install` to download dependencies and optional global NPM packages
- use `make test` to run tests
- use `make test-docker` to run tests using a MongoDB Docker container
- use `make test-docs` to run tests and generate Markdown docs
- use `make coverage` to run tests coverage

Check `package.json` and `Makefile` to see available scripts and build targets. NPM run scripts are mostly aliases to their Make counterparts.

## MongoDB
By default, the application will connect to `localhost:27017`. This can be tweaked using `MONGO_PORT` environment variable to support dockerized MongoDB running on a mapped port:

```
docker run -p 27117:27017 --name mongo-test -d mongo --smallfiles
docker run --rm --link mongo-test:mongo-test aanand/wait
MONGO_PORT=27117 npm start

// or

make docker-test-start
MONGO_PORT=27117 npm start
make docker-test-stop
```

## Current Limitations and TODO list
This is a simple implementation done in a few hours, so it lacks tons of important/useful features such as:

- General
  + [ ] refine domain model
  + [ ] store all events in the persistent storage
  + [ ] improve error handling
  + [ ] complete and improve tests
  + [ ] REST API
- `ShellClient`
  + [ ] game resume/load
  + [ ] save games at intermediate states
  + [ ] start new game or exist when game ends
- BlackJack features
  + [ ] no splitting, double-down or surrender
  + [ ] bet amount are integers
