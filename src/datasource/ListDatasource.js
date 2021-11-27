const queries = {
    CREATE_LIST: 'CREATE_LIST',
    GET_LIST_BY_ID: 'GET_LIST_BY_ID',
    CREATE_LIST_ITEM: 'CREATE_LIST_ITEM',
    GET_LAST_POSITION: 'GET_LAST_POSITION',
    GET_ALL_LISTS: 'GET_ALL_LISTS',
    DELETE_LIST: 'DELETE_LIST',
    CLEAR_LIST: 'CLEAR_LIST',
    GET_ALL_LIST_ITEMS: 'GET_ALL_LIST_ITEMS',
    GET_TOP_LIST_ITEMS: 'GET_TOP_LIST_ITEMS',
    DELETE_LIST_ITEM: 'DELETE_LIST_ITEM',
    DELETE_LIST_ITEM_BY_ID: 'DELETE_LIST_ITEM_BY_ID',
};

class ListDatasource {
    constructor(serializer, queryGenerator, dbClient) {
        this.client = dbClient;
        this.mapper = serializer;
        this.queryGenerator = queryGenerator;
    }

    async createList(list) {
        const query = this.queryGenerator.getQuery(queries.CREATE_LIST);

        const [result] = await this.client.query(
            query,
            this.mapper.toCreateListParams(list)
        );

        return { listId: result.insertId, ...list };
    }

    async getListById(listId) {
        const query = this.queryGenerator.getQuery(queries.GET_LIST_BY_ID);

        const [results] = await this.client.query(
            query,
            this.mapper.toListByIdParams({ listId })
        );

        return results.map(this.mapper.fromListRow);
    }

    async deleteList(listId) {
        const query = this.queryGenerator.getQuery(queries.DELETE_LIST);
        await this.clearList(listId);
        return this.client.query(
            query,
            this.mapper.toDeleteListParams({ listId })
        );
    }

    async getAllLists() {
        const query = this.queryGenerator.getQuery(queries.GET_ALL_LISTS);

        const [results] = await this.client.query(query);

        return results.map(this.mapper.fromListRow);
    }

    async createListItem(listId, listItem) {
        const itemToInsert = this.mapper.toCreateListItemParams(
            listId,
            listItem
        );
        const [result] = await this.client.query(
            this.queryGenerator.getQuery(queries.CREATE_LIST_ITEM),
            itemToInsert
        );
        return { itemId: result.insertId, ...itemToInsert };
    }

    async getTopNItemsOfList(listId, n) {
        let query;
        if (Number.isNaN(Number(n)) || n <= 0) {
            query = this.queryGenerator.getQuery(queries.GET_ALL_LIST_ITEMS);
        } else {
            query = this.queryGenerator.getQuery(queries.GET_TOP_LIST_ITEMS);
        }
        const params = this.mapper.toTopListItemParameters({
            listId,
            limit: n,
        });

        const [results] = await this.client.query(query, params);

        return results.map(this.mapper.fromListItemRow);
    }

    async clearList(listId) {
        const params = this.mapper.toClearListParams({
            listId,
        });
        const query = this.queryGenerator.getQuery(queries.CLEAR_LIST);
        await this.client.query(query, params);
    }

    async deleteListItemAtPosition(listId, position) {
        const query = this.queryGenerator.getQuery(queries.DELETE_LIST_ITEM);
        const params = this.mapper.toDeleteItemParams({
            listId,
            position,
        });
        await this.client.query(query, params);
    }

    async deleteListItem(listId, listItemId) {
        const query = this.queryGenerator.getQuery(
            queries.DELETE_LIST_ITEM_BY_ID
        );
        const params = this.mapper.toDeleteItemParams({
            listId,
            listItemId,
        });
        await this.client.query(query, params);
    }

    async getFirstPositionFor(listId) {
        const [results] = await this.client.query(queries.FIRST_POSITION, {
            listId,
        });
        const { position } = results[0];
        return Number(position);
    }

    async getLastPositionFrom(listId) {
        const query = this.queryGenerator.getQuery(queries.GET_LAST_POSITION);

        const [results] = await this.client.query(
            query,
            this.mapper.toListByIdParams({ listId })
        );

        const position = this.mapper.fromPositionResult(results[0]);
        return Number(position);
    }

    async getNextPositionAfter(listId, position) {
        const [results] = await this.client.query(queries.NEXT_POSITION, {
            listId,
            position,
        });

        if (!results.length) {
            return null;
        }

        const { nextPosition } = results[0];
        return Number(nextPosition);
    }

    async updateItemPosition(listId, currentPosition, newPosition) {
        await this.client.query(queries.MOVE_List_ITEM, {
            listId,
            position: currentPosition,
            newPosition,
        });
    }

    async getItemPositionForMoveUpOperation(listId, position) {
        const [results] = await this.client.query(
            queries.SELECT_MOVE_UP_ITEM_AFTER,
            {
                listId,
                position,
            }
        );
        if (!results.length) {
            return null;
        }
        return this.mapper.fromListItemRow(results[0]);
    }
}

module.exports = ListDatasource;
