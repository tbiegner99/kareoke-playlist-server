const serializer = require('../../serializers/songs');
const models = require('../../models/songs');
const validator = require('../../validator');
const SongsService = require('../../../services/kareoke/songs');
const httpStatus = require('../../../config/constants/httpStatus');
const {
    TEXT,
    TITLE,
    ARTIST,
    ID,
} = require('../../../config/constants/searchModes');
const { SHORT, FULL } = require('../../../config/constants/searchResultType');

const service = new SongsService();

const asyncHandler = func => async (req, res, next) => {
    try {
        await func(req, res);
        next();
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    }
};

const createSong = async (req, res) => {
    await validator.assertThatObjectMatchesModel(req.body, models.create);
    const song = serializer.fromCreateRequest(req);
    const createdObject = await service.createSong(song);
    res.status(httpStatus.CREATED).send(createdObject);
};

const searchSong = async (req, res) => {
    await validator.assertThatObjectMatchesModel(req.body, models.search);
    const { query, searchMode, exact = false, resultType = SHORT } = req.body;
    const { limit } = req.query;
    const opts = {
        limit,
        exact,
        fullSearch: resultType === FULL,
    };
    let song;
    let results;
    switch (searchMode) {
        case TITLE:
            results = await service.searchSongsByTitle(query, opts);
            break;
        case ARTIST:
            results = await service.searchSongsByArtist(query, opts);
            break;
        case ID:
            try {
                song = await service.getSongById(query);
                results = [song];
            } catch (err) {
                results = [];
            }
            break;
        case TEXT:
        default:
            results = await service.searchSongsByText(query, opts);
            break;
    }

    res.status(httpStatus.OK).send(results);
};

const getSongById = async (req, res) => {
    const { id } = req.params;

    const song = await service.getSongById(id);

    res.status(httpStatus.OK).send(song);
};

const getAllSongs = async (req, res) => {
    const songs = await service.getAllSongs();

    res.status(httpStatus.OK).send(songs);
};

const deleteSongById = async (req, res) => {
    const { id } = req.params;

    await service.deleteSong(id);

    res.sendStatus(httpStatus.NO_CONTENT);
};

module.exports = {
    createSong: asyncHandler(createSong),
    searchSong: asyncHandler(searchSong),
    getSongById: asyncHandler(getSongById),
    deleteSongById: asyncHandler(deleteSongById),
    getAllSongs: asyncHandler(getAllSongs),
};
