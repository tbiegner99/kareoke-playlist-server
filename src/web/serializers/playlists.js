const fromEnqueueAtFrontRequest = req => ({
    songId: req.body.songId,
});
const fromEnqueueAfterItemRequest = req => ({
    ...fromEnqueueAtFrontRequest(req),
    afterPosition: req.body.afterPosition,
});

module.exports = {
    fromEnqueueAfterItemRequest,
    fromEnqueueAtFrontRequest,
    fromEnqueueAtEndRequest: fromEnqueueAtFrontRequest,
};
