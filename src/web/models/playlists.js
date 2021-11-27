const Joi = require('@hapi/joi');
const enqueueTypes = require('../../config/constants/enqueueType');

const moveItemBase = {
    method: Joi.string()
        .required()
        .valid(...Object.values(enqueueTypes)),
};

const baseEnqueueObject = {
    ...moveItemBase,
    songId: Joi.number()
        .integer()
        .required(),
};

const enqueueAtFront = Joi.object(baseEnqueueObject);

const enqueueAtEnd = enqueueAtFront;

const enqueueAfterItem = Joi.object({
    ...baseEnqueueObject,
    afterPosition: Joi.number().required(),
});

const moveAfterItem = Joi.object({
    ...moveItemBase,
    afterPosition: Joi.number().required(),
});

module.exports = {
    enqueueAtFront,
    enqueueAtEnd,
    enqueueAfterItem,
    moveItemBase: Joi.object(moveItemBase).unknown(true),
    moveAfterItem,
};
