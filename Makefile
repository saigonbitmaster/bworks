include .env

MAKEFILE=`echo ${MAKEFILE_LIST} | awk 'BEGIN { FS="[ ]" } ; { print $$1 }'`
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## install dependencies
	@echo 'Install all dependencies'
	@yarn --force

gen-en: ## generate en language, example: "make gen-en project=wnms-web"
	@echo 'Generate en language for project: $(project)'
	@node copy-translation.js $(project)

run-api: ## run api in development mode
	@echo 'Run api'
	@yarn run-api
run-nms: ## run nms (water network) client in development mode
	@echo 'Run nms fronend'
	@yarn run-nms
run-ctm: ## run ctm-web (water customer) in development mode
	@echo 'Run ctm fronend'
	@yarn run-ctm
run-client: ## run ctm-client (water customer) in development mode
	@echo 'Run ctm-client fronend'
	@yarn run-client
run-src: ## run src (water source) client in development mode
	@echo 'Run src fronend'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn run-src
run-org: ## run org (water organization) client in development mode
	@echo 'Run src fronend'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn run-org

# build
build-lib: ## run build ra-loopback3 lib
	@echo 'Run build ra-loopback3'
	@yarn build-lib
build-ctm: ## run build ctm (water customer) client
	@echo 'Run build wctm-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-ctm
build-client: ## run build ctm (water customer) client
	@echo 'Run build wctm-client'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-client
build-src: ## run build src (water source) client
	@echo 'Run build wctm-src'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-src
build-nms:  ## run build nms (water network) client
	@echo 'Run build wnms-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-nms
build-org:  ## run build ctm (water organization) client
	@echo 'Run build overview-web'
	@export NODE_ACTIVE_LANGUAGES=vi,en && yarn build-org
build-all:  ## run build all libs & projects
	@echo 'Run build all project'
	@export NODE_ACTIVE_LANGUAGES=vi,en
	# @yarn build-nms
	# @yarn build-ctm
	@yarn build-org
	@yarn build-src
	@yarn build-login
	@yarn build-client

create-new-env: ## create completely new env
	@echo "Stop running services"
	docker-compose down --volume
	@echo "Pull latest API image"
	docker-compose pull api
	@echo "Setup REST server and dbs"
	@docker-compose up --detach
	@echo "Config replica mode so transaction works"
	@sleep 10
	@docker exec wmongo mongo --username $(MONGO_USERNAME) --password $(MONGO_PASSWORD) --eval "$(CREATE_REPLICA)" 2>&1 >/dev/null
	@[ ! -z "$$CREATE_REPLICA" ] && unset CREATE_REPLICA || :
	@sleep 1
	@echo "Drop all previous data" 
	@docker exec wmongo mongo --username $(MONGO_USERNAME) --password $(MONGO_PASSWORD) --eval 'rs.slaveOk(); db.getMongo().getDBNames().forEach(function(dba) { db.getSiblingDB(dba).dropDatabase(); })'
	@sleep 5
	@echo "Insert base data"
	@docker exec wmongo mongorestore --username $(MONGO_USERNAME) --password $(MONGO_PASSWORD) --gzip -vvvv --host=mongo:27017 --nsExclude='*.IndexHistory' --archive=/data/baseData/refdata.gz --drop --preserveUUID --noIndexRestore
	@[ ! -z "$$MONGO_USERNAME" ] && unset MONGO_USERNAME || :
	@[ ! -z "$$MONGO_PASSWORD" ] && unset MONGO_PASSWORD || :
	@echo "Restart REST server" 
	@docker-compose restart api
	@echo "Server is ready"
	
deploy-new-build: ## deploy a new version of water-api container    
	@echo "Stop running services"
	docker-compose down --volume
	@echo "Pull latest API image"
	docker-compose pull api
	@echo "Startup new version for water-api"
	docker-compose up --detach
	@echo "Server is ready"

docker-build-ttnsbacninh:
	docker build -t 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com/water:ttnsbacninh .
	aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com
	docker push 644854060878.dkr.ecr.ap-southeast-1.amazonaws.com/water:ttnsbacninh