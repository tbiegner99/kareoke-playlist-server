const DBClient = require('./client');

const instances = {};
let DEFAULT_DATABASE = null;

class DBClientFactory {
    static createClient(connectionOptions) {
        return new DBClient(connectionOptions);
    }

    static initialize(connectionOptions, poolOptions, defaultDB, databases) {
        DEFAULT_DATABASE = defaultDB;
        databases.forEach(db => {
            const opts = { database: db, ...connectionOptions };
            instances[db] = this.createClient(opts);
            if (poolOptions) {
                instances[db].usePool(poolOptions);
            }
        });
    }

    static getClient(database = DEFAULT_DATABASE) {
        return instances[database];
    }
}
module.exports = DBClientFactory;
