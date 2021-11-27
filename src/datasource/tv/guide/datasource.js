const moment = require('moment');
const DBClientFactory = require('../../../utils/db-client/factory');
const queries = require('./queries');
const mapper = require('./row-mapper');
const { databases } = require('../../../config/db');

const isEmpty = arr => arr.length === 0;
const getClosestHalfHour = () => {
    const now = moment();

    if (now.minutes >= 30) {
        return now
            .startOf('hour')
            .add(30, 'minutes')
            .utc()
            .toDate();
    }
    return now
        .startOf('hour')
        .utc()
        .toDate();
};

class TVGuideDatasource {
    constructor() {
        this.client = DBClientFactory.getClient(databases.TV);
    }

    async createBroadcastDetails(broadcast) {
        const params = mapper.toBroadcastDetailsRow(broadcast);
        await this.client.query(queries.CREATE_BROADCAST, params);
        return broadcast;
    }

    async createChannelBroadcast(channelBroadcast) {
        const params = mapper.toChannelBroadcastRow(channelBroadcast);
        const [results] = await this.client.query(
            queries.CREATE_CHANNEL_BROADCAST,
            params
        );
        return { ...channelBroadcast, guideId: results.insertId };
    }

    addBroadcastDetails(channelNumber) {
        return this.getChannel(queries.CREATE_CHANNEL_BROADCAST, {
            channelNumber,
        });
    }

    async getBroadcastDetails(broadcastId) {
        const [results] = await this.client.query(
            queries.GET_BROADCAST_DETAILS,
            {
                broadcastId,
            }
        );
        if (isEmpty(results)) {
            return [];
        }
        const result = mapper.fromBroadcastDetails(results[0]);
        return [result];
    }

    async getChannelBroadcasts(channelId) {
        const [results] = await this.client.query(
            queries.LOAD_GUIDE_FOR_CHANNEL,
            {
                channelId,
                now: getClosestHalfHour(),
            }
        );
        if (isEmpty(results)) {
            return [];
        }
        return results.map(result => mapper.fromBroadcastDetails(result));
    }

    async getGuideForChannelNumber(channelNumber) {
        const now = getClosestHalfHour();
        const [results] = await this.client.query(
            queries.LOAD_GUIDE_FOR_CHANNEL_NUMBER,
            {
                now,
                channelNumber,
            }
        );
        if (isEmpty(results)) {
            return [];
        }
        const result = mapper.fromGuideEntries(results);
        return result;
    }

    async getGuide() {
        const [results] = await this.client.query(queries.LOAD_GUIDE, {
            now: getClosestHalfHour(),
        });
        if (isEmpty(results)) {
            return [];
        }
        const result = mapper.fromGuideEntries(results);
        return result;
    }
}

module.exports = TVGuideDatasource;
