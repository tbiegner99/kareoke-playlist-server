const fs = require('fs').promises;
const path = require('path');
const PlaylistDatasource = require('../../datasource/playlists/datasource');

const computeNewPosition = (lowerBoundPosition, upperBoundPosition) =>
    (lowerBoundPosition + upperBoundPosition) / 2;

const NUMBER_OF_ITEMS_IN_PLAYLIST_FILE = 5;
const PLAYLIST_FILE = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'playlistFile',
    'upNext.txt'
);

class PlaylistService {
    constructor() {
        this.playlistDatasource = new PlaylistDatasource();
    }

    async updatePlaylistFile(playlistId) {
        const playlistItems = await this.playlistDatasource.getTopNItemsOfPlaylist(
            playlistId,
            NUMBER_OF_ITEMS_IN_PLAYLIST_FILE
        );
        let fileString = '';
        playlistItems.forEach((item, index) => {
            fileString += `${index + 1}. ${item.artist} - ${item.title}  `;
        });
        fileString = fileString.padEnd(200, ' ');
        await fs.writeFile(PLAYLIST_FILE, fileString);
    }

    async peekPlaylistItem(playlistId) {
        const [
            firstItem,
        ] = await this.playlistDatasource.getTopNItemsOfPlaylist(playlistId, 1);
        return firstItem;
    }

    async dequeuePlaylistItem(playlistId) {
        const firstItem = await this.peekPlaylistItem(playlistId);
        if (!firstItem) {
            return null;
        }
        await this.playlistDatasource.deletePlaylistItemAtPosition(
            playlistId,
            firstItem.position
        );
        await this.updatePlaylistFile(playlistId);
        return firstItem;
    }

    async removeItemAtPosition(playlistId, position) {
        await this.playlistDatasource.deletePlaylistItemAtPosition(
            playlistId,
            position
        );
        await this.updatePlaylistFile(playlistId);
    }

    getPlaylistItems(playlistId, limit) {
        if (Number.isNaN(Number(limit)) || limit <= 0) {
            return this.playlistDatasource.getPlaylistById(playlistId);
        }
        return this.playlistDatasource.getTopNItemsOfPlaylist(
            playlistId,
            limit
        );
    }

    async clearPlaylist(playlistId) {
        await this.playlistDatasource.clearPlaylist(playlistId);
        await this.updatePlaylistFile(playlistId);
    }

    async enqueuePlaylistItem(playlistId, playlistItem) {
        const lastPosition = await this.playlistDatasource.getLastPositionFroPlaylist(
            playlistId
        );
        const positionToAdd = lastPosition + 1;
        const itemToAdd = { ...playlistItem, position: positionToAdd };
        await this.playlistDatasource.createPlaylistItem(playlistId, itemToAdd);
        await this.updatePlaylistFile(playlistId);
    }

    async addItemAtFront(playlistId, playlistItem) {
        const firstPosition = await this.playlistDatasource.getFirstPositionForPlaylist(
            playlistId
        );
        const positionToAdd = firstPosition - 1;
        const itemToAdd = { ...playlistItem, position: positionToAdd };
        await this.playlistDatasource.createPlaylistItem(playlistId, itemToAdd);
        await this.updatePlaylistFile(playlistId);
    }

    async addItemAfter(playlistId, position, playlistItem) {
        const upperBoundPosition = await this.playlistDatasource.getNextPositionAfter(
            playlistId,
            position
        );
        if (upperBoundPosition === null) {
            await this.enqueuePlaylistItem(playlistId, playlistItem);
        } else {
            const positionToAdd = computeNewPosition(
                position,
                upperBoundPosition
            );
            const itemToAdd = { ...playlistItem, position: positionToAdd };
            await this.playlistDatasource.createPlaylistItem(
                playlistId,
                itemToAdd
            );
            await this.updatePlaylistFile(playlistId);
        }
    }

    async moveUp(playlistId, itemPositionToMove) {
        const twoItemsBefore = await this.playlistDatasource.getItemPositionForMoveUpOperation(
            playlistId,
            itemPositionToMove
        );
        if (!twoItemsBefore) {
            return this.moveItemToFront(playlistId, itemPositionToMove);
        }
        return this.moveItemAfter(
            playlistId,
            itemPositionToMove,
            twoItemsBefore.position
        );
    }

    async moveDown(playlistId, itemPositionToMove) {
        const nextPosition = await this.playlistDatasource.getNextPositionAfter(
            playlistId,
            itemPositionToMove
        );
        if (nextPosition === null) {
            return Promise.resolve();
        }
        return this.moveItemAfter(playlistId, itemPositionToMove, nextPosition);
    }

    async moveItemToEnd(playlistId, itemPositionToMove) {
        const upperBoundPosition = await this.playlistDatasource.getLastPositionFroPlaylist(
            playlistId
        );
        const newPosition = Math.ceil(upperBoundPosition + 1); // remove deciumals to conserve space
        await this.playlistDatasource.updateItemPosition(
            playlistId,
            itemPositionToMove,
            newPosition
        );
        await this.updatePlaylistFile(playlistId);
    }

    async moveItemToFront(playlistId, itemPositionToMove) {
        const upperBoundPosition = await this.playlistDatasource.getFirstPositionForPlaylist(
            playlistId
        );
        const newPosition = Math.floor(upperBoundPosition - 1); // remove deciumals to conserve space
        await this.playlistDatasource.updateItemPosition(
            playlistId,
            itemPositionToMove,
            newPosition
        );
        await this.updatePlaylistFile(playlistId);
    }

    async moveItemAfter(playlistId, itemPositionToMove, afterPosition) {
        const upperBoundPosition = await this.playlistDatasource.getNextPositionAfter(
            playlistId,
            afterPosition
        );
        let newPosition;
        if (upperBoundPosition === Number(itemPositionToMove)) {
            return; // moving to same place
        }
        if (upperBoundPosition === null) {
            // moving to end of list
            newPosition = Math.ceil(afterPosition + 1);
        } else {
            newPosition = computeNewPosition(afterPosition, upperBoundPosition);
        }
        await this.playlistDatasource.updateItemPosition(
            playlistId,
            itemPositionToMove,
            newPosition
        );
        await this.updatePlaylistFile(playlistId);
    }
}

module.exports = PlaylistService;
