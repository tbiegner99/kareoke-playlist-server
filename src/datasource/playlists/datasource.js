const DBClientFactory = require('../../utils/db-client/factory');
const queries = require('./queries');
const mapper = require('./row-mapper');

class PlaylistDatasource {
    constructor() {
        this.dbClient = DBClientFactory.getClient();
    }

    async getPlaylistById(playlistId) {
        const [results] = await this.dbClient.query(
            queries.SELECT_ALL_PLAYLIST_ITEMS,
            {
                playlistId,
            }
        );
        return results.map(mapper.fromPlaylistItemRow);
    }

    async getTopNItemsOfPlaylist(playlistId, n) {
        const [results] = await this.dbClient.query(
            queries.SELECT_TOP_N_PLAYLIST_ITEMS,
            {
                playlistId,
                limit: parseInt(n, 10),
            }
        );
        return results.map(mapper.fromPlaylistItemRow);
    }

    async clearPlaylist(playlistId) {
        await this.dbClient.query(queries.CLEAR_PLAYLIST, {
            playlistId,
        });
    }

    async createPlaylistItem(playlistId, playlistItem) {
        const params = {
            playlistId,
            position: playlistItem.position,
            songId: playlistItem.songId,
        };
        await this.dbClient.query(queries.CREATE_PLAYLIST_ITEM, params);
    }

    async deletePlaylistItemAtPosition(playlistId, position) {
        await this.dbClient.query(queries.DELETE_PLAYLIST_ITEM, {
            playlistId,
            position,
        });
    }

    async getFirstPositionForPlaylist(playlistId) {
        const [results] = await this.dbClient.query(queries.FIRST_POSITION, {
            playlistId,
        });
        const { position } = results[0];
        return Number(position);
    }

    async getLastPositionFroPlaylist(playlistId) {
        const [results] = await this.dbClient.query(queries.LAST_POSITION, {
            playlistId,
        });
        const { position } = results[0];
        return Number(position);
    }

    async getNextPositionAfter(playlistId, position) {
        const [results] = await this.dbClient.query(queries.NEXT_POSITION, {
            playlistId,
            position,
        });

        if (!results.length) {
            return null;
        }

        const { nextPosition } = results[0];
        return Number(nextPosition);
    }

    async updateItemPosition(playlistId, currentPosition, newPosition) {
        await this.dbClient.query(queries.MOVE_PLAYLIST_ITEM, {
            playlistId,
            position: currentPosition,
            newPosition,
        });
    }

    async getItemPositionForMoveUpOperation(playlistId, position) {
        const [results] = await this.dbClient.query(
            queries.SELECT_MOVE_UP_ITEM_AFTER,
            {
                playlistId,
                position,
            }
        );
        if (!results.length) {
            return null;
        }
        return mapper.fromPlaylistItemRow(results[0]);
    }
}

module.exports = PlaylistDatasource;
