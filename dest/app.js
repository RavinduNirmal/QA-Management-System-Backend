"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const routes_1 = require("./startup/routes");
const https_1 = require("https");
const fs_1 = require("fs");
const http_1 = require("http");
const logger_1 = __importDefault(require("./common/logger"));
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(body_parser_1.default.urlencoded({ limit: '10mb' }));
const isTlsEnabled = config_1.default.get("tls-enabled");
const tlsMessage = isTlsEnabled ? "TLS-enabled" : "TLS-disabled";
console.log(tlsMessage);
//app.use(express.json()); 
//app.use(bodyParser.urlencoded({limit: '10mb'}));
app.use(cors());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb' }));
(0, typeorm_1.createConnection)();
const utils_1 = require("./common/utils");
const websocket_1 = require("./services/webSocket/websocket");
const restServicePort = config_1.default.get("rest-service-port");
const wsServicePort = config_1.default.get("ws-service-port");
if (!restServicePort)
    throw new Error("rest service port is not configured");
if (!wsServicePort)
    throw new Error("web socket service port is not configured");
if (restServicePort == wsServicePort)
    throw new Error("both service ports have been conifigured to same value");
try {
    const deviceMappingAttributes = config_1.default.get("device-mapping-attributes");
    (0, utils_1.validateDeviceMappingAttribs)(deviceMappingAttributes);
}
catch (error) {
    console.log(error);
}
//start litening the rest service
const environent = process.env.NODE_ENV;
console.log("loaded " + environent + " environment");
(0, routes_1.route)(app);
isTlsEnabled ? logger_1.default.info("TLS  enabled") : logger_1.default.info("TLS disabled");
if (isTlsEnabled) {
    const server = (0, https_1.createServer)({
        cert: (0, fs_1.readFileSync)("tls/server.crt"),
        key: (0, fs_1.readFileSync)("tls/private.key"),
    });
    app.listen(restServicePort, () => {
        console.log("rest service is started at port " + restServicePort);
        //at this point we need ot start the web socket server in order to serve the requests
        (0, websocket_1.startWebSocketServer)(wsServicePort, server);
    });
}
else {
    const server = (0, http_1.createServer)();
    app.listen(restServicePort, () => {
        console.log("rest service is started at port " + restServicePort);
        //at this point we need ot start the web socket server in order to serve the requests
        (0, websocket_1.startWebSocketServer)(wsServicePort, server);
    });
}
