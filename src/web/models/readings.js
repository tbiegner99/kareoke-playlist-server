const Joi = require('@hapi/joi');
const { types } = require('../../config/constants/readings');

const zone = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

const temperatureReading = Joi.object({
    temperature: Joi.number().required(),
});
const humidityReading = Joi.object({
    humidity: Joi.number().required(),
});

const getModelForReadingType = type => {
    switch (type) {
        case types.HUMIDITY:
            return humidityReading;
        case types.TEMPERATURE:
            return temperatureReading;
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
};
module.exports = {
    zone,

    getModelForReadingType,
};
