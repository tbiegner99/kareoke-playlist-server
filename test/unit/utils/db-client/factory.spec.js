const ClientFactory = require('../../../../src/utils/db-client/factory');
const DBClient = require('../../../../src/utils/db-client/client');

describe('DB client factory', () => {
    let mockClient;
    const options = { connOptions: 'connOption' };
    const poolOptions = { poolOption: 'options' };
    let result1;
    let result2;

    beforeEach(() => {
        mockClient = { usePool: jest.fn() };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('create client', () => {
        beforeEach(() => {
            result1 = ClientFactory.createClient(options);
            result2 = ClientFactory.getClient();
        });
        it('creates new instance of db client and doesnt set instance', () => {
            expect(result1).toBeInstanceOf(DBClient);
            expect(result1.connectionOptions).toBe(options);
            expect(result2).toBe(null);
        });
    });
    describe('initialize', () => {
        describe('when pool options passed', () => {
            beforeEach(() => {
                jest.spyOn(ClientFactory, 'createClient').mockReturnValue(
                    mockClient
                );
                result1 = ClientFactory.initialize(options, poolOptions);
                result2 = ClientFactory.getClient();
            });
            it('crates a new db client with provided options', () => {
                expect(result1).toEqual(mockClient);
                expect(result2).toEqual(mockClient);
            });

            it('creates connection pool with provided pool options', () => {
                expect(mockClient.usePool).toHaveBeenCalledWith(poolOptions);
            });
        });

        describe('when pool options not passed', () => {
            beforeEach(() => {
                jest.spyOn(ClientFactory, 'createClient').mockReturnValue(
                    mockClient
                );
                result1 = ClientFactory.initialize(options);
                result2 = ClientFactory.getClient();
            });
            it('crates a new db client with provided options', () => {
                expect(result1).toEqual(mockClient);
                expect(result2).toEqual(mockClient);
            });
            it('no connection pool created', () => {
                expect(mockClient.usePool).not.toHaveBeenCalled();
            });
        });
    });

    describe('get client', () => {
        beforeEach(() => {
            result1 = ClientFactory.initialize(options);
            result2 = ClientFactory.getClient();
        });
        it('returns existing instance', () => {
            expect(result1).toBe(result2);
        });
    });
});
