const mysql = require('mysql2/promise');
const DBClient = require('../../../../src/utils/db-client/client');

describe('DB Client', () => {
    const poolOptions = { option: 'poolOPtion' };
    const poolQueryResults = 'poolResult';
    const connectionQueryResults = 'connectionResult';
    let client;
    let pool;
    let connection;

    beforeEach(() => {
        pool = {
            query: jest.fn().mockResolvedValue(poolQueryResults),
            end: jest.fn().mockResolvedValue(),
        };
        connection = {
            end: jest.fn(),
            query: jest.fn().mockResolvedValue(connectionQueryResults),
        };
        jest.spyOn(mysql, 'createPool').mockReturnValue(pool);
        jest.spyOn(mysql, 'createConnection').mockReturnValue(connection);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('construction', () => {
        it('initializes connextion options', () => {
            const options = { option: 'some-option' };
            expect(new DBClient().connectionOptions).toEqual({});
            expect(new DBClient(options).connectionOptions).toEqual(options);
        });

        it('is initially not terminated', () => {
            expect(new DBClient({}).terminated).toEqual(false);
        });
    });

    describe('use pool', () => {
        const connectionOptions = { option: 'some-option' };
        beforeEach(() => {
            client = new DBClient(connectionOptions);
            client.usePool(poolOptions);
        });

        it('creates pool for client with options', () => {
            expect(mysql.createPool).toHaveBeenCalledWith({
                ...connectionOptions,
                ...poolOptions,
            });
        });

        it('saves pool in client for use with queries', () => {
            expect(client.pool).toEqual(pool);
        });
    });

    describe('query ', () => {
        const query = 'some-query';
        const params = { param: 'param' };
        let results;
        describe('when client is terminated', () => {
            beforeEach(() => {
                client = new DBClient({});
                client.terminated = true;
            });
            it('throws error when attempting to run query', async () => {
                try {
                    await client.query(query, params);
                } catch (err) {
                    return;
                }
                throw new Error('expected a failure');
            });
        });

        describe('with pool', () => {
            beforeEach(async () => {
                client = new DBClient({});
                client.usePool(poolOptions);
                results = await client.query(query, params);
            });
            it('runs query through pool', () => {
                expect(pool.query).toHaveBeenCalledWith(query, params);
                expect(results).toEqual(poolQueryResults);
            });
        });

        describe('with no pool', () => {
            beforeEach(async () => {
                client = new DBClient({});
                results = await client.query(query, params);
            });
            it('runs query through new connection', () => {
                expect(pool.query).not.toHaveBeenCalled();
                expect(connection.query).toHaveBeenCalledWith(query, params);
                expect(results).toEqual(connectionQueryResults);
                expect(connection.end).toHaveBeenCalled();
            });
        });
    });

    describe('terminate', () => {
        describe('with pool', () => {
            beforeEach(async () => {
                client = new DBClient({});
                client.usePool(poolOptions);
                await client.terminate();
            });
            it('kills pool connections and terminates client', () => {
                expect(client.terminated).toEqual(true);
                expect(pool.end).toHaveBeenCalled();
            });
        });

        describe('without pool', () => {
            beforeEach(async () => {
                client = new DBClient({});
                await client.terminate();
            });
            it('sets terminated state on client', () => {
                expect(client.terminated).toEqual(true);
            });
        });
    });
});
