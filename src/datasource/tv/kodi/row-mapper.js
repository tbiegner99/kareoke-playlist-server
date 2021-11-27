const moment = require('moment');

class ChannelsRowMapper {
    fromChannelsResponse(data, isHD) {
        return data.result.channels.map(channel =>
            this.fromChannelResponse(channel, isHD)
        );
    }

    fromBroadcastResponse(data) {
        if (!data.result.limits.total) {
            return [];
        }
        return data.result.broadcasts.map(broadcast => ({
            startTime: moment.utc(broadcast.starttime),
            endTime: moment.utc(broadcast.endtime),
            label: broadcast.label,
            broadcastId: broadcast.broadcastid,
        }));
    }

    fromBroadcastDetailsResponse(data) {
        const broadcast = data.result.broadcastdetails;
        return {
            broadcastId: broadcast.broadcastid,
            title: broadcast.title,
            plot: broadcast.plot,
            plotOutline: broadcast.plotoutline,
            startTime: moment.utc(broadcast.starttime),
            endTime: moment.utc(broadcast.endtime),
            runtime: broadcast.runtime,
            genre: broadcast.genre,
            firstAired: moment(broadcast.firstaired),
            parentalRating: broadcast.parentalrating,
            thumbnail: broadcast.thumbnail,
            rating: broadcast.rating,
            originalTitle: broadcast.originaltitle,
            episodeName: broadcast.episodename,
            cast: broadcast.cast,
            director: broadcast.director,
            writer: broadcast.writer,
            year: broadcast.year,
            imdbNumber: broadcast.imdbnumber,
            isSeries: broadcast.isseries,
            isRecording: broadcast.recording,
            hasRecording: broadcast.hasrecording,
        };
    }

    fromChannelResponse(channel, isHd) {
        return {
            id: channel.channelid,
            number: channel.channelnumber,
            highDefinition: isHd,
            icon: channel.icon,
            thumbnail: channel.thumbnail,
            name: channel.label,
        };
    }
}

module.exports = new ChannelsRowMapper();
