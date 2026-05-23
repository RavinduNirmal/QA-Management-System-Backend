"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = void 0;
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    StatusCodes[StatusCodes["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCodes[StatusCodes["CONFLICT"] = 409] = "CONFLICT";
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCodes[StatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCodes[StatusCodes["NOT_ALLOWED"] = 405] = "NOT_ALLOWED";
    StatusCodes[StatusCodes["NOT_AUTHORIZED"] = 401] = "NOT_AUTHORIZED";
})(StatusCodes = exports.StatusCodes || (exports.StatusCodes = {}));
