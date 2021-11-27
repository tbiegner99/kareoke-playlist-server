const INSERT_QUERY = `INSERT IGNORE INTO titles (title,artist) VALUES (:title,:artist)
    INSERT INTO songs (title,artist,source, filename) VALUES(:title, :artist, :source, :filename)`;
const UPDATE_QUERY = '';
const SELECT_BY_ID_QUERY =
    "SELECT *, 'song' as song FROM songs where song_id=:songId";
const SELECT_ALL_SONGS = 'SELECT * FROM songs';
const DELETE_QUERY = 'DELETE FROM songs where song_id=:songId;';
const SEARCH_ARTISTS_QUERY =
    "SELECT artist, Count(*) as count, 'artist' as resultType FROM songs where artist LIKE concat(:artist, '%') Group by artist :limit";
const SEARCH_TITLES_QUERY =
    "SELECT title, Count(*) as count, 'title' as resultType FROM songs where title LIKE concat(:title, '%')  Group by title :limit";
const SEARCH_SONG_BY_ARTIST_QUERY = `SELECT s.* FROM songs s 
INNER JOIN (SELECT * from titles  WHERE s.artist LIKE concat(:artist, '%') :limit) t 
    on t.artist=s.artist and s.title=t.title`;
const SEARCH_SONG_BY_TITLE_QUERY = `SELECT s.* FROM songs s 
INNER JOIN (SELECT * from titles WHERE s.title LIKE concat(:title, '%') :limit ) t 
    on t.artist=s.artist and s.title=t.title`;
const SEARCH_SONG_BY_TEXT_QUERY = `SELECT s.* FROM songs s 
INNER JOIN (SELECT * from titles  WHERE title LIKE concat(:text, '%') OR artist LIKE concat(:text, '%') :limit) t 
    on t.artist=s.artist and s.title=t.title 
    UNION ALL
    SELECT * FROM songs where song_id=:text`;
const SEARCH_SONG_BY_ARTIST_EXACT_QUERY = `SELECT s.* FROM songs s 
INNER JOIN (SELECT * from titles WHERE s.artist =:artist :limit) t 
    on t.artist=s.artist and s.title=t.title`;
const SEARCH_SONG_BY_TITLE_EXACT_QUERY = `SELECT s.* FROM songs s 
        INNER JOIN (SELECT * from titles WHERE title =:title :limit) t 
        on t.artist=s.artist and s.title=t.title`;
const SEARCH_SONG_BY_TEXT_EXACT_QUERY = `SELECT s.* FROM songs s 
        INNER JOIN (SELECT * from titles WHERE title=:text OR artist=:text) t 
        on t.artist=s.artist and s.title=t.title
        UNION ALL
        SELECT * FROM songs where song_id=:text`;

const limitPlaceHolder = /:limit/g;

const queryWithLimitOption = query => ({
    withLimit: () => {
        return query.replace(limitPlaceHolder, 'LIMIT :limit');
    },
    unlimited: () => {
        return query.replace(limitPlaceHolder, '');
    },
});

module.exports = {
    INSERT_QUERY,
    UPDATE_QUERY,
    SELECT_BY_ID_QUERY: queryWithLimitOption(SELECT_BY_ID_QUERY),
    SELECT_ALL_SONGS: queryWithLimitOption(SELECT_ALL_SONGS),
    DELETE_QUERY,
    SEARCH_TITLES_QUERY: queryWithLimitOption(SEARCH_TITLES_QUERY),
    SEARCH_ARTISTS_QUERY: queryWithLimitOption(SEARCH_ARTISTS_QUERY),
    SEARCH_SONG_BY_ARTIST_QUERY: queryWithLimitOption(
        SEARCH_SONG_BY_ARTIST_QUERY
    ),
    SEARCH_SONG_BY_TITLE_QUERY: queryWithLimitOption(
        SEARCH_SONG_BY_TITLE_QUERY
    ),
    SEARCH_SONG_BY_TEXT_QUERY: queryWithLimitOption(SEARCH_SONG_BY_TEXT_QUERY),
    SEARCH_SONG_BY_ARTIST_EXACT_QUERY: queryWithLimitOption(
        SEARCH_SONG_BY_ARTIST_EXACT_QUERY
    ),
    SEARCH_SONG_BY_TITLE_EXACT_QUERY: queryWithLimitOption(
        SEARCH_SONG_BY_TITLE_EXACT_QUERY
    ),
    SEARCH_SONG_BY_TEXT_EXACT_QUERY: queryWithLimitOption(
        SEARCH_SONG_BY_TEXT_EXACT_QUERY
    ),
    withLimit: (query, limit) =>
        limit > 0 ? query.withLimit() : query.unlimited(),
};
