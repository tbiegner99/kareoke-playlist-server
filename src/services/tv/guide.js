const TVChannelService = require('./channels');
const TVGuideDatasource = require('../../datasource/tv/guide/datasource');
const KodiTVDatasource = require('../../datasource/tv/kodi/datasource');

class TVGuideService {
    constructor() {
        this.channelService = new TVChannelService();
        this.datasource = new TVGuideDatasource();
        this.kodiDatasource = new KodiTVDatasource();
    }

    async addBroadcastEntry(channelId, broadcast) {
        const { broadcastId } = broadcast;
        let [details] = await this.datasource.getBroadcastDetails(broadcastId);

        if (!details) {
            details = await this.kodiDatasource.loadBroadcastDetails(
                broadcastId
            );
            await this.datasource.createBroadcastDetails(details);
        }
        await this.datasource.createChannelBroadcast({
            channelId,
            startTime: broadcast.startTime,
            endTime: broadcast.endTime,
            broadcastId: details.broadcastId,
        });
        return details;
    }

    async updateGuideForChannel(channel) {
        const { id: channelId } = channel;
        const broadcasts = await this.kodiDatasource.loadBroadcasts(channelId);

        const promises = broadcasts.map(broadcast =>
            this.addBroadcastEntry(channelId, broadcast)
        );
        await Promise.all(promises);
    }

    async updateGuide() {
        const channels = await this.channelService.loadChannels();
        const results = {};
        for (const channel of channels) {
            const result = await this.updateGuideForChannel(channel);
            Object.assign(results, result);
        }
        return results;
    }

    async loadGuide() {
        const channels = await this.channelService.loadChannels();
        channels.forEach(channel => {
            Object.assign(channel, { programs: [] });
        });
        const byId = (acc, value) => ({ ...acc, [value.id]: value });
        const channelsById = channels.reduce(byId, {});
        const guideEntries = await this.datasource.getGuide();
        Object.entries(guideEntries).forEach(([channelId, programs]) => {
            Object.assign(channelsById[channelId], { programs });
        });
        return channels;
    }

    async loadGuideForChannelNumber(number) {
        const channels = await this.channelService.getChannelByNumber(number);
        channels.forEach(channel => {
            Object.assign(channel, { programs: [] });
        });
        const byId = (acc, value) => ({ ...acc, [value.id]: value });
        const channelsById = channels.reduce(byId, {});
        const guideEntries = await this.datasource.getGuideForChannelNumber(
            number
        );
        Object.entries(guideEntries).forEach(([channelId, programs]) => {
            Object.assign(channelsById[channelId], { programs });
        });
        return channels;
    }
}

module.exports = TVGuideService;
