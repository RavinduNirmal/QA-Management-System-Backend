"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.NotAuthorized = exports.NotAllowed = exports.Forbidden = exports.SQLError = exports.NotFound = exports.Conflict = exports.BadRequest = void 0;
const statusCodes_1 = require("./statusCodes");
class BaseError extends Error {
    constructor(httpStatusCode, description) {
        super(description);
        this.statusCode = httpStatusCode;
        this.desc = description;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
    getStatusCode() {
        return this.statusCode;
    }
}
exports.default = BaseError;
class BadRequest extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.BAD_REQUEST, description);
    }
}
exports.BadRequest = BadRequest;
class Conflict extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.CONFLICT, description);
    }
}
exports.Conflict = Conflict;
class NotFound extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.NOT_FOUND, description);
    }
}
exports.NotFound = NotFound;
class SQLError extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.CONFLICT, description);
    }
}
exports.SQLError = SQLError;
class Forbidden extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.FORBIDDEN, description);
    }
}
exports.Forbidden = Forbidden;
class NotAllowed extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.NOT_ALLOWED, description);
    }
}
exports.NotAllowed = NotAllowed;
class NotAuthorized extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.NOT_AUTHORIZED, description);
    }
}
exports.NotAuthorized = NotAuthorized;
class ServerError extends BaseError {
    constructor(description) {
        super(statusCodes_1.StatusCodes.SERVER_ERROR, description);
    }
}
exports.ServerError = ServerError;
