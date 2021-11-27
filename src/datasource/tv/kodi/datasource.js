const HttpDatasource = require('../../HttpDatasource');
const mapper = require('./row-mapper');

const KODI_URL = 'http://192.168.2.205';
const JSONRPC_URL = '/jsonrpc';
const HD_CHANNEL_GROUP_ID = 3;
const STD_CHANNEL_GROUP_ID = 4;
const RPC_METHODS = {
    PVR: {
        GetChannels: 'PVR.GetChannels',
        GetBroadcasts: 'PVR.GetBroadcasts',
        GetBroadcastDetails: 'PVR.GetBroadcastDetails',
    },
};

class KodiTvDatasource extends HttpDatasource {
    constructor() {
        super(KODI_URL);
    }

    async callJsonRpc(methodName, params) {
        const body = {
            id: 1,
            jsonrpc: '2.0',
            method: methodName,
            params,
        };
        const url = this.constructUrl(JSONRPC_URL);
        const response = await this.dbClient.post(url, body);
        if (response.data.error) {
            throw Object.assign(new Error(), { errors: response.data.errors });
        }
        return response;
    }

    async loadBroadcasts(channelid) {
        const response = await this.callJsonRpc(RPC_METHODS.PVR.GetBroadcasts, {
            channelid,
            properties: ['starttime', 'endtime'],
        });

        return mapper.fromBroadcastResponse(response.data);
    }

    async loadBroadcastDetails(broadcastId) {
        const response = await this.callJsonRpc(
            RPC_METHODS.PVR.GetBroadcastDetails,
            {
                broadcastid: broadcastId,
                properties: [
                    'title',
                    'plot',
                    'plotoutline',
                    'starttime',
                    'endtime',
                    'runtime',
                    'progress',
                    'progresspercentage',
                    'genre',
                    'episodename',
                    'episodenum',
                    'episodepart',
                    'firstaired',
                    'hastimer',
                    'isactive',
                    'parentalrating',
                    'wasactive',
                    'thumbnail',
                    'rating',
                    'originaltitle',
                    'cast',
                    'director',
                    'writer',
                    'year',
                    'imdbnumber',
                    'hastimerrule',
                    'hasrecording',
                    'recording',
                    'isseries',
                ],
            }
        );

        return mapper.fromBroadcastDetailsResponse(response.data);
    }

    async loadChannels(isHd) {
        const channelgroupid = isHd
            ? HD_CHANNEL_GROUP_ID
            : STD_CHANNEL_GROUP_ID;
        const response = await this.callJsonRpc(RPC_METHODS.PVR.GetChannels, {
            channelgroupid,
            properties: [
                'channeltype',
                'hidden',
                'locked',
                'thumbnail',
                'icon',
                'channelnumber',
            ],
        });

        return mapper.fromChannelsResponse(response.data, isHd);
    }

    loadHdChannels() {
        return this.loadChannels(true);
    }

    loadStandardDefinitionChannels() {
        return this.loadChannels(false);
    }

    async loadAllChannels() {
        const hdChannels = await this.loadHdChannels();
        const stdChannels = await this.loadStandardDefinitionChannels();
        return [...hdChannels, ...stdChannels];
    }
}

module.exports = KodiTvDatasource;
