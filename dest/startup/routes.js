"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const rest_1 = __importDefault(require("../services/rest"));
function route(app) {
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    app.use("/api/v1/ecrTrans/", rest_1.default);
}
exports.route = route;
