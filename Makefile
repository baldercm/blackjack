# baldercm/blackjack Makefile

NODE_MODULES_BIN = ./node_modules/.bin
MOCHA            = NODE_ENV=test $(NODE_MODULES_BIN)/mocha
MOCHA_COV        = $(NODE_MODULES_BIN)/istanbul cover $(NODE_MODULES_BIN)/_mocha
REPORT_DOCS      = docs/README.md


default: test

dev-install:
	npm install --global nodemon
	rm -Rf node_modules
	npm install

dev-start:
	nodemon index.js

dev-test:
	nodemon --exec "$(MOCHA) --reporter min"

test: test-start test-commands test-end

test-docker: test-start docker-test-start docker-test-commands test-end docker-test-stop

docker-test-commands:
	MONGO_PORT=27117 $(MOCHA)

test-commands:
	$(MOCHA)

test-docs: test-start test-docs-commands test-end

test-docs-commands:
	rm -f $(REPORT_DOCS)
	mkdir -p docs
	$(MOCHA) --reporter markdown >> $(REPORT_DOCS)

coverage: test-start precoverage
	NODE_ENV=test $(MOCHA_COV)

test-start: lint

test-end:

docker-test-start:
	$(if $(shell docker ps -a | grep 'mongo-test'),docker rm -vf mongo-test)
	docker run -p 27117:27017 --name mongo-test -d mongo --smallfiles
	docker run --rm --link mongo-test:mongo-test aanand/wait

docker-test-stop:
	$(if $(shell docker ps -a | grep 'mongo-test'),docker rm -vf mongo-test)

prereport:
	rm -Rf report
	mkdir -p report

precoverage:
	rm -Rf coverage

lint: jshint jscs

jshint:
	$(NODE_MODULES_BIN)/jshint .

jscs:
	$(NODE_MODULES_BIN)/jscs .

.PHONY: test
