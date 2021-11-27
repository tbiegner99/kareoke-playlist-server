const moment = require('moment');

const toDate = obj => moment.utc(obj).toDate();
class TVGuideMapper {
    toBroadcastDetailsRow(broadcast) {
        return {
            broadcastId: broadcast.broadcastId,
            title: broadcast.title,
            plot: broadcast.plot,
            plotOutline: broadcast.plotOutline,
            startTime: toDate(broadcast.startTime),
            endTime: toDate(broadcast.endTime),
            runtime: broadcast.runtime,
            genre: JSON.stringify(broadcast.genre),
            firstAired: toDate(broadcast.firstAired),
            parentalRating: broadcast.parentalRating,
            episodeName: broadcast.episodeName,
            thumbnail: broadcast.thumbnail,
            rating: broadcast.rating,
            originalTitle: broadcast.originalTitle,
            cast: broadcast.cast,
            director: broadcast.director,
            writer: broadcast.writer,
            year: broadcast.year,
            imdbNumber: broadcast.imdbNumber,
            isSeries: Number(broadcast.isSeries),
            isRecording: Number(broadcast.isRecording),
            hasRecording: Number(broadcast.hasRecording),
        };
    }

    fromBroadcastDetails(broadcast) {
        return {
            channelId: broadcast.channel_id,
            broadcastId: broadcast.broadcast_id,
            title: broadcast.title,
            plot: broadcast.plot,
            plotOutline: broadcast.plot_outline,
            startTime: moment.utc(broadcast.starttime),
            endTime: moment.utc(broadcast.endtime),
            runtime: broadcast.runtime,
            genre: broadcast.genre,
            firstAired: moment(broadcast.first_aired),
            parentalRating: broadcast.parental_rating,
            thumbnail: broadcast.thumbnail,
            rating: broadcast.rating,
            originalTitle: broadcast.original_title,
            cast: broadcast.cast,
            director: broadcast.director,
            writer: broadcast.writer,
            year: broadcast.year,
            imdbNumber: broadcast.imdb_number,
            isSeries: Boolean(broadcast.is_series),
            isRecording: Boolean(broadcast.recording),
            hasRecording: Boolean(broadcast.has_recording),
        };
    }

    fromGuideEntries(entries) {
        const programsByChannelId = {};
        entries.forEach(guideEntry => {
            const { channel_id: channelId } = guideEntry;
            const broadcastDetails = this.fromBroadcastDetails(guideEntry);
            programsByChannelId[channelId] =
                programsByChannelId[channelId] || [];
            programsByChannelId[channelId].push(broadcastDetails);
        });
        return programsByChannelId;
    }

    toChannelBroadcastRow(broadcast) {
        return {
            channelId: broadcast.channelId,
            startDate: toDate(broadcast.startTime),
            endDate: toDate(broadcast.endTime),
            broadcastId: broadcast.broadcastId,
        };
    }
}

module.exports = new TVGuideMapper();
