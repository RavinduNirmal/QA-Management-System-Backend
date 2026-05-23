"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseFromTerminal = exports.startWebSocketServer = void 0;
const hashmap_1 = __importDefault(require("hashmap"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./../../common/logger"));
const connection_1 = __importStar(require("./connection"));
const dbConfig_1 = require("../../database/dbConfig");
const utils_1 = require("./../../common/utils");
const userDefinedMapping = config_1.default.get("device-mapping-attributes");
const ws_1 = require("ws");
const errorDesc_1 = __importDefault(require("./../../common/errorDesc"));
let heartBeatInterval = config_1.default.get("hb-interval"); //This should have been configured in seconds
if (!heartBeatInterval)
    heartBeatInterval = 30000;
else
    heartBeatInterval *= 1000;
let checkResponseResolution = 250; //client buffer is checked every 200 ms
let clientResponseWaitTimeout = config_1.default.get("client-response-wait-timemout"); //how long the call should wait till a client is responsed
if (!clientResponseWaitTimeout || clientResponseWaitTimeout == 0)
    clientResponseWaitTimeout = 10;
const connectionPool = new hashmap_1.default();
console.log("================loading configurations=======================================");
console.log("ping-pong heart beat interval : " + heartBeatInterval + " ms");
console.log("client response wait timeout : " + clientResponseWaitTimeout + " seconds");
console.log("device mapping attributes : " + config_1.default.get("device-mapping-attributes"));
console.log("================loading configurations (end)=================================\n\n");
function startWebSocketServer(wsServicePort, server) {
    //load the mapping file here
    const userDefinedMappingMethods = config_1.default.get("device-mapping-attributes");
    const mapBranchCode = config_1.default.get("map-branch-code");
    //const deviceMap = loadMappingFileData(userDefinedMappingMethods, mapBranchCode);
    //console.log("usermapping: ",deviceMap)
    //create the ws server instance
    const wsServer = new ws_1.WebSocketServer({ server, clientTracking: false });
    server.listen(wsServicePort, () => {
        console.log("web socket service started at port " + wsServicePort);
    });
    wsServer.on("connection", (webSocket, request) => {
        logger_1.default.info("Terminal connected from " + request.socket.remoteAddress);
        webSocket.on("message", (data) => {
            try {
                let responseJson;
                let clientData;
                try {
                    //The client is supposed to send the registration message as its initial message
                    clientData = data.toString();
                    responseJson = JSON.parse(clientData);
                }
                catch (error) {
                    webSocket.send(JSON.stringify(errorDesc_1.default.INVALID_FORMAT));
                    return;
                }
                //data formatting is ok
                if (webSocket.initialMessage === undefined || webSocket.initialMessage == true) {
                    const incomingDeviceParam = responseJson;
                    console.log("Incoming Params: ", incomingDeviceParam);
                    const valid = (0, utils_1.validateRegistrationMessage)(incomingDeviceParam);
                    if (!valid)
                        return (0, utils_1.abortConnectionWithMessage)(webSocket, valid);
                    const queryString = `SELECT EXISTS (SELECT 
            b.branch_code As branchCode,
            b.id As branch_id,
            d.id As deviceID,
            d.serial_number AS serial_number
          FROM branch AS b, device AS d 
          WHERE b.id = d.branch_id && d.serial_number = ` + incomingDeviceParam.serialNo + `&& mid = ` + incomingDeviceParam.merchantId + ` && tid= ` + incomingDeviceParam.terminalId + ` ) as result;`;
                    //now we have recieved a valid object, now we must check whther this particular terminal is allowed to connect , so we search the
                    //through the device map in order to find the whether the device is allowed by the bank to connect , we need to check whether all
                    //params which were set are matching with the device sent parameters
                    let foundDeviceParam;
                    dbConfig_1.db.query(queryString, (err, result) => {
                        if (err) {
                            (err);
                        }
                        const matchDeviceSerial = result;
                        matchDeviceSerial.forEach(deviceSerial => {
                            foundDeviceParam = deviceSerial.result;
                        });
                        console.log("Valid Serial: ", foundDeviceParam);
                        if (foundDeviceParam === 0)
                            return (0, utils_1.abortConnectionWithMessage)(webSocket, errorDesc_1.default.REGISTRATION_FAILED);
                        const tmp = incomingDeviceParam.serialNo;
                        let matched = false;
                        if (foundDeviceParam === 1) {
                            matched = true;
                        }
                        const key = (0, utils_1.buildSearchKey)(tmp);
                        // abort the connection if its already connected
                        if (connectionPool.has(key))
                            return (0, utils_1.abortConnectionWithMessage)(webSocket, errorDesc_1.default.DEVICE_ALREADY_REGISTERED);
                        //this is a new registration, so take the connection in
                        const connection = new connection_1.default(webSocket, connection_1.ConnectionStatus.READY, incomingDeviceParam, null);
                        connectionPool.set(key, connection);
                        //attach necessary book keeping data
                        webSocket.initialMessage = false;
                        webSocket.isAlive = true;
                        webSocket.key = key;
                        (0, utils_1.sendStatus)(webSocket, errorDesc_1.default.REQUEST_SUCCESSFUL);
                    });
                    // deviceMap.forEach((deviceParam: any) => {
                    //   let keys = Object.keys(deviceParam);
                    //   console.log("keys",keys)
                    //   keys.forEach((key) => {
                    //     const items = deviceParam[key].split(" ");
                    //     console.log("itemsWebS:", items)
                    //     for (const element of items) {
                    //       if (incomingDeviceParam[key] == element) {
                    //         foundDeviceParam = { ...deviceParam };
                    //         foundDeviceParam[key] = element;
                    //         break;
                    //       }
                    //     }
                    //     if (foundDeviceParam) return;
                    //   });
                    // });
                    // if (!validateSerial)
                    //   return abortConnectionWithMessage(webSocket, ErrorDesc.REGISTRATION_FAILED);
                    //we have matched a sinlge param, now we need to check other params
                    // let allMatched = true;
                    // for (const item of userDefinedMappingMethods) {
                    //   if (foundDeviceParam[item] !== incomingDeviceParam[item]) {
                    //     allMatched = false;
                    //     break;
                    //   }
                    // }
                    // if (!allMatched)
                    //   return abortConnectionWithMessage(webSocket, ErrorDesc.REGISTRATION_FAILED);              
                    //generate the key
                    // const tmp = incomingDeviceParam;
                    // console.log("temp",tmp)
                    // let keys = Object.keys(tmp);
                    // keys.forEach((key) => {
                    //   let matched = false;
                    //   for (const item of userDefinedMapping) {
                    //     if (item === key) {
                    //       matched = true;
                    //       return;
                    //     }
                    //   }
                    //   console.log("TEmpkey", tmp[key])
                    //   if (!matched) delete tmp[key];
                    // });
                    // console.log("tmp", tmp)
                    // const key = buildSearchKey(tmp);
                    // console.log("KEy", key)
                    //abort the connection if its already connected
                    // if (connectionPool.has(key))
                    //   return abortConnectionWithMessage(webSocket, ErrorDesc.DEVICE_ALREADY_REGISTERED);
                    // //this is a new registration, so take the connection in
                    // const connection: Connection = new Connection(
                    //   webSocket,
                    //   ConnectionStatus.READY,
                    //   incomingDeviceParam,
                    //   null
                    // );
                    // connectionPool.set(key, connection);
                    // //attach necessary book keeping data
                    // webSocket.initialMessage = false;
                    // webSocket.isAlive = true;
                    // webSocket.key = key;
                    // sendStatus(webSocket, ErrorDesc.REQUEST_SUCCESSFUL);
                }
                else {
                    //this is a successfully registered terminal, so the reugular communication switchin happens here
                    const dataType = responseJson.dataType;
                    const connection = connectionPool.get(webSocket.key);
                    if (dataType == null) {
                        (0, utils_1.abortConnectionWithMessage)(webSocket, errorDesc_1.default.NO_VALID_FIELDS);
                        connection.setBuffer("terminated");
                        return;
                    }
                    if (dataType == "ack" || dataType == "ACK") {
                        //here we just ignore teh ack, since there is no real use of sending this ack to the caller
                        //console.log("ack recieved");
                    }
                    else {
                        //other wise any response should be set towards the requester
                        console.log(clientData);
                        connection.setBuffer(clientData);
                        //need to clear the busy status of the connection, so the connection can readily accept the next command from the caller
                        if (connection.getStatus() == connection_1.ConnectionStatus.BUSY)
                            connection.setStatus(connection_1.ConnectionStatus.READY);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        webSocket.on("pong", () => {
            webSocket.isAlive = true;
        });
        webSocket.on("close", () => {
            const key = webSocket.key;
            if (connectionPool.has(key)) {
                const params = connectionPool.get(key).getDeviceParams();
                console.log("client connection lost " + JSON.stringify(params) + ": removed");
                connectionPool.delete(key);
            }
        });
    });
    let pingPongTimer = setInterval(() => {
        connectionPool.forEach((connection, key) => {
            if (connection.getSocket().isAlive === false) {
                //the client has not sent the pong message , so we must destroy the connection
                connection.getSocket().terminate();
                connectionPool.delete(key);
                logger_1.default.debug("connection was removed due to inactivity " + connection.getDeviceParams().toString());
            }
            connection.getSocket().isAlive = false;
            connection.getSocket().ping();
        });
    }, heartBeatInterval);
    wsServer.on("close", () => {
        clearInterval(pingPongTimer);
    });
}
exports.startWebSocketServer = startWebSocketServer;
function getResponseFromTerminal(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const target = transaction.target;
        //remove the nulliefied fields from the target
        const keys = Object.keys(target);
        keys.forEach((key) => {
            if (target[key] == null)
                delete target[key];
        });
        //build the key to check the device in the connection pool
        const key = (0, utils_1.buildSearchKey)(target);
        const exist = connectionPool.has(key);
        if (!exist)
            throw errorDesc_1.default.DEVICE_NOT_CONNECTED;
        //device is connected, we check whether the device is already in an operation
        const connection = connectionPool.get(key);
        if (connection.getStatus() == connection_1.ConnectionStatus.BUSY)
            throw errorDesc_1.default.DEVICE_OPERATION_PENDING;
        //device is in ready state, we send the request to the target device
        delete transaction.target;
        connection.setStatus(connection_1.ConnectionStatus.BUSY);
        const senData = JSON.stringify(transaction);
        connection.setBuffer(null); //clear the buffer
        connection.getSocket().send(senData);
        //now this request should wait till the data is recieved
        return new Promise((res, rej) => {
            let waitingTime = 0;
            const timeout = clientResponseWaitTimeout * 1000; //seconds
            const waitTimer = setInterval(() => {
                //we check the response buffer of the client in a loosed loop
                let buffer = connection.getBuffer();
                if (buffer != null) {
                    if (buffer == "terminated") {
                        clearInterval(waitTimer);
                        return rej(errorDesc_1.default.CLIENT_DEVICE_CONNECTION_TERMINATED);
                    }
                    logger_1.default.info("device response " + buffer);
                    buffer = JSON.parse(buffer);
                    if (buffer.dataType && buffer.dataType != "ACK") {
                        clearInterval(waitTimer);
                        connection.setBuffer(null);
                        connection.setStatus(connection_1.ConnectionStatus.READY);
                        return res(buffer);
                    }
                }
                waitingTime += checkResponseResolution;
                if (waitingTime >= timeout) {
                    clearInterval(waitTimer);
                    //we set the device to ready status after a time out occurs
                    connection.setStatus(connection_1.ConnectionStatus.READY);
                    return rej(errorDesc_1.default.DEVICE_OPERATION_TIMEOUT);
                }
            }, checkResponseResolution);
        });
    });
}
exports.getResponseFromTerminal = getResponseFromTerminal;
