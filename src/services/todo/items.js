const ToDoDatasource = require('../../datasource/todo/datasource');
const ListService = require('../ListService');

class ToDoService extends ListService {
    constructor() {
        super(new ToDoDatasource());
    }
}

module.exports = ToDoService;
