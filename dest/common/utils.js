"use strict";
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
exports.auditCreate = exports.initialUser = exports.createPermission = exports.createResource = exports.createRoles = exports.createUser = exports.matchBranchSerial = exports.verifyTargeData = exports.buildSearchKey = exports.validateRegistrationMessage = exports.abortConnectionWithMessage = exports.sendStatus = exports.loadMappingFileData = exports.removeNotNeededTargetFields = exports.validateTarget = exports.validate2 = exports.validateDeviceMappingAttribs = exports.genSessionId = exports.getSystemMillis = void 0;
const hashmap_1 = __importDefault(require("hashmap"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
const uuid_1 = require("uuid");
const dbConfig_1 = require("../database/dbConfig");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function getSystemMillis() {
    const time = Date.now();
    return time;
}
exports.getSystemMillis = getSystemMillis;
function genSessionId() {
    return (0, uuid_1.v4)().replace("-", "");
}
exports.genSessionId = genSessionId;
const mapping = [
    {
        pos: 1 << 0,
        filePos: 2,
        tag: "terminalId",
    },
    {
        pos: 1 << 1,
        filePos: 1,
        tag: "merchantId",
    },
    {
        pos: 1 << 2,
        filePos: 0,
        tag: "serialNo",
    },
];
function validateDeviceMappingAttribs(mappingAttribs) {
    if (!mappingAttribs || mappingAttribs.length == 0)
        throw new Error("device mapping attribs not set ");
    let found;
    for (const element of mappingAttribs) {
        found = mapping.find((item) => {
            return item.tag == element;
        });
        if (!found)
            throw new Error("invalid device mapping attribute item found");
    }
}
exports.validateDeviceMappingAttribs = validateDeviceMappingAttribs;
const joi = require("joi");
const schema = joi.object({
    branchCode: joi.string().allow(null),
    target: joi.object({
        serialNo: joi.string().required().allow(null),
    }),
    dataType: joi
        .string()
        .required()
        .valid("sale", "RequestLast", "getTran", "binRequest", "qrSale", "active", "settlement"),
    data: joi.object().required(),
    checkSum: joi.string().length(64).allow(null),
});
function validate2(tran) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        let error = null;
        try {
            yield schema.validateAsync(tran);
        }
        catch (er) {
            error = er;
        }
        if (error != null)
            result = error.details[0].message;
        return result;
    });
}
exports.validate2 = validate2;
function validateTarget(target, mappingAttribs) {
    for (const element of mappingAttribs) {
        if (target[element] == null)
            return false;
    }
    return true;
}
exports.validateTarget = validateTarget;
function removeNotNeededTargetFields(target, mappingAttribs) {
    const keys = Object.keys(target);
    let found;
    for (const element of keys) {
        found = null;
        for (const mapAttrib of mappingAttribs) {
            if (element === mapAttrib) {
                found = element;
                break;
            }
        }
        if (!found)
            delete target[element];
    }
    return target;
}
exports.removeNotNeededTargetFields = removeNotNeededTargetFields;
function loadMappingFileData(userDefinedMapping, branchCodeEnabled) {
    let itemCount = 0;
    const deviceMap = new hashmap_1.default();
    deviceMap.clear();
    //compute the position of the file
    userDefinedMapping.forEach((item) => {
        mapping.forEach((mapItem) => {
            if (mapItem.tag == item) {
                itemCount++;
            }
        });
    });
    if (branchCodeEnabled)
        itemCount++;
    try {
        //read the content of the file
        const fileContent = fs_1.default.readFileSync("attribs/device_mapping_attribs.txt", "utf-8");
        //split in to lines
        let records = fileContent.split(/\r?\n/);
        //check for the blank lines
        const newRecs = [];
        for (const element of records)
            if (element.length > 0)
                newRecs.push(element);
        records = newRecs;
        logger_1.default.info(records.length + " terminal records were loaded ");
        //traverse through each record while parsing
        for (let recIndex = 0; recIndex < records.length; recIndex++) {
            const attribs = records[recIndex].split(",");
            if (!attribs || attribs.length != itemCount)
                throw new Error("mapping file is not compatible with the configuration");
            let branchCode = "";
            let posTaken = 0;
            let deviceParam = {};
            if (branchCodeEnabled) {
                //the first column should be taken as the branch code
                branchCode = attribs[0];
                posTaken = 1;
            }
            let matched = false;
            userDefinedMapping.forEach((item) => {
                mapping.forEach((mapItem) => {
                    if (item == mapItem.tag) {
                        deviceParam[item] = attribs[posTaken++];
                        matched = true;
                    }
                });
            });
            if (matched) {
                matched = false;
                if (branchCode === "") {
                    deviceMap.set(recIndex.toString(), deviceParam);
                }
                else {
                    if (deviceMap.has(branchCode))
                        throw new Error("duplicated branch code found in the file , aborting!");
                    deviceMap.set(branchCode, deviceParam);
                }
            }
        }
        return deviceMap;
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.loadMappingFileData = loadMappingFileData;
const errorDesc_1 = __importDefault(require("./errorDesc"));
const user_1 = require("../database/types/user");
const roles_1 = require("../database/types/roles");
const resource_1 = require("../database/types/resource");
const permissions_1 = require("../database/types/permissions");
const typeorm_1 = require("typeorm");
const audit_1 = require("../database/types/audit");
function sendStatus(socket, errorObject) {
    const dt = JSON.stringify(errorObject);
    logger_1.default.error(dt);
    socket.send(dt);
}
exports.sendStatus = sendStatus;
function abortConnectionWithMessage(socket, errorObject) {
    const dt = JSON.stringify(errorObject);
    logger_1.default.error(dt);
    socket.send(dt);
    logger_1.default.debug("connection aborting due to incomplete request");
    socket.terminate();
}
exports.abortConnectionWithMessage = abortConnectionWithMessage;
function validateRegistrationMessage(regMessage) {
    if (!regMessage)
        return errorDesc_1.default.REG_MESSAGE_EMPTY;
    console.log('regMessage', regMessage);
    const sn = regMessage.serialNo;
    if (!sn)
        return errorDesc_1.default.REG_MESSAGE_INCOMPLETE;
    return errorDesc_1.default.REQUEST_SUCCESSFUL;
}
exports.validateRegistrationMessage = validateRegistrationMessage;
function buildSearchKey(params) {
    let keys = Object.keys(params);
    let key = "";
    for (const element of keys)
        key += params[element];
    return key;
}
exports.buildSearchKey = buildSearchKey;
function verifyTargeData(userDefinedAttribs, deviceParam, target) {
    let found = false;
    for (const element of userDefinedAttribs) {
        const items = deviceParam[element].split(" ");
        for (const a of items) {
            console.log("A", a);
            if (target[element] == a)
                found = true;
        }
    }
    return found;
}
exports.verifyTargeData = verifyTargeData;
function matchBranchSerial(serial, brancCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryString2 = `SELECT EXISTS (SELECT 
   b.branch_code As branchCode,
   b.id As branch_id,
   d.id As deviceID,
   d.serial_number AS serial_number
   FROM branch AS b, device AS d 
   WHERE b.id = d.branch_id && b.branch_code = ` +
            serial +
            ` && d.serial_number = ` +
            brancCode +
            `) as result`;
        return new Promise((resolve) => {
            dbConfig_1.db.query(queryString2, (err, result) => {
                if (err) {
                    err;
                }
                const mapResult = result;
                console.log("map", result);
                console.log("map2", mapResult);
                mapResult.forEach((element) => {
                    resolve(element.result);
                });
            });
        });
    });
}
exports.matchBranchSerial = matchBranchSerial;
const createUser = (user, callback) => {
    const querString = `INSERT INTO user(id,name,user_name,password,contact_no,email, is_delete, role_id) 
  VALUES (?,?,?,?,?,?,?,?);`;
    dbConfig_1.db.query(querString, [
        user.id,
        user.name,
        user.user_name,
        user.password,
        user.contact_no,
        user.email,
        user.is_delete,
        user.role_id,
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result;
        callback(null, insertId.insertId);
    });
};
exports.createUser = createUser;
const createRoles = (roles, callback) => {
    const querString = `INSERT INTO role(id,name,is_delete) 
  VALUES (?,?,?);`;
    dbConfig_1.db.query(querString, [roles.id, roles.name, roles.is_delete], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result;
        callback(null, insertId.insertId);
    });
};
exports.createRoles = createRoles;
const createResource = (resource, callback) => {
    const queryString = `INSERT INTO resource(id,name) 
  VALUES (?, ?);`;
    dbConfig_1.db.query(queryString, [resource.id, resource.name], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result;
        callback(null, insertId.insertId);
    });
};
exports.createResource = createResource;
const createPermission = (permission, callback) => {
    const queryString = `INSERT INTO permission (id,create_s,update_s,delete_s,view,resource_id,role_id)
  VALUES (?,?,?,?,?,?,?);`;
    dbConfig_1.db.query(queryString, [
        permission.id,
        permission.create_s,
        permission.update_s,
        permission.delete_s,
        permission.view,
        permission.resource_id,
        permission.role_id,
    ], (err, result) => {
        if (err) {
            callback(err);
        }
        const insertId = result;
        callback(null, insertId.insertId);
    });
};
exports.createPermission = createPermission;
const initialUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const roleRepo = (0, typeorm_1.getRepository)(roles_1.Role);
    const userRepo = (0, typeorm_1.getRepository)(user_1.User);
    const resourceRepo = (0, typeorm_1.getRepository)(resource_1.Resource);
    const permissionRepo = (0, typeorm_1.getRepository)(permissions_1.Permission);
    const findrole = yield roleRepo.find();
    if (findrole.length === 0) {
        const role = yield roleRepo.save({
            name: "Super Admin",
            is_delete: false,
        });
        const merchantRole = yield roleRepo.save({
            name: "Merchant",
            is_delete: false
        });
        console.log("Roles", role);
        console.log("Merchant Roles", merchantRole);
    }
    else {
        console.log("Role Already in");
    }
    const password1 = "12345";
    const finduser = yield userRepo.find();
    if (finduser.length === 0) {
        const user = yield userRepo.save({
            name: "Super Admin",
            user_name: "superadmin",
            password: yield bcryptjs_1.default.hash(password1, 12),
            email: "superadmin@gmail.com",
            contact_no: "071792356",
            is_delete: false,
            role_id: 1,
        });
        const merchantUser = yield userRepo.save({
            name: "merchant",
            user_name: "merchant",
            password: yield bcryptjs_1.default.hash(password1, 12),
            email: "merchant@gmail.com",
            contact_no: "071792356",
            is_delete: false,
            role_id: 2,
        });
        console.log("initail user", user);
        console.log("initail merchant user", merchantUser);
    }
    else {
        console.log("user alredy in");
    }
    const findResource = yield resourceRepo.find();
    if (findResource.length === 0) {
        yield resourceRepo.save({
            name: "User",
        });
        yield resourceRepo.save({
            name: "Merchant",
        });
        yield resourceRepo.save({
            name: "Branch",
        });
        yield resourceRepo.save({
            name: "Device",
        });
    }
    else {
        console.log("Resources ara in list");
    }
    const findPermission = yield permissionRepo.find();
    if (findPermission.length === 0) {
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 1,
            role_id: 1,
        });
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 2,
            role_id: 1,
        });
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 3,
            role_id: 1,
        });
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 4,
            role_id: 1,
        });
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 3,
            role_id: 2,
        });
        yield permissionRepo.save({
            create_s: true,
            update_s: true,
            delete_s: true,
            view: true,
            resource_id: 4,
            role_id: 2,
        });
    }
    else {
        console.log("Permissions in list in already");
    }
});
exports.initialUser = initialUser;
const auditCreate = (user, action, resource, oldValues, newValues) => __awaiter(void 0, void 0, void 0, function* () {
    const auditRepo = (0, typeorm_1.getRepository)(audit_1.Audit);
    const aduit = yield auditRepo.save({
        user: user,
        action: action,
        resource: resource,
        description: action === "Update" ? "Old Values: " + oldValues + "New Values: " + newValues : action === "Create" ? newValues : "null"
    });
    console.log("Audit", aduit);
});
exports.auditCreate = auditCreate;
