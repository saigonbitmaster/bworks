# bWorks
# .env file
NODE_ENV=development -> select data source from setting files
PASSWORD=*** -> mongodb password
NODE_INIT_DATA = false, -> to init data or not
#to force update INIT and TEST data
NODE_FORCE_INIT_DATA = false, -> update if record already exists
#to init test data
NODE_INIT_TEST_DATA = false, -> insert test data to mongo
PORT=4001

#ACL 
acl settings in model.json will override the ACL settings in database
