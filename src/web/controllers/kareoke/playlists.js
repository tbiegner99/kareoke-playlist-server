const serializer = require('../../serializers/playlists');
const models = require('../../models/playlists');
const validator = require('../../validator');
const PlaylistService = require('../../../services/kareoke/playlists');
const httpStatus = require('../../../config/constants/httpStatus');
const {
    FRONT,
    END,
    AFTER_ITEM,
    UP_ONE_POSITION,
    DOWN_ONE_POSITION,
} = require('../../../config/constants/enqueueType');

const service = new PlaylistService();

const asyncHandler = func => async (req, res) => {
    try {
        await func(req, res);
        // next();
    } catch (err) {
        // console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    }
};

const selectPlaylistItems = async (req, res) => {
    const { playlistId } = req.params;
    const { limit } = req.query;
    const response = await service.getPlaylistItems(playlistId, limit);
    res.status(httpStatus.OK).send(response);
};

const clearPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    await service.clearPlaylist(playlistId);
    res.sendStatus(httpStatus.NO_CONTENT);
};

const enqueueAtFront = async (req, playlistId) => {
    await validator.assertThatObjectMatchesModel(
        req.body,
        models.enqueueAtFront
    );
    const item = serializer.fromEnqueueAtFrontRequest(req);
    await service.addItemAtFront(playlistId, item);
};

const enqueueAfterItem = async (req, playlistId) => {
    await validator.assertThatObjectMatchesModel(
        req.body,
        models.enqueueAfterItem
    );
    const item = serializer.fromEnqueueAfterItemRequest(req);
    await service.addItemAfter(playlistId, item.afterPosition, item);
};

const enqueueAtEnd = async (req, playlistId) => {
    await validator.assertThatObjectMatchesModel(req.body, models.enqueueAtEnd);
    const item = serializer.fromEnqueueAtEndRequest(req);
    await service.enqueuePlaylistItem(playlistId, item);
};

const enqueueItem = async (req, res) => {
    const { method } = req.body;
    const { playlistId } = req.params;
    switch (method) {
        case FRONT:
            await enqueueAtFront(req, playlistId);
            break;
        case AFTER_ITEM:
            await enqueueAfterItem(req, playlistId);
            break;
        case END:
        default:
            await enqueueAtEnd(req, playlistId);
    }
    const response = await service.getPlaylistItems(playlistId);
    res.status(httpStatus.CREATED).send(response);
};

const moveAfterItem = async (req, playlistId, currentItemPosition) => {
    await validator.assertThatObjectMatchesModel(
        req.body,
        models.moveAfterItem
    );
    const item = serializer.fromEnqueueAfterItemRequest(req);
    await service.moveItemAfter(
        playlistId,
        currentItemPosition,
        item.afterPosition
    );
};

const moveItem = async (req, res) => {
    const { method } = req.body;
    const { playlistId, position: currentItemPosition } = req.params;
    await validator.assertThatObjectMatchesModel(req.body, models.moveItemBase);
    switch (method) {
        case UP_ONE_POSITION:
            await service.moveUp(playlistId, currentItemPosition);
            break;
        case DOWN_ONE_POSITION:
            await service.moveDown(playlistId, currentItemPosition);
            break;
        case FRONT:
            await service.moveItemToFront(playlistId, currentItemPosition);
            break;
        case AFTER_ITEM:
            await moveAfterItem(req, playlistId, currentItemPosition);
            break;
        case END:
        default:
            await service.moveItemToEnd(playlistId, currentItemPosition);
    }
    const response = await service.getPlaylistItems(playlistId);
    res.status(httpStatus.CREATED).send(response);
};

const removePlaylistItem = async (req, res) => {
    const { playlistId, position } = req.params;
    await service.removeItemAtPosition(playlistId, position);
    res.sendStatus(httpStatus.NO_CONTENT);
};

const dequeue = async (req, res) => {
    const { playlistId } = req.params;
    const dequeuedItem = await service.dequeuePlaylistItem(playlistId);
    if (!dequeuedItem) {
        return res.sendStatus(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.OK).send(dequeuedItem);
};

const peek = async (req, res) => {
    const { playlistId } = req.params;
    const response = await service.peekPlaylistItem(playlistId);
    if (!response) {
        return res.sendStatus(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.OK).send(response);
};

module.exports = {
    selectPlaylistItems: asyncHandler(selectPlaylistItems),
    enqueueItem: asyncHandler(enqueueItem),
    moveItem: asyncHandler(moveItem),
    clearPlaylist: asyncHandler(clearPlaylist),
    removePlaylistItem: asyncHandler(removePlaylistItem),
    dequeue: asyncHandler(dequeue),
    peek: asyncHandler(peek),
};
