const TVChannelsService = require('../../services/tv/channels');
const TVGuideService = require('../../services/tv/guide');
const httpStatus = require('../../config/constants/httpStatus');
const asyncHandler = require('../middlewares/asyncHandler');

const service = new TVChannelsService();
const guideService = new TVGuideService();

const importChannels = async (req, res) => {
    await service.importChannels();
    res.sendStatus(httpStatus.NO_CONTENT);
};

const updateGuide = async (req, res) => {
    await guideService.updateGuide();
    res.sendStatus(httpStatus.NO_CONTENT);
};

const loadGuide = async (req, res) => {
    const response = await guideService.loadGuide();
    res.status(httpStatus.OK).send(response);
};

const loadGuideForChannel = async (req, res) => {
    const response = await guideService.loadGuideForChannelNumber(
        req.params.channelNumber
    );
    res.status(httpStatus.OK).send(response);
};

const loadAllChannels = async (req, res) => {
    const response = await service.loadChannels();
    res.status(httpStatus.OK).send(response);
};

const loadHDChannels = async (req, res) => {
    const response = await service.loadHDChannels();
    res.status(httpStatus.OK).send(response);
};

const loadSDChannels = async (req, res) => {
    const response = await service.loadSDChannels();
    res.status(httpStatus.OK).send(response);
};

module.exports = {
    importChannels: asyncHandler(importChannels),
    loadAllChannels: asyncHandler(loadAllChannels),
    loadHDChannels: asyncHandler(loadHDChannels),
    loadSDChannels: asyncHandler(loadSDChannels),
    updateGuide: asyncHandler(updateGuide),
    loadGuide: asyncHandler(loadGuide),
    loadGuideForChannel: asyncHandler(loadGuideForChannel),
};
