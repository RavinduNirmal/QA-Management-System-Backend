// import jwt, { verify } from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import { Request, Response, NextFunction } from "express";
// import { User } from "../../../domain/entities/User";
// import { getRepository } from "typeorm";
// import { Permission } from "../../../domain/entities/Permission";
// import { Role } from "..//../../domain/entities/Role";
// import { Resource } from "../../../domain/entities/Resource";

// let currentUserId: any;

// export const setCurrentUserId = (id: any) => {
//   currentUserId = id;
// };

// export const protect = async (
//   req: Request & { user?: any },
//   res: Response,
//   next: NextFunction
// ) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      
//       if (!decoded) {
//         return res.status(401).send({
//           message: "Invalid token",
//         });
//       }
      
//       currentUserId = decoded.id;
//       const user = await getRepository(User).findOne({
//         where: {
//           id: decoded.id,
//         },
//       });

//       if (!user) {
//         return res.status(401).send({
//           message: "Unauthenticated",
//         });
//       } else {
//         req.user = user;
//         next();
//       }
//     } catch (e) {
//       console.log(e);
//       return res.status(401).send({
//         message: "Unauthenticated",
//       });
//     }
//   }

//   if (!token) {
//     res.status(401).send({
//       message: "Not authorized, no token",
//     });
//   }
// };

// export const getPermission = async (resource: string) => {
//   console.log("userid: ", currentUserId);
//   console.log("resourcename: ", resource);
  
//   const resources = getRepository(Resource);
//   let permissions: {
//     id: number;
//     create_s: boolean;
//     update_s: boolean;
//     delete_s: boolean;
//     view: boolean;
//     resource_id: number;
//     role_id: number;
//     resourceName: string;
//   }[] = [];

//   let perObj = {
//     create: false,
//     update: false,
//     delete: false,
//     view: false,
//   };

//   const user = await getRepository(User).findOne({
//     where: {
//       id: currentUserId,
//     },
//   });

//   if (!user) {
//     return perObj;
//   }

//   const permission = await getRepository(Permission).find({
//     where: {
//       role_id: user.role_id,
//     },
//   });

//   for (const permis of permission) {
//     const resourceEntity = await resources.findOne({
//       where: {
//         id: permis.resource_id,
//       },
//     });

//     if (resourceEntity) {
//       permissions.push({
//         id: permis.id,
//         create_s: permis.create_s,
//         update_s: permis.update_s,
//         delete_s: permis.delete_s,
//         view: permis.view,
//         resource_id: permis.resource_id,
//         role_id: permis.role_id,
//         resourceName: resourceEntity.name,
//       });
//     }
//   }

//   const index = permissions.findIndex(
//     (permission: { resourceName: string }) =>
//       resource === permission.resourceName
//   );
  
//   try {
//     if (index !== -1) {
//       const currentPermission = permissions[index];
//       perObj.create = currentPermission.create_s === true;
//       perObj.update = currentPermission.update_s === true;
//       perObj.delete = currentPermission.delete_s === true;
//       perObj.view = currentPermission.view === true;
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   console.log("permission", perObj);
//   return perObj;
// };


import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getRepository, getConnection } from "typeorm";

let currentUserId: any;

export const setCurrentUserId = (id: any) => {
  currentUserId = id;
};

export const protect = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      
      if (!decoded) {
        return res.status(401).send({
          message: "Invalid token",
        });
      }
      
      currentUserId = decoded.id;
      
      // Check if connection exists and is connected
      let connection;
      try {
        connection = getConnection();
      } catch (error) {
        console.error("Database connection not found");
        return res.status(500).send({
          message: "Database connection not available",
        });
      }
      
      if (!connection || !connection.isConnected) {
        console.error("Database connection not ready");
        return res.status(500).send({
          message: "Database connection not ready",
        });
      }
      
      // Import the TypeORM entity, not the domain entity
      const { User } = await import('../../database/types/user');
      const userRepository = getRepository(User);
      
      const user = await userRepository.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      } else {
        req.user = user;
        next();
      }
    } catch (e) {
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
  }
};

export const getPermission = async (resource: string) => {
  console.log("userid: ", currentUserId);
  console.log("resourcename: ", resource);
  
  let perObj = {
    create: false,
    update: false,
    delete: false,
    view: false,
  };

  if (!currentUserId) {
    return perObj;
  }

  try {
    // Check connection
    let connection;
    try {
      connection = getConnection();
    } catch (error) {
      console.error("Database connection not found for permission check");
      return perObj;
    }
    
    if (!connection || !connection.isConnected) {
      console.error("Database connection not ready for permission check");
      return perObj;
    }
    
    // Import TypeORM entities
    const { User } = await import('../../database/types/user');
    const { Permission } = await import('../../database/types/permissions');
    const { Resource } = await import('../../database/types/resource');
    
    const userRepository = getRepository(User);
    const permissionRepository = getRepository(Permission);
    const resourceRepository = getRepository(Resource);
    
    const user = await userRepository.findOne({
      where: {
        id: currentUserId,
      },
    });

    if (!user) {
      return perObj;
    }

    const permissions = await permissionRepository.find({
      where: {
        role_id: user.role_id,
      },
    });

    for (const permis of permissions) {
      const resourceEntity = await resourceRepository.findOne({
        where: {
          id: permis.resource_id,
        },
      });

      if (resourceEntity && resourceEntity.name === resource) {
        perObj.create = permis.create_s === true;
        perObj.update = permis.update_s === true;
        perObj.delete = permis.delete_s === true;
        perObj.view = permis.view === true;
        break;
      }
    }
  } catch (error) {
    console.error("Error in getPermission:", error);
  }

  console.log("permission", perObj);
  return perObj;
};