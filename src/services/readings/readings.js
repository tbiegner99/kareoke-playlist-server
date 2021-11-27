const ReadingsDatasource = require('../../datasource/readings/datasource');

class ReadingsService {
    constructor() {
        this.readingsDatasource = new ReadingsDatasource();
    }

    async getReadingsForZone(zone, type, filter, filterParams) {
        try {
            return await this.readingsDatasource.getReadingsForZone(
                zone,
                type,
                filter,
                filterParams
            );
        } catch (err) {
            throw new Error('An error occurred retrieving readings');
        }
    }

    async getZones() {
        try {
            return await this.readingsDatasource.getZones();
        } catch (err) {
            throw new Error('An error occurred retrieving zones');
        }
    }

    async createZone(zone) {
        try {
            await this.readingsDatasource.createZone(zone);
            return zone;
        } catch (err) {
            throw new Error('An error occurred creating zone');
        }
    }

    async createReading(zone, type, reading) {
        try {
            return await this.readingsDatasource.createReading(
                zone,
                type,
                reading
            );
        } catch (err) {
            throw new Error('An error occurred  creating reading');
        }
    }
}

module.exports = ReadingsService;
