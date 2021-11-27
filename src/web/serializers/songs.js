const fromCreateRequest = req => ({
    title: req.body.title,
    artist: req.body.artist,
    source: req.body.source,
    filename: req.body.filename,
});

module.exports = {
    fromCreateRequest,
};
