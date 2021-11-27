const SongsDatasource = require('../../datasource/songs/datasource');

const getQueryOpts = opts => ({
    limit: opts.limit,
    fullSearch: opts.fullSearch,
    exact: opts.exact,
});

class SongsService {
    constructor() {
        this.songsDatasource = new SongsDatasource();
    }

    async getSongById(songId) {
        try {
            const result = await this.songsDatasource.getSongById(songId);
            if (!result.length) {
                throw new Error('No song found with this id.');
            }
            return result[0];
        } catch (err) {
            throw new Error('An error occurred retrieving song by id');
        }
    }

    async getAllSongs() {
        try {
            return await this.songsDatasource.getAllSongs();
        } catch (err) {
            throw new Error('An error occurred retrieving songs');
        }
    }

    async createSong(songData) {
        try {
            return await this.songsDatasource.createSong(songData);
        } catch (err) {
            console.log(
                `error creating song ${songData.artist} - ${songData.title} ${songData.source} Error: ${err.code} ${err.errno}`
            );
            throw new Error('An error occurred creating song');
        }
    }

    async updateSong(songId, songData) {
        try {
            await this.songsDatasource.updateSong(songId, songData);
        } catch (err) {
            throw new Error('An error occurred updating song');
        }
    }

    async deleteSong(songId) {
        try {
            await this.songsDatasource.deleteSong(songId);
        } catch (err) {
            throw new Error('An error occurred deleting song');
        }
    }

    async searchSongsByTitle(title, opts) {
        try {
            return await this.songsDatasource.searchSongsByTitle(
                title,
                getQueryOpts(opts)
            );
        } catch (err) {
            throw new Error('An error occurred searching for song');
        }
    }

    async searchSongsByArtist(artist, opts) {
        try {
            return await this.songsDatasource.searchSongsByArtist(
                artist,
                getQueryOpts(opts)
            );
        } catch (err) {
            throw new Error('An error occurred searching for song');
        }
    }

    async searchSongsByText(text, opts) {
        try {
            return await this.songsDatasource.searchSongsByText(
                text,
                getQueryOpts(opts)
            );
        } catch (err) {
            console.log(err);
            throw new Error('An error occurred searching for song');
        }
    }
}

module.exports = SongsService;
