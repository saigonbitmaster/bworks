include .env

MAKEFILE=`echo ${MAKEFILE_LIST} | awk 'BEGIN { FS="[ ]" } ; { print $$1 }'`
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## install dependencies
	@echo 'Install all dependencies'
	@yarn --force

gen-en: ## generate en language, example: "make gen-en project=cms-web"
	@echo 'Generate en language for project: $(project)'
	@node copy-translation.js $(project)

run-api: ## run api in development mode
	@echo 'Run api'
	@yarn run-api
run-emp: ## run emp in development mode
	@echo 'Run employer frontend'
	@yarn run-emp
run-jsk: ## run jsk in development mode
	@echo 'Run job seeker frontend'
	@yarn run-jsk
run-cms: ## run cms in development mode
	@echo 'Run cms frontend'
	@yarn run-cms
run-login: ## run cms in development mode
	@echo 'Run login frontend'
	@yarn run-login

# build
build-lib:
	@echo 'Run build ra-loopback3'
	@yarn build-lib
build-emp: ## run build emp
	@echo 'Run build emp-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-emp
build-jsk: ## run build jsk
	@echo 'Run build jsk-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-jsk
build-cms: ## run build cms
	@echo 'Run build cms'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-cms
build-login:  ## run build login
	@echo 'Run build overview-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-login
build-all:  ## run build all libs & projects
	@echo 'Run build all project'
	@export NODE_ACTIVE_LANGUAGES=vi,en
	@yarn build-jsk
	@yarn build-emp
	@yarn build-login
	@yarn build-cms