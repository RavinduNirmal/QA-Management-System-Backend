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
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const baseError_1 = require("../common/baseError");
const logger_1 = __importDefault(require("../common/logger"));
const statusCodes_1 = require("../common/statusCodes");
const utils_1 = require("../common/utils");
const baseError_2 = require("./../common/baseError");
const errorHandler_1 = __importDefault(require("./../common/errorHandler"));
const websocket_1 = require("./webSocket/websocket");
const dbConfig_1 = require("../database/dbConfig");
const user_1 = require("../database/types/user");
const roles_1 = require("../database/types/roles");
const resource_1 = require("../database/types/resource");
const permissions_1 = require("../database/types/permissions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const merchants_1 = require("../database/types/merchants");
const branch_1 = require("../database/types/branch");
const device_1 = require("../database/types/device");
const generateToken_1 = __importDefault(require("../database/utils/generateToken"));
const authMiddleware_1 = require("../database/middleware/authMiddleware");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const audit_1 = require("../database/types/audit");
const router = express_1.default.Router();
//pre load the device map
const matchBranchCode = config_1.default.get("map-branch-code");
const userDefinedMappingMethods = config_1.default.get("device-mapping-attributes");
// const deviceMap: HashMap<string, DeviceMappingParams> = loadMappingFileData(
//   userDefinedMappingMethods,
//   matchBranchCode
// );
router.post("/initiate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tran = req.body;
    console.log("map-branch-code", matchBranchCode);
    const queryString = `SELECT b.branch_code As branchCode,
  b.id As branch_id,
  d.id As deviceID,
  d.serial_number AS serial_number
  FROM branch AS b, device AS d
  WHERE b.id = d.branch_id;`;
    //generate a session id for log tracking
    const sessionId = (0, utils_1.genSessionId)();
    dbConfig_1.db.query(queryString, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            err;
        }
        try {
            if (!tran)
                throw new baseError_1.BadRequest("tran initiation request is not found in the body");
            //the following change was done for the change requested by IFS. in that a root tag is requrested
            //on top of the json tree, This has to be remvoed for other clients
            const { root } = tran;
            if (!root)
                throw new baseError_1.BadRequest("root element not found in the request");
            //==============================================================================================
            let valid = yield (0, utils_1.validate2)(root);
            if (valid)
                throw new baseError_1.BadRequest(valid);
            logger_1.default.info("request " + JSON.stringify(tran));
            console.log("request " + JSON.stringify(tran));
            tran = root;
            //basic validation is done, now we must check the validity of the target sub object which is the interest of web socket service.
            const mappingAttribs = config_1.default.get("device-mapping-attributes");
            console.log("mappingAttribs", mappingAttribs);
            logger_1.default.info("mapping " + mappingAttribs);
            const devices = [];
            const rows = result;
            const serials = [];
            const branCode = [];
            //let matchBranSerial: { brancCode: String, serialNumber: String }[] = [];
            rows.forEach((row) => {
                const device = {
                    id: row.branch_id,
                    deviceId: row.deviceID,
                    branchCode: row.branchCode,
                    branchId: row.branch_id,
                    serialNumber: row.serial_number,
                };
                devices.push(device);
                //console.log("Order", device)
            });
            devices.forEach((row) => {
                console.log("serialNumber: ", row.serialNumber);
                serials.push(row.serialNumber);
                branCode.push(row.branchCode);
                // matchBranSerial.push({brancCode: row.branchCode, serialNumber: row.serialNumber})
            });
            console.log("BranchDb: ", branCode);
            console.log("Serial Number Have", tran);
            //console.log("Mapiing Db: ", matchBranSerial)
            const validateTarget = serials.indexOf(tran.target.serialNo) !== -1;
            console.log("Serial Number Have", validateTarget);
            if (!validateTarget)
                throw new baseError_2.Conflict("provided targetted values are not compatible with the configured mappings which are " +
                    serials);
            if (matchBranchCode) {
                //check the branch code
                const branchCode = tran.branchCode;
                if (!branchCode)
                    throw new baseError_1.BadRequest("branch code is configured to be mapped, but its missing");
                //have a branchCode , we must check the branch code agains the target
                const validateBrancode = branCode.indexOf(branchCode) !== -1;
                console.log("barnchcodevaidate", validateBrancode);
                if (!validateBrancode)
                    throw new baseError_1.NotFound("no matching device found with the branch code given");
                else {
                    //there is a device , we check against the target object
                    const match = yield (0, utils_1.matchBranchSerial)(tran.branchCode, tran.target.serialNo);
                    console.log("Match:", match);
                    if (match === 0)
                        throw new baseError_2.Conflict("This branch is not allowed to initiate trans towards the device in the target");
                }
            }
            //  const validTarget = validateTarget(tran.target, mappingAttribs);
            //   if (!validTarget)
            //     throw new Conflict(
            //       "provided targetted values are not compatible with the configured mappings which are " +
            //         mappingAttribs
            //     );
            //     console.log("mapping: ",mappingAttribs)
            // if (matchBranchCode) {
            //   //check the branch code
            //   console.log("Branchcode: ",tran.branchCode)
            //   const branchCode: string = tran.branchCode;
            //   if (!branchCode)
            //     throw new BadRequest("branch code is configured to be mapped, but its missing");
            //   //have a branchCode , we must check the branch code agains the target
            //   if (!deviceMap.has(branchCode))
            //     throw new NotFound("no matching device found with the branch code given");
            //   else {
            //     //there is a device , we check against the target object
            //     let deviceParam = deviceMap.get(branchCode);
            //     console.log("DeviceParam", deviceParam)
            //     let verified = verifyTargeData(userDefinedMappingMethods, deviceParam, tran.target);
            //     console.log("userDefinedMappingMethods", deviceParam)
            //     if (!verified)
            //       throw new Conflict(
            //         "This branch is not allowed to initiate trans towards the device in the target "
            //       );
            //   }
            // }
            //remvove the unwanted tran target deta if there is
            tran.target = (0, utils_1.removeNotNeededTargetFields)(tran.target, mappingAttribs);
            //log the tran initiation data
            logger_1.default.info("Transaction Initiated from " + req.socket.remoteAddress, tran);
            try {
                //=======================================Test hardcoded scenario goes here =================================
                //const { target } = tran;
                // const { serialNo } = target;
                console.log("Tran2", tran);
                if (tran.target.serialNo === "xxxxxxxx") {
                    const hardCodedResp = {
                        checksum: "06D17DCB1F3FEC4FEB1724AD079294150A07E4DF5576CE29F77E0F017D2FF76E",
                        data: {
                            status: "A",
                            rspCode: "00",
                            rspText: "Success",
                            traceNo: "5",
                            invoiceNo: "2",
                            ecrRef: "2000",
                            txnDate: "20230220",
                            txnTime: "112901",
                            appCode: "123456",
                            expDate: "****",
                            amt: "1500",
                            tipAmt: "0",
                            adjAmt: "0",
                            currency: "LKR",
                            merchantName: "Merchant Name",
                            merchantAddress: "Merchant Addr",
                            cardType: "MASTER",
                            noSign: "Y",
                            transState: "normal",
                            transType: "sale",
                            host: "VMJU_H",
                            binReferenceNo: null,
                            dccTran: "N",
                            enterMode: "T",
                            pan: "55421400******63",
                            terminalId: "81400598",
                            merchantId: "000000013506002",
                            cardHolderName: null,
                            batchNo: "000001",
                            referenceNo: "123456789123",
                            txnConsequentialNo: "123456",
                            app: "Debit MasterCard",
                            aid: "A0000000041010",
                            tc: "13F3BFCEE55C802A",
                            tvr: "8040008001",
                            tsi: "0000",
                            atc: "252F",
                        },
                        dataType: "sale",
                    };
                    res.status(statusCodes_1.StatusCodes.OK).send(hardCodedResp);
                    //==========================================================================================================
                }
                else {
                    logger_1.default.info("request to device " +
                        sessionId +
                        " " +
                        tran.target.serialNo +
                        " " +
                        JSON.stringify(tran));
                    let resp = yield (0, websocket_1.getResponseFromTerminal)(tran);
                    logger_1.default.info("response from the terminal " + sessionId + Object.assign({}, resp));
                    res.status(statusCodes_1.StatusCodes.OK).send(resp);
                }
            }
            catch (error) {
                console.log(error);
                logger_1.default.info("returne error " + sessionId + " " + JSON.stringify(error));
                res.status(statusCodes_1.StatusCodes.SERVER_ERROR).send(error);
            }
        }
        catch (error) {
            (0, errorHandler_1.default)(error, res);
        }
    }));
}));
router.post("/insertuser", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const newUser: User = req.body;
    const { name, user_name, email, contact_no, password, is_delete, role_id, username } = req.body;
    const userRepo = (0, typeorm_1.getRepository)(user_1.User);
    let userClass = (0, class_transformer_1.plainToClass)(user_1.User, req.body);
    const errors = yield (0, class_validator_1.validate)(userClass);
    console.log(errors);
    if (errors.length > 0) {
        errors.map((error) => {
            if (error.property === "name") {
                return res.status(400).send({
                    message: "Name Field should be filled !",
                });
            }
            else if (error.property === "user_name") {
                return res.status(400).send({
                    message: "User Name Field should be filled !",
                });
            }
            else if (error.property === "email") {
                return res.status(400).send({
                    message: "Email Field should be filled !",
                });
            }
            else if (error.property === "contact_no") {
                return res.status(400).send({
                    message: "Contact number Field should be filled !",
                });
            }
            else if (error.property === "password") {
                return res.status(400).send({
                    message: "Password Field should be filled !",
                });
            }
        });
    }
    else {
        const user = yield userRepo.save({
            name,
            user_name,
            password: yield bcryptjs_1.default.hash(password, 12),
            email,
            contact_no,
            is_delete,
            role_id,
        });
        const stringUser = JSON.stringify(user);
        (0, utils_1.auditCreate)(username, "Create", "User", " ", stringUser);
        res.send(user);
    }
    // createUser(newUser, (err: Error, userId: number) => {
    //   if (err) {
    //     return res.status(500).json({"message": err.message});
    //   }
    //   res.status(200).json({"message":"Successfully Added user ","userId": userId});
    // });
}));
router.post("/createrole", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newRole = req.body;
    (0, utils_1.createRoles)(newRole, (err, roleId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res
            .status(200)
            .json({ message: "Successfully Added role ", RoleID: roleId });
    });
}));
router.post("/createResource", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newResource = req.body;
    (0, utils_1.createResource)(newResource, (err, resourceId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res
            .status(200)
            .json({ message: "Sucessfully Added Resource", ResourceId: resourceId });
    });
}));
router.post("/createPermission", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPermission = req.body;
    (0, utils_1.createPermission)(newPermission, (err, permissionId) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({
            message: "Successfully Added Permission",
            PermissionID: permissionId,
        });
    });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, password } = req.body;
    const log = (0, typeorm_1.getRepository)(user_1.User);
    const permi = (0, typeorm_1.getRepository)(permissions_1.Permission);
    const rolename = (0, typeorm_1.getRepository)(roles_1.Role);
    const resources = (0, typeorm_1.getRepository)(resource_1.Resource);
    const user = yield log.findOne({
        where: {
            user_name: user_name,
        },
    });
    if (!user) {
        return res.status(400).send({
            message: "Invalid Credentials",
        });
    }
    if (!(yield bcryptjs_1.default.compare(password, user.password))) {
        return res.status(400).send({
            message: "Invalid Password",
        });
    }
    else {
        const permission = yield permi.find({
            where: {
                role_id: user.role_id,
            },
        });
        console.log("permission", permission);
        let permissions = [];
        for (const permis of permission) {
            const resource = yield resources.find({
                where: {
                    id: permis.resource_id,
                },
            });
            for (const resour of resource) {
                permissions.push({
                    id: permis.id,
                    create_s: permis.create_s,
                    update_s: permis.update_s,
                    delete_s: permis.delete_s,
                    view: permis.view,
                    resource_id: permis.resource_id,
                    role_id: permis.role_id,
                    resourceName: resour.name,
                });
            }
        }
        const role = yield rolename.findOne({
            where: {
                id: user.role_id,
            },
        });
        (0, utils_1.auditCreate)(user.name, "Login", " ", " ", " ");
        res.json({
            id: user.id,
            name: user.name,
            user_name: user.user_name,
            password: user.password,
            email: user.email,
            contact_no: user.contact_no,
            is_delete: user.is_delete,
            role_id: user.role_id,
            token: (0, generateToken_1.default)(user.id),
            permissions,
            role,
        });
    }
}));
router.post("/createmerchant", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Merchant");
    const { name, email, contact_no, logo, is_delete, user } = req.body;
    const merchantRepo = (0, typeorm_1.getRepository)(merchants_1.Merchant);
    const auditRepo = (0, typeorm_1.getRepository)(audit_1.Audit);
    let merchantClass = (0, class_transformer_1.plainToClass)(merchants_1.Merchant, req.body);
    const errors = yield (0, class_validator_1.validate)(merchantClass);
    if (errors.length > 0) {
        errors.map((error) => {
            if (error.property === "name") {
                return res.status(400).send({
                    message: "Name Fields should be filled !",
                });
            }
            else if (error.property === "email") {
                return res.status(400).send({
                    message: "Email Field should be filled !",
                });
            }
            else if (error.property === "contact_no") {
                return res.status(400).send({
                    message: "Contact Number Field should be filled !",
                });
            }
        });
    }
    else {
        if ((yield permission).create) {
            const merchant = yield merchantRepo.save({
                name,
                email,
                contact_no,
                logo,
                is_delete,
            });
            const stringMerchant = JSON.stringify(merchant);
            (0, utils_1.auditCreate)(user, "Create", "Merchant", " ", stringMerchant);
            res.send(merchant);
        }
        else {
            res.status(400).send({
                message: "Not Authorized !",
            });
        }
    }
}));
router.post("/createbranch", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Branch");
    const { branch_code, name, email, contact_no, district, province, is_delete, merchant_id, user } = req.body;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    let branchClass = (0, class_transformer_1.plainToClass)(merchants_1.Merchant, req.body);
    const errors = yield (0, class_validator_1.validate)(branchClass);
    const result = errors.map((error) => {
        console.log("Error: ", error.property);
    });
    console.log(result);
    if (errors.length > 0) {
        errors.map((error) => {
            console.log("Error: ", error.property);
            if (error.property === "name") {
                return res.status(400).send({
                    message: "Name Field should be filled !",
                });
            }
            else if (error.property === "email") {
                return res.status(400).send({
                    message: "Email Field should be filled !",
                });
            }
            else if (error.property === "contact_no") {
                return res.status(400).send({
                    message: "Contact Number Field should be filled !",
                });
            }
            else if (error.property === "district") {
                return res.status(400).send({
                    message: "District Field should be filled !",
                });
            }
            else if (error.property === "province") {
                return res.status(400).send({
                    message: "Province Field should be filled !",
                });
            }
            else if (error.property === "merchant_id") {
                return res.status(400).send({
                    message: "Merchant Filed should be filled !",
                });
            }
        });
    }
    else {
        if ((yield permission).create) {
            const branch = yield branchRepo.save({
                branch_code,
                name,
                email,
                contact_no,
                district,
                province,
                is_delete,
                merchant_id,
            });
            const stringBranch = JSON.stringify(branch);
            (0, utils_1.auditCreate)(user, "Create", "Branch", " ", stringBranch);
            res.send(branch);
        }
        else {
            res.status(400).send({
                message: "Not Authorized !",
            });
        }
    }
}));
router.post("/createdevice", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Device");
    const { serial_number, model, is_delete, branch_id, mid, tid, user } = req.body;
    const deviceRepo = (0, typeorm_1.getRepository)(device_1.Device);
    let deviceClass = (0, class_transformer_1.plainToClass)(device_1.Device, req.body);
    const errors = yield (0, class_validator_1.validate)(deviceClass);
    console.log("errpr", errors);
    if (errors.length > 0) {
        errors.map((error) => {
            console.log("error", error.constraints.isLength);
            if (error.property === "serial_number") {
                return res.status(400).send({
                    message: "Serial Number Fields should be filled !",
                });
            }
            else if (error.property === "model") {
                return res.status(400).send({
                    message: "Model Fields should be filled !",
                });
            }
            else if (error.property === "mid") {
                if (mid === "") {
                    return res.status(400).send({
                        message: "Mid Field should be filled !",
                    });
                }
                else {
                    return res.status(400).send({
                        message: error.constraints.isLength,
                    });
                }
            }
            else if (error.property === "tid") {
                if (tid === "") {
                    return res.status(400).send({
                        message: "Tid Filed should be filled !",
                    });
                }
                else {
                    return res.status(400).send({
                        message: error.constraints.isLength,
                    });
                }
            }
        });
    }
    else {
        if ((yield permission).create) {
            const device = yield deviceRepo.save({
                serial_number,
                model,
                is_delete,
                branch_id,
                mid,
                tid,
            });
            const stringDevice = JSON.stringify(device);
            (0, utils_1.auditCreate)(user, "Create", "Device", " ", stringDevice);
            res.send(device);
        }
        else {
            res.status(400).send({
                message: "Not Authorized !",
            });
        }
    }
}));
router.get("/merchants", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Merchant");
    const branchpermission = (0, authMiddleware_1.getPermission)("Branch");
    req.body;
    const merchantRepo = (0, typeorm_1.getRepository)(merchants_1.Merchant);
    const merchant = yield merchantRepo.find({
        where: {
            is_delete: false,
        },
    });
    let Merchants = [];
    for (const merc of merchant) {
        Merchants.push({
            id: merc.id,
            name: merc.name,
            email: merc.email,
            contact_no: merc.contact_no,
            logo: Buffer.from(merc.logo).toString(),
            is_delete: merc.is_delete,
        });
    }
    console.log(Merchants);
    if ((yield permission).view) {
        res.send(Merchants);
    }
    else {
        return res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/branch/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantid = req.params.id;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    const branch = yield branchRepo.find({
        where: {
            merchant_id: merchantid,
            is_delete: false,
        },
    });
    console.log(branch);
    res.send(branch);
}));
router.put("/merchant/edit/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Merchant");
    const merchantid = req.params.id;
    const merchantRepo = (0, typeorm_1.getRepository)(merchants_1.Merchant);
    const merchant = yield merchantRepo.findOne({
        where: {
            id: merchantid,
        },
    });
    let oldMerchant = {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        contact_no: merchant.contact_no,
        is_delete: merchant.is_delete,
        logo: "null",
    };
    if ((yield permission).update) {
        const mer = JSON.stringify(oldMerchant);
        const newmer = JSON.stringify(req.body);
        (0, utils_1.auditCreate)(req.body.user, "Update", "Merchant", mer, newmer);
        merchantRepo.merge(merchant, req.body);
        const result = yield merchantRepo.save(merchant);
        res.json({
            message: "success",
            payload: result,
        });
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/branches", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Branch");
    req.body;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    const branch = yield branchRepo.find({
        where: {
            is_delete: false,
        },
    });
    console.log("Permis3", (yield permission).create);
    if ((yield permission).view) {
        res.send(branch);
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.put("/branch/edit/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Branch");
    const branchid = req.params.id;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    const branch = yield branchRepo.findOne({
        where: {
            id: branchid,
        },
    });
    if ((yield permission).update) {
        const oldbran = JSON.stringify(branch);
        const newbran = JSON.stringify(req.body);
        branchRepo.merge(branch, req.body);
        const result = yield branchRepo.save(branch);
        (0, utils_1.auditCreate)(req.body.user, "Update", "Branch", oldbran, newbran);
        res.json({
            message: "success",
            payload: result,
        });
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/device/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branchid = req.params.id;
    const deviceRepo = (0, typeorm_1.getRepository)(device_1.Device);
    const device = yield deviceRepo.find({
        where: {
            branch_id: branchid,
        },
    });
    res.send(device);
}));
router.get("/devices", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("Device");
    req.body;
    const deviceRepo = (0, typeorm_1.getRepository)(device_1.Device);
    const device = yield deviceRepo.find({
        where: {
            is_delete: false,
        },
    });
    if ((yield permission).view) {
        res.send(device);
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.put("/device/edit/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceid = req.params.id;
    const deviceRepo = (0, typeorm_1.getRepository)(device_1.Device);
    const permission = (0, authMiddleware_1.getPermission)("Device");
    const device = yield deviceRepo.findOne({
        where: {
            id: deviceid,
        },
    });
    if ((yield permission).update) {
        const olddev = JSON.stringify(device);
        const newDev = JSON.stringify(req.body);
        deviceRepo.merge(device, req.body);
        const result = yield deviceRepo.save(device);
        res.json({
            message: "success",
            payload: result,
        });
        (0, utils_1.auditCreate)(req.body.user, "Update", "Device", olddev, newDev);
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/device/branch/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    const branch = yield branchRepo.findOne({
        where: {
            id: id,
            is_delete: false,
        },
    });
    res.send(branch);
}));
router.get("/device/branch/merchant/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const branchRepo = (0, typeorm_1.getRepository)(branch_1.Branch);
    const branch = yield branchRepo.findOne({
        where: {
            id: id,
            is_delete: false,
        },
    });
    const branchlist = yield branchRepo.find({
        where: {
            merchant_id: branch.merchant_id,
        },
    });
    res.send(branchlist);
}));
router.put("/user/edit/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.id;
    let { name, user_name, email, contact_no, password, is_delete, role_id, username } = req.body;
    const userRepo = (0, typeorm_1.getRepository)(user_1.User);
    const permission = (0, authMiddleware_1.getPermission)("User");
    const user = yield userRepo.findOne({
        where: {
            id: userid,
        },
    });
    console.log(password);
    let user2 = {
        name,
        user_name,
        email,
        contact_no,
        is_delete,
        role_id,
    };
    let newPassword;
    if (password) {
        newPassword = yield bcryptjs_1.default.hash(password, 12);
        user2.password = newPassword;
    }
    console.log(user2.password);
    if ((yield permission).update) {
        const olduser = JSON.stringify(user);
        const newUser = JSON.stringify(req.body);
        userRepo.merge(user, user2);
        const result = yield userRepo.save(user, {});
        (0, utils_1.auditCreate)(username, "Update", "User", olduser, newUser);
        res.json({
            message: "success",
            payload: result,
        });
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/users", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = (0, authMiddleware_1.getPermission)("User");
    req.body;
    const userRepo = (0, typeorm_1.getRepository)(user_1.User);
    const rolesRepo = (0, typeorm_1.getRepository)(roles_1.Role);
    const users = yield userRepo.find({
        where: {
            is_delete: false,
        },
    });
    let allusers = [];
    for (const user of users) {
        const roles = yield rolesRepo.find({
            where: {
                id: user.role_id,
            },
        });
        for (const role of roles) {
            allusers.push({
                id: user.id,
                name: user.name,
                user_name: user.user_name,
                password: user.password,
                email: user.email,
                contact_no: user.contact_no,
                is_delete: user.is_delete,
                role_id: user.role_id,
                role: role.name,
            });
        }
    }
    if ((yield permission).view) {
        res.json(allusers);
    }
    else {
        res.status(400).send({
            message: "Not Authorized !",
        });
    }
}));
router.get("/roles", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body;
    const rolesRepo = (0, typeorm_1.getRepository)(roles_1.Role);
    const roles = yield rolesRepo.find({
        where: {
            is_delete: false,
        },
    });
    res.send(roles);
}));
router.put("/user/edit/password/:id", authMiddleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.id;
    let { name, user_name, email, contact_no, password, is_delete, role_id } = req.body;
    const userRepo = (0, typeorm_1.getRepository)(user_1.User);
    const user = yield userRepo.findOne({
        where: {
            id: userid,
        },
    });
    console.log(password);
    let user2 = {
        name,
        user_name,
        email,
        contact_no,
        is_delete,
        role_id,
    };
    let newPassword;
    if (password) {
        newPassword = yield bcryptjs_1.default.hash(password, 12);
        user2.password = newPassword;
    }
    console.log(user2.password);
    userRepo.merge(user, user2);
    const result = yield userRepo.save(user, {});
    res.json({
        message: "success",
        payload: result,
    });
}));
exports.default = router;
