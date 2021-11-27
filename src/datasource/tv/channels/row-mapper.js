class TVChannelMapper {
    fromChannel(channel) {
        return {
            id: channel.channel_id,
            number: channel.number,
            name: channel.name,
            highDefinition: Boolean(channel.is_high_definition),
            icon: channel.icon_location,
            thumbnail: channel.thumbnail_location,
        };
    }

    toInsertParams(channel) {
        return {
            channelId: channel.id,
            number: channel.number,
            isHighDef: channel.highDefinition,
            name: channel.name,
            icon: channel.icon,
            thumbnail: channel.thumbnail,
        };
    }
}

module.exports = new TVChannelMapper();
