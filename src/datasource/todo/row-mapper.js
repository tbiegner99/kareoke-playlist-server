const moment = require('moment');

const itemStates = {
    QUEUED: 'QUEUED',
};

const getListId = params => {
    return {
        listId: params.listId,
    };
};
const asDate = value => {
    if (!value) {
        return null;
    }
    return moment(value);
};

class ToDoListRowMapper {
    fromListRow(item) {
        return {
            listId: item.list_id,
            name: item.name,
            description: item.description,
            created: moment(item.created),
        };
    }

    fromListItemRow(item) {
        return {
            itemId: item.id,
            listId: item.list_id,
            name: item.name,
            quantity: item.quantity || 1,
            description: item.description,
            whereToBuy: item.where_to_buy,
            estimatedCost: item.estimated_cost,
            priority: item.priority,
            state: item.state,
            plannedDate: asDate(item.planned_date),
            completed: asDate(item.completed),
            notes: item.notes,
            link: item.link,
            created: asDate(item.created),
        };
    }

    fromPositionResult(result) {
        return result.priority;
    }

    toTopListItemParameters(params) {
        return {
            listId: params.listId,
            limit: Number(params.limit),
        };
    }

    toDeleteItemParams(params) {
        return {
            listId: params.listId,
            position: params.position,
            listItemId: params.listItemId,
        };
    }

    toClearListParams(params) {
        return getListId(params);
    }

    toDeleteListParams(params) {
        return getListId(params);
    }

    toListByIdParams(params) {
        return getListId(params);
    }

    toCreateListParams(list) {
        return {
            name: list.name,
            description: list.description,
        };
    }

    toCreateListItemParams(listId, listItem) {
        return {
            listId,
            name: listItem.name,
            quantity: listItem.quantity || 1,
            description: listItem.description,
            where: listItem.where,
            estimatedCost: listItem.estimatedCost,
            priority: listItem.position,
            state: itemStates.QUEUED,
            plannedDate: listItem.plannedDate,
            completed: null,
            notes: listItem.notes,
            link: listItem.link,
        };
    }
}

module.exports = new ToDoListRowMapper();
