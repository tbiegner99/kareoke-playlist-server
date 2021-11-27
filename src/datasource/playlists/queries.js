const SELECT_ALL_PLAYLIST_ITEMS = `Select p.position, s.song_id,s.artist,s.title,s.source,s.filename
    from playlist_items p,songs s 
    where s.song_id=p.song_id and playlist_id = :playlistId 
    order by cast(position as decimal(30,20))`;

const SELECT_MOVE_UP_ITEM_AFTER = `SELECT * FROM kareoke.playlist_items 
    where playlist_id=:playlistId AND CAST(position as DECIMAL(30,20))< :position 
    order by CAST(position as DECIMAL(30,20)) desc limit 1 offset 1;`;
const CLEAR_PLAYLIST =
    'DELETE FROM playlist_items WHERE playlist_id= :playlistId';
const SELECT_TOP_N_PLAYLIST_ITEMS = `${SELECT_ALL_PLAYLIST_ITEMS} limit :limit`;
const FIRST_POSITION = `SELECT IFNULL(MIN(cast(position as decimal(30,20))), 1) as position 
    from playlist_items 
    where playlist_id = :playlistId`;
const LAST_POSITION = `SELECT IFNULL(MAX(cast(position as decimal(30,20))), 0) as position 
    from playlist_items 
    where playlist_id = :playlistId`;

const NEXT_POSITION = `SELECT position as nextPosition
    from playlist_items 
    where playlist_id = :playlistId and cast(position as decimal(30,20))>:position 
    order by cast(position as decimal(30,20)) 
    limit 1`;

const CREATE_PLAYLIST_ITEM = `INSERT INTO playlist_items (playlist_id, song_id,position) VALUES(:playlistId,:songId,:position);`;
const DELETE_PLAYLIST_ITEM = `DELETE FROM playlist_items WHERE playlist_id=:playlistId and position=:position`;
const MOVE_PLAYLIST_ITEM = `UPDATE playlist_items SET position=:newPosition WHERE playlist_id=:playlistId and position=:position`;

module.exports = {
    SELECT_MOVE_UP_ITEM_AFTER,
    SELECT_TOP_N_PLAYLIST_ITEMS,
    SELECT_ALL_PLAYLIST_ITEMS,
    CLEAR_PLAYLIST,
    FIRST_POSITION,
    LAST_POSITION,
    CREATE_PLAYLIST_ITEM,
    DELETE_PLAYLIST_ITEM,
    NEXT_POSITION,
    MOVE_PLAYLIST_ITEM,
};
