const ReadingsService = require('../../services/readings/readings');
const httpStatus = require('../../config/constants/httpStatus');
const asyncHandler = require('../middlewares/asyncHandler');
const serializer = require('../serializers/readings');
const models = require('../models/readings');
const validator = require('../validator');

const service = new ReadingsService();

const getReadingsForZone = async (req, res) => {
    const {
        zone,
        type,
        filter,
        filterParams,
    } = serializer.fromGetReadingsRequest(req);
    const results = await service.getReadingsForZone(
        zone,
        type,
        filter,
        filterParams
    );
    const response = serializer.toGetReadingsResponse(results);
    res.status(httpStatus.OK).send(response);
};

const getZones = async (req, res) => {
    const results = await service.getZones();
    const response = serializer.toZonesResponse(results);
    res.status(httpStatus.OK).send(response);
};

const createZone = async (req, res) => {
    await validator.assertThatObjectMatchesModel(req.body, models.zone);
    const zone = serializer.fromCreateZoneRequest(req);
    const result = await service.createZone(zone);
    const response = serializer.toZoneResponse(result);
    res.status(httpStatus.CREATED).send(response);
};

const createReading = async (req, res) => {
    const { zone, type, ...data } = serializer.fromCreateReadingRequest(req);
    const model = models.getModelForReadingType(type);
    await validator.assertThatObjectMatchesModel(req.body, model);

    const result = await service.createReading(zone, type, data);
    const response = await serializer.toReadingResponse(result);
    res.status(httpStatus.OK).send(response);
};

module.exports = {
    createReading: asyncHandler(createReading),
    createZone: asyncHandler(createZone),
    getZones: asyncHandler(getZones),
    getReadingsForZone: asyncHandler(getReadingsForZone),
};
