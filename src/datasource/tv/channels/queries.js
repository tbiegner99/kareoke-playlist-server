const INSERT_QUERY = `INSERT IGNORE INTO channel_info (channel_id, number, name,is_high_definition, icon_location,thumbnail_location)
VALUES(:channelId, :number, :name,:isHighDef, :icon,:thumbnail)`;
const SELECT_ALL_CHANNELS_QUERY = 'SELECT * FROM channel_info';
const SELECT_BY_ID_QUERY =
    'SELECT * FROM channel_info where channel_id=:channelId';
const SELECT_BY_NUMBER_QUERY =
    'SELECT * FROM channel_info where number=:channelNumber';
const DELETE_QUERY = 'DELETE FROM channel_info where channel_id=:channelId;';

module.exports = {
    INSERT_QUERY,
    SELECT_ALL_CHANNELS_QUERY,
    SELECT_BY_ID_QUERY,
    SELECT_BY_NUMBER_QUERY,
    DELETE_QUERY,
};
