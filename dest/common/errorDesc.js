"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorDesc = Object.freeze({
    REQUEST_SUCCESSFUL: {
        error: 0,
        errorDesc: "successful",
    },
    REG_MESSAGE_INCOMPLETE: {
        error: 1,
        errorDesc: "registration message does not have reuired attributes",
    },
    REG_MESSAGE_EMPTY: {
        error: 2,
        errorDesc: "registration message empty",
    },
    INVALID_FORMAT: {
        error: 3,
        errorDesc: "unable to parse data",
    },
    REGISTRATION_FAILED: {
        error: 4,
        errorDesc: "terminal is not configured at the server as a valid terminal",
    },
    DEVICE_ALREADY_REGISTERED: {
        error: 5,
        errorDesc: "device already registered",
    },
    DEVICE_NOT_CONNECTED: {
        error: 100,
        errorDesc: "device is not connected",
    },
    DEVICE_OPERATION_PENDING: {
        error: 101,
        errorDesc: "device is busy",
    },
    DEVICE_OPERATION_TIMEOUT: {
        error: 102,
        errorDesc: "device operation timeout",
    },
    NO_VALID_FIELDS: {
        error: 105,
        errorDesc: "no data or dataType field found, both are required",
    },
    CLIENT_DEVICE_CONNECTION_TERMINATED: {
        error: 106,
        errorDesc: "client device connection terminated",
    },
});
exports.default = ErrorDesc;
