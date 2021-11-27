const { INTERNAL_SERVER_ERROR } = require('../config/constants/httpStatus');

class APIError extends Error {
    get statusCode() {
        return INTERNAL_SERVER_ERROR;
    }
}
module.exports = APIError;
