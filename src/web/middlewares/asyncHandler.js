const httpStatus = require('../../config/constants/httpStatus');
const APIError = require('../../errors/APIError');

module.exports = func => async (req, res) => {
    try {
        await func(req, res);
        // next();
    } catch (err) {
        console.log(err);
        if (err instanceof APIError) {
            res.status(err.statusCode).send(err.message);
        } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        }
    }
};
