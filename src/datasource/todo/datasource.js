const ListDatasource = require('../ListDatasource');
const DBClientFactory = require('../../utils/db-client/factory');
const serializer = require('./row-mapper');
const queryGenerator = require('./queries');
const { databases } = require('../../config/db');

class ToDoListDatasource extends ListDatasource {
    constructor() {
        super(
            serializer,
            queryGenerator,
            DBClientFactory.getClient(databases.TO_DO_LIST)
        );
    }
}

module.exports = ToDoListDatasource;
