"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStatus = void 0;
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["READY"] = 0] = "READY";
    ConnectionStatus[ConnectionStatus["BUSY"] = 1] = "BUSY";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
class Connection {
    constructor(socket, conStatus, deviceParams, dtBuffer) {
        this.socket = socket;
        this.connectionStatus = conStatus;
        this.deviceParams = deviceParams;
        this.dataBuffer = dtBuffer;
    }
    getSocket() {
        return this.socket;
    }
    getBuffer() {
        return this.dataBuffer;
    }
    setBuffer(data) {
        this.dataBuffer = data;
    }
    getStatus() {
        return this.connectionStatus;
    }
    setStatus(status) {
        this.connectionStatus = status;
    }
    getDeviceParams() {
        return this.deviceParams;
    }
}
exports.default = Connection;
