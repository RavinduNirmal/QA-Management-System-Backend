"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = __importDefault(require("./baseError"));
const logger_1 = __importDefault(require("./logger"));
const statusCodes_1 = require("./statusCodes");
function handleError(error, res) {
    if (error instanceof baseError_1.default) {
        logger_1.default.error(error.desc);
        return res.status(error.statusCode).send(error.desc);
    }
    else {
        console.log(error);
        return res.status(statusCodes_1.StatusCodes.SERVER_ERROR);
    }
}
exports.default = handleError;
