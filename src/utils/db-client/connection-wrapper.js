class ConnectionWrapper {
    constructor(connection) {
        this.connection = connection;
    }

    async query(query, params) {
        const result = await this.connection.query(query, params);
        return result;
    }
}
module.exports = ConnectionWrapper;
