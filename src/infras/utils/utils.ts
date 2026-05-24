import HashMap from "hashmap";
import fs from "fs";
import logger from "../../shared/logger/logger";
import { v4 as uuid } from "uuid";
import { db } from "../database/dbConfig";
import bcryptjs, { compareSync } from "bcryptjs";
import { OkPacket, RowDataPacket } from "mysql2";
import { Request, Response, NextFunction } from 'express';

import { User } from "../database/types/user";
import { Role } from "../database/types/roles";
import { Resource } from "../database/types/resource";
import { Permission } from "../database/types/permissions";
import { getRepository,Repository  } from "typeorm";
import { Audit } from "../database/types/audit";

export function getSystemMillis() {
  const time = Date.now();
  return time;
}

export function genSessionId() {
  return uuid().replace("-", "");
}

export const createUser = (user: User, callback: Function) => {
  const querString = `INSERT INTO user(id,name,user_name,password,contact_no,email, is_delete, role_id) 
  VALUES (?,?,?,?,?,?,?,?);`;

  db.query(
    querString,
    [
      user.id,
      user.name,
      user.user_name,
      user.password,
      user.contact_no,
      user.email,
      user.is_delete,
      user.role_id,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = <OkPacket>result;
      callback(null, insertId.insertId);
    }
  );
};

export const createRoles = (roles: Role, callback: Function) => {
  const querString = `INSERT INTO role(id,name,is_delete) 
  VALUES (?,?,?);`;

  db.query(
    querString,
    [roles.id, roles.name, roles.is_delete],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = <OkPacket>result;
      callback(null, insertId.insertId);
    }
  );
};

export const createResource = (resource: Resource, callback: Function) => {
  const queryString = `INSERT INTO resource(id,name) 
  VALUES (?, ?);`;

  db.query(queryString, [resource.id, resource.name], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertId = <OkPacket>result;
    callback(null, insertId.insertId);
  });
};

export const createPermission = (
  permission: Permission,
  callback: Function
) => {
  const queryString = `INSERT INTO permission (id,create_s,update_s,delete_s,view,resource_id,role_id)
  VALUES (?,?,?,?,?,?,?);`;

  db.query(
    queryString,
    [
      permission.id,
      permission.create_s,
      permission.update_s,
      permission.delete_s,
      permission.view,
      permission.resource_id,
      permission.role_id,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = <OkPacket>result;
      callback(null, insertId.insertId);
    }
  );
};

export const initialUser = async () => {
  const roleRepo = getRepository(Role);
  const userRepo = getRepository(User);
  const resourceRepo = getRepository(Resource);
  const permissionRepo = getRepository(Permission);

 const defaultRoles = [
  { name: "Super Admin", keyValue: "SUPER_ADMIN", is_delete: false },
  { name: "Admin", keyValue: "ADMIN", is_delete: false },
];

const existingRoles = await roleRepo.find();
const existingKeyValues = new Set(existingRoles.map(r => r.keyValue));

// Filter out roles that already exist
const newRoles = defaultRoles.filter(role => !existingKeyValues.has(role.keyValue));

if (newRoles.length > 0) {
  await roleRepo.save(newRoles);
  console.log("New roles added:", newRoles.map(r => r.name));
} else {
  console.log("All roles already exist.");
}
  const password1 = "12345";

  const finduser = await userRepo.find();

  if (finduser.length === 0) {
    const user = await userRepo.save({
      name: "Super Admin",
      user_name: "superadmin",
      password: await bcryptjs.hash(password1, 12),
      email: "superadmin@gmail.com",
      contact_no: "071792356",
      is_delete: false,
      role_id: 1,
    });
  
    console.log("initail user", user);
  } else {
    console.log("user alredy in");
  }


const existingResources = await resourceRepo.find();
const existingNames = existingResources.map(r => r.name);

const requiredResources = [
  "User",  
  "Role", 
  "Audit",
  "Report",
  "Project",
  "TestSuite",
  "TestCase",
];

const newResources = requiredResources
  .filter(name => !existingNames.includes(name))
  .map(name => ({ name }));

if (newResources.length > 0) {
  await resourceRepo.save(newResources);
  console.log("New resources added:", newResources.map(r => r.name));
} else {
  console.log("All resources already exist");
}

const existingPermissions = await permissionRepo.find();

const defaultPermissions = [
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 1, role_id: 1 },
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 2, role_id: 1 },
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 3, role_id: 1 },
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 4, role_id: 1 },  
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 5, role_id: 1 },  
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 6, role_id: 1 },
  { create_s: true, update_s: true, delete_s: true, view: true, resource_id: 7, role_id: 1 },
];

for (const perm of defaultPermissions) {
  const existing = existingPermissions.find(p => 
    p.resource_id === perm.resource_id && p.role_id === perm.role_id
  );

  if (!existing) {
    // Insert new permission
    await permissionRepo.save(perm);
    console.log(`Inserted permission R${perm.resource_id}_Role${perm.role_id}`);
  } else {
    // Compare fields
    if (
      existing.create_s !== perm.create_s ||
      existing.update_s !== perm.update_s ||
      existing.delete_s !== perm.delete_s ||
      existing.view !== perm.view
    ) {
      // Update permission
      await permissionRepo.update(existing.id, perm);
      console.log(`Updated permission R${perm.resource_id}_Role${perm.role_id}`);
    }
  }
}
};

export const auditCreate = async (user: string, action:string, resource:string, oldValues:string , newValues:string) =>{
  const auditRepo = getRepository(Audit);
  console.log("Audit")
  const aduit = await auditRepo.save({
      user: user,
      action: action,
      resource: resource,
      description: action=== "Update" ? "Old Values: " +oldValues+ "New Values: "+ newValues : action === "Create" ? newValues : "null"
  })
  console.log("Audit", aduit)
}

//Get Pagination Params
export function getPaginationParams(req: Request) {
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
  return { page, limit };
}


