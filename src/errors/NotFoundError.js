const { NOT_FOUND } = require('../config/constants/httpStatus');
const APIError = require('./APIError');

class NotFoundError extends APIError {
    get statusCode() {
        return NOT_FOUND;
    }
}

module.exports = NotFoundError;
