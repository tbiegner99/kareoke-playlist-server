const Joi = require('@hapi/joi');

const createList = Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
        .optional()
        .allow(null),
});

const createListItem = Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
        .optional()
        .allow(null),
    quantity: Joi.number()
        .optional()
        .default(1)
        .allow(null),
    where: Joi.string()
        .optional()
        .allow(null),
    estimatedCost: Joi.number()
        .optional()
        .allow(null),
    plannedDate: Joi.date()
        .optional()
        .allow(null),
    notes: Joi.string()
        .optional()
        .allow(null),
    link: Joi.string()
        .optional()
        .allow(null),
});

module.exports = {
    createList,
    createListItem,
};
