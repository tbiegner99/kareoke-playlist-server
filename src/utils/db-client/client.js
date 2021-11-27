const mysql = require('mysql2/promise');
const ConnectionWrapper = require('./connection-wrapper');

class DBClient {
    constructor(connectionOptions = {}) {
        this.connectionOptions = connectionOptions;
        this.terminated = false;
    }

    usePool(options) {
        const poolOptions = { ...this.connectionOptions, ...options };
        this.pool = mysql.createPool(poolOptions);
    }

    async withTransaction(func) {
        const connection = await this.pool.getConnection();

        try {
            await connection.beginTransaction();
            await func(new ConnectionWrapper(connection));
            await connection.commit();
        } finally {
            try {
                if (connection) {
                    await connection.rollback();
                }
            } catch (err) {
                console.log(err);
            }
            await connection.release();
        }
    }

    async query(query, params) {
        if (this.terminated) {
            throw new Error('Cannot query terminated client');
        }
        if (this.pool) {
            const results = await this.pool.query(query, params);
            return results;
        }
        const connection = await mysql.createConnection(this.connectionOptions);
        const result = await connection.query(query, params);
        await connection.end();
        return result;
    }

    async terminate() {
        if (this.pool) {
            await this.pool.end();
        }
        this.terminated = true;
    }
}

module.exports = DBClient;
