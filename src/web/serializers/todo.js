const fromCreateListRequest = req => ({
    name: req.body.name,
    description: req.body.description,
});

const fromCreateListItemRequest = req => ({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    where: req.body.where,
    estimatedCost: req.body.estimatedCost,
    plannedDate: req.body.plannedDate,
    notes: req.body.notes,
    link: req.body.link,
});

module.exports = {
    fromCreateListRequest,
    fromCreateListItemRequest,
};
