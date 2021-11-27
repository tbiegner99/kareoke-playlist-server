const CREATE_CHANNEL_BROADCAST = `
INSERT IGNORE INTO tv.channel_guide(channel_id,start_date,broadcast_id,end_date)
VALUES(:channelId,:startDate,:broadcastId,:endDate);`;
const CREATE_BROADCAST = `INSERT IGNORE INTO tv.broadcasts
(broadcast_id,title,plot,plot_outline,start_time,end_time,runtime,
genre,first_aired,parental_rating,thumbnail,rating,original_title,episode_name,
cast,director,writer,year,imdb_number,is_series,recording,has_recording)
VALUES
(:broadcastId,:title,:plot,:plotOutline,:startTime,:endTime,:runtime,:genre,
:firstAired,:parentalRating,:thumbnail,:rating,:originalTitle,:episodeName,:cast,
:director,:writer,:year,:imdbNumber,:isSeries,:isRecording,:hasRecording);`;
const LOAD_GUIDE =
    'SELECT channel_id,c.start_date as starttime, c.end_date as endtime, b.* FROM channel_guide c, broadcasts b  where c.broadcast_id=b.broadcast_id and c.end_date>=:now order by c.start_date';
const LOAD_GUIDE_FOR_CHANNEL_NUMBER =
    'SELECT c.channel_id, c.start_date as starttime, c.end_date as endtime, b.* FROM channel_info inf,channel_guide c, broadcasts b  where inf.channel_id=c.channel_id AND c.broadcast_id=b.broadcast_id and c.end_date>=:now and number=:channelNumber order by c.start_date';
const LOAD_GUIDE_FOR_CHANNEL =
    'SELECT channel_id, c.start_date as starttime, c.end_date as endtime, b.* FROM channel_guide c, broadcasts b  where c.channel_id=:channelId and c.broadcast_id=b.broadcast_id and c.end_date>=:now';
const GET_BROADCAST_DETAILS =
    'SELECT channel_id,c.start_date as starttime, c.end_date as endtime, b.* FROM broadcasts b,channel_guide c  where b.broadcast_id=c.broadcast_id AND b.broadcast_id=:broadcastId';

module.exports = {
    CREATE_BROADCAST,
    CREATE_CHANNEL_BROADCAST,
    LOAD_GUIDE,
    LOAD_GUIDE_FOR_CHANNEL,
    LOAD_GUIDE_FOR_CHANNEL_NUMBER,
    GET_BROADCAST_DETAILS,
};
