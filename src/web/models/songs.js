const Joi = require('@hapi/joi');
const searchModes = require('../../config/constants/searchModes');
const resultTypes = require('../../config/constants/searchResultType');

const create = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    source: Joi.string().optional(),
    filename: Joi.string().required(),
});

const search = Joi.object({
    exact: Joi.bool().optional(),
    resultType: Joi.string()
        .optional()
        .valid(...Object.values(resultTypes)),
    searchMode: Joi.string()
        .required()
        .valid(...Object.values(searchModes)),
    query: Joi.string()
        .min(3)
        .required(),
});

module.exports = {
    create,
    search,
};
