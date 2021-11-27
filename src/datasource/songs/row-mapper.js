class SongsRowMapper {
    fromResult(row) {
        switch (row.resultType) {
            case 'artist':
                return this.fromArtistRow(row);
            case 'title':
                return this.fromTitleRow(row);
            default:
                return this.fromSongRow(row);
        }
    }

    fromSongRow(song) {
        return {
            id: song.song_id,
            title: song.title,
            artist: song.artist,
            resultType: song.resultType,
            source: song.source,
            filename: song.filename,
            plays: song.plays,
            lastPlay: song.last_played,
        };
    }

    fromArtistRow(artist) {
        return {
            artist: artist.artist,
            count: artist.count,
            resultType: artist.resultType,
        };
    }

    fromTitleRow(title) {
        return {
            title: title.title,
            count: title.count,
            resultType: title.resultType,
        };
    }

    toInsertParams(song) {
        return {
            title: song.title,
            artist: song.artist,
            source: song.source,
            filename: song.filename,
        };
    }

    toUpdateParams() {
        return {};
    }
}

module.exports = new SongsRowMapper();
