const NotFoundError = require('../errors/NotFoundError');

const computeNewPosition = (lowerBoundPosition, upperBoundPosition) =>
    (lowerBoundPosition + upperBoundPosition) / 2;

class ListService {
    constructor(datasource) {
        this.datasource = datasource;
    }

    createList(list) {
        return this.datasource.createList(list);
    }

    deleteList(list) {
        return this.datasource.deleteList(list);
    }

    getAllLists() {
        return this.datasource.getAllLists();
    }

    async getListById(listId) {
        const results = await this.datasource.getListById(listId);
        if (!results.length) {
            throw new NotFoundError('No list found with this id.');
        }
        return results[0];
    }

    async peekItem(listId) {
        const [firstItem] = await this.datasource.getTopNItemsOf(listId, 1);
        return firstItem;
    }

    // TODO
    async dequeueItem(listId) {
        const firstItem = await this.peekItem(listId);
        if (!firstItem) {
            return null;
        }
        await this.datasource.deleteListItemAtPosition(
            listId,
            firstItem.position
        );

        return firstItem;
    }

    async removeItemAtPosition(listId, position) {
        await this.datasource.deleteListItemAtPosition(listId, position);
    }

    async removeItem(listId, listItemId) {
        await this.datasource.deleteListItem(listId, listItemId);
    }

    getItems(listId, limit) {
        return this.datasource.getTopNItemsOfList(listId, limit);
    }

    async clearList(listId) {
        await this.datasource.clearList(listId);
    }

    async enqueueItem(listId, item) {
        const lastPosition = await this.datasource.getLastPositionFrom(listId);
        const positionToAdd = lastPosition + 1;
        const itemToAdd = { ...item, position: positionToAdd };
        return this.datasource.createListItem(listId, itemToAdd);
    }

    async addItemAtFront(listId, item) {
        const firstPosition = await this.datasource.getFirstPositionFor(listId);
        const positionToAdd = firstPosition - 1;
        const itemToAdd = { ...item, position: positionToAdd };
        await this.datasource.createListItem(listId, itemToAdd);
    }

    async addItemAfter(listId, position, item) {
        const upperBoundPosition = await this.datasource.getNextPositionAfter(
            listId,
            position
        );
        if (upperBoundPosition === null) {
            await this.enqueueItem(listId, item);
        } else {
            const positionToAdd = computeNewPosition(
                position,
                upperBoundPosition
            );
            const itemToAdd = { ...item, position: positionToAdd };
            await this.datasource.createListItem(listId, itemToAdd);
        }
    }

    async moveUp(listId, itemPositionToMove) {
        const twoItemsBefore = await this.datasource.getItemPositionForMoveUpOperation(
            listId,
            itemPositionToMove
        );
        if (!twoItemsBefore) {
            return this.moveItemToFront(listId, itemPositionToMove);
        }
        return this.moveItemAfter(
            listId,
            itemPositionToMove,
            twoItemsBefore.position
        );
    }

    async moveDown(listId, itemPositionToMove) {
        const nextPosition = await this.datasource.getNextPositionAfter(
            listId,
            itemPositionToMove
        );
        if (nextPosition === null) {
            return Promise.resolve();
        }
        return this.moveItemAfter(listId, itemPositionToMove, nextPosition);
    }

    async moveItemToEnd(listId, itemPositionToMove) {
        const upperBoundPosition = await this.datasource.getLastPositionFro(
            listId
        );
        const newPosition = Math.ceil(upperBoundPosition + 1); // remove deciumals to conserve space
        await this.datasource.updateItemPosition(
            listId,
            itemPositionToMove,
            newPosition
        );
    }

    async moveItemToFront(listId, itemPositionToMove) {
        const upperBoundPosition = await this.datasource.getFirstPositionFor(
            listId
        );
        const newPosition = Math.floor(upperBoundPosition - 1); // remove deciumals to conserve space
        await this.datasource.updateItemPosition(
            listId,
            itemPositionToMove,
            newPosition
        );
    }

    async moveItemAfter(listId, itemPositionToMove, afterPosition) {
        const upperBoundPosition = await this.datasource.getNextPositionAfter(
            listId,
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
        await this.datasource.updateItemPosition(
            listId,
            itemPositionToMove,
            newPosition
        );
    }
}

module.exports = ListService;
