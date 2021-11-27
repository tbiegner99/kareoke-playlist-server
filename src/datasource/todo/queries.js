const CREATE_LIST = `INSERT INTO list (name,description) VALUES (:name,:description);`;
const GET_ALL_LISTS = 'SELECT * from list';
const GET_LIST_BY_ID = `${GET_ALL_LISTS} where list_id=:listId`;
const DELETE_LIST = `DELETE FROM list WHERE list_id=:listId`;
const DELETE_LIST_ITEM_BY_ID = `DELETE FROM list_items WHERE list_id=:listId and id=:listItemId`;
const CLEAR_LIST = `DELETE FROM list_items WHERE list_id=:listId`;
const CREATE_LIST_ITEM = `INSERT INTO list_items (
    list_id, name, quantity, description, where_to_buy,estimated_cost,
priority,state,
planned_date,completed,notes,link)
VALUES
(:listId, :name, :quantity,:description, :where, :estimatedCost,
    :priority,:state,:planned_date,:completed,:notes,:link);`;
const GET_LAST_POSITION = `SELECT IFNULL(MAX(cast(priority as decimal(30,20))), 0) as priority 
from list_items 
where list_id = :listId`;

const GET_ALL_LIST_ITEMS =
    'SELECT * FROM list_items WHERE list_id=:listId order by cast(priority as decimal(30,20))';
const GET_TOP_LIST_ITEMS = `${GET_ALL_LIST_ITEMS} limit :limit`;
const DELETE_LIST_ITEM =
    'DELETE FROM list_items WHERE list_id=:listId and priority=:position';

const queries = {
    CREATE_LIST,
    GET_LIST_BY_ID,
    CREATE_LIST_ITEM,
    GET_LAST_POSITION,
    GET_ALL_LISTS,
    DELETE_LIST,
    CLEAR_LIST,
    GET_ALL_LIST_ITEMS,
    GET_TOP_LIST_ITEMS,
    DELETE_LIST_ITEM,
    DELETE_LIST_ITEM_BY_ID,
};

class QueryGenerator {
    getQuery(queryName) {
        return queries[queryName];
    }
}

module.exports = new QueryGenerator();
