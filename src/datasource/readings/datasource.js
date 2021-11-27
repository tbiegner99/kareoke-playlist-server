const moment = require('moment');
const DBClientFactory = require('../../utils/db-client/factory');
const queries = require('./queries');
const mapper = require('./row-mapper');
const { databases } = require('../../config/db');
const { filters, types } = require('../../config/constants/readings');

const createTemperatureReading = async (client, reading) => {
    const params = mapper.toInsertTemperatureReading(reading);
    await client.query(queries.INSERT_TERMPERATURE_READING, params);
    return params;
};

const createHumidityReading = async (client, reading) => {
    const params = mapper.toInsertHumidityReading(reading);
    await client.query(queries.INSERT_HUMIDITY_READING, params);
    return params;
};

const createReadingOfType = (client, type, reading) => {
    switch (type) {
        case types.HUMIDITY:
            return createHumidityReading(client, reading);
        case types.TEMPERATURE:
            return createTemperatureReading(client, reading);
        default:
            throw new Error('Unknown reading type');
    }
};

class ReadingsDatasource {
    constructor() {
        this.dbClient = DBClientFactory.getClient(databases.READINGS);
    }

    getSelectQueryWithFilter(filter) {
        switch (filter) {
            case filters.CUSTOM:
                return queries.SELECT_READINGS_WITHIN_CUSTOM_RANGE;
            case filters.WEEK:
                return queries.SELECT_READINGS_WITHIN_WEEK;
            case filters.YEAR:
                return queries.SELECT_READINGS_WITHIN_YEAR;
            case filters.MONTH:
                return queries.SELECT_READINGS_WITHIN_MONTH;
            case filters.DAY:
            default:
                return queries.SELECT_READINGS_WITHIN_DAY;
        }
    }

    async getReadingsForZone(zone, type, filter, filterParams) {
        const query = this.getSelectQueryWithFilter(filter);
        const params = mapper.toParamsForSelect(
            zone,
            type,
            filter,
            filterParams
        );
        const [results] = await this.dbClient.query(query, params);

        return results.map(mapper.fromReadings);
    }

    async createZone(zone) {
        const params = mapper.toInsertZoneParams(zone);
        await this.dbClient.query(queries.CREATE_ZONE, params);
    }

    async getZones() {
        const [results] = await this.dbClient.query(queries.GET_ZONES, {});

        return results.map(mapper.fromZone);
    }

    async createReading(zone, type, reading) {
        let readingWithId = null;
        await this.dbClient.withTransaction(async client => {
            const date = moment().toDate();
            const params = {
                zone,
                type,
                date,
            };

            const [result] = await client.query(
                queries.ADD_BASE_READING,
                params
            );
            readingWithId = {
                id: result.insertId,
                zone,
                type,
                date,
                ...reading,
            };

            const data = await createReadingOfType(client, type, readingWithId);
            readingWithId = { ...readingWithId, data };
        });
        return readingWithId;
    }
}

module.exports = ReadingsDatasource;
