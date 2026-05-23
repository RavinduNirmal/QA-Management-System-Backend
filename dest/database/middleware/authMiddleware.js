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
exports.getPermission = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../types/user");
const typeorm_1 = require("typeorm");
const permissions_1 = require("../types/permissions");
const roles_1 = require("../types/roles");
const resource_1 = require("../types/resource");
let userId;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            console.log(req.cookies);
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            // const payload: any = verify(token, "access_secret");
            const rolename = (0, typeorm_1.getRepository)(roles_1.Role);
            if (!decoded) {
                return res.status(401).send({
                    message: "not decoded",
                });
            }
            userId = decoded.id;
            const user = yield (0, typeorm_1.getRepository)(user_1.User).findOne({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                return res.status(401).send({
                    message: "Unauthenticated",
                });
            }
            else {
                next();
            }
            // res.send(data);
        }
        catch (e) {
            console.log(e);
            return res.status(401).send({
                message: "Unauthenticated",
            });
        }
    }
    if (!token) {
        res.status(401).send({
            message: "Not authorized, no token",
        });
        throw new Error("Not authorized, no token");
    }
    //return permissions
});
exports.protect = protect;
const getPermission = (resource) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userid: ", userId);
    console.log("resorucename: ", resource);
    const resources = (0, typeorm_1.getRepository)(resource_1.Resource);
    let permissions = [];
    let perObj = {
        create: false,
        update: false,
        delete: false,
        view: false,
    };
    const user = yield (0, typeorm_1.getRepository)(user_1.User).findOne({
        where: {
            id: userId,
        },
    });
    const permission = yield (0, typeorm_1.getRepository)(permissions_1.Permission).find({
        where: {
            role_id: user.role_id,
        },
    });
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
    // console.log("permi",permissions)
    const index = permissions.findIndex((permission) => resource === permission.resourceName);
    console.log("index", index);
    try {
        if (index !== -1) {
            const currentPermission = permissions[index];
            if (currentPermission.create_s === true) {
                perObj.create = true;
            }
            else {
                perObj.create = false;
            }
            if (currentPermission.update_s === true) {
                perObj.update = true;
            }
            else {
                perObj.update = false;
            }
            if (currentPermission.delete_s === true) {
                perObj.delete = true;
            }
            else {
                perObj.delete = false;
            }
            if (currentPermission.view === true) {
                perObj.view = true;
                console.log("view", perObj.view);
            }
            else {
                perObj.view = false;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    console.log("permisssion", perObj);
    return perObj;
});
exports.getPermission = getPermission;
// export default protect;getPermission;preobject;
