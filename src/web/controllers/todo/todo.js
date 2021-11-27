const serializer = require('../../serializers/todo');
const models = require('../../models/todo');
const validator = require('../../validator');
const ToDoListService = require('../../../services/todo/items');
const httpStatus = require('../../../config/constants/httpStatus');
const asyncHandler = require('../../middlewares/asyncHandler');

const service = new ToDoListService();

const createList = async (req, res) => {
    await validator.assertThatObjectMatchesModel(req.body, models.createList);
    const list = serializer.fromCreateListRequest(req);
    const createdObject = await service.createList(list);
    res.status(httpStatus.CREATED).send(createdObject);
};

const getList = async (req, res) => {
    const listObject = await service.getListById(req.params.listId);
    res.status(httpStatus.OK).send(listObject);
};

const getListItems = async (req, res) => {
    const { top } = req.query;
    const listObject = await service.getItems(req.params.listId, top);
    res.status(httpStatus.OK).send(listObject);
};

const getAllLists = async (req, res) => {
    const listObjects = await service.getAllLists();
    res.status(httpStatus.OK).send(listObjects);
};

const createListItem = async (req, res) => {
    const { listId } = req.params;
    await validator.assertThatObjectMatchesModel(
        req.body,
        models.createListItem
    );
    const listItem = serializer.fromCreateListRequest(req);
    const createdObject = await service.enqueueItem(listId, listItem);
    res.status(httpStatus.CREATED).send(createdObject);
};

const deleteList = async (req, res) => {
    await service.deleteList(req.params.listId);
    res.sendStatus(httpStatus.NO_CONTENT);
};

const deleteListItem = async (req, res) => {
    const { listId, itemId } = req.params;
    await service.removeItem(listId, itemId);
    res.sendStatus(httpStatus.NO_CONTENT);
};

const clearList = async (req, res) => {
    await service.clearList(req.params.listId);
    res.sendStatus(httpStatus.NO_CONTENT);
};

module.exports = {
    createList: asyncHandler(createList),
    getList: asyncHandler(getList),
    createListItem: asyncHandler(createListItem),
    getAllLists: asyncHandler(getAllLists),
    getListItems: asyncHandler(getListItems),
    deleteList: asyncHandler(deleteList),
    clearList: asyncHandler(clearList),
    deleteListItem: asyncHandler(deleteListItem),
};
