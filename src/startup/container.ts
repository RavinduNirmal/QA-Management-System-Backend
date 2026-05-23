import { getConnection } from "typeorm";
import { JwtAuthGateway } from "../domain/interfaces/gateways/impl/JWTAuthGateway";

// Repositories
import { UserRepository } from "../infras/database/repositories/UserRepository";
import { RoleRepository } from "../infras/database/repositories/RoleRepository";
import { AuditRepository } from "../infras/database/repositories/AuditRepository";
import { PermissionRepository } from "../infras/database/repositories/PermissionRepository";
import { ResourceRepository } from "../infras/database/repositories/ResourceRepository";

// Use Cases - User
import { CreateUserUseCase } from "../app/usecases/user/CreateUserUseCase";
import { UpdateUserUseCase } from "../app/usecases/user/UpdateUserUseCase";
import { GetUsersUseCase } from "../app/usecases/user/GetUserUseCase";
import { UpdateUserPasswordUseCase } from "../app/usecases/user/UpdateUserPasswordUseCase";

// Use Cases - Auth
import { LoginUseCase } from "../app/usecases/auth/LoginUseCase";

// Use Cases - Role
import { CreateRoleUseCase } from "../app/usecases/role/CreateRoleUseCase";
import { GetRolesUseCase } from "../app/usecases/role/GetRoleUseCase";
import { UpdateRoleUseCase } from "../app/usecases/role/UpdateRoleUseCase";

// Use Cases - Audit
import { GetAuditsUseCase } from "../app/usecases/audit/GetAuditsUseCase";

// Use Cases - Permission
import { CreateResourceUseCase } from "../app/usecases/permission/CreateResouceUseCase";
import { CreatePermissionUseCase } from "../app/usecases/permission/CreatePermissionUseCase";

// Controllers
import { UserController } from "../infras/http/controllers/UserController";
import { AuthController } from "../infras/http/controllers/AuthController";
import { RoleController } from "../infras/http/controllers/RoleController";
import { AuditController } from "../infras/http/controllers/AuditController";
import { PermissionController } from "../infras/http/controllers/PermissionController";

export interface IContainer {
  userController: UserController;
  authController: AuthController;
  roleController: RoleController;
  auditController: AuditController;
  permissionController: PermissionController;
}

export async function createContainer(): Promise<IContainer> {
  // Ensure TypeORM connection is ready
  const connection = getConnection();
  if (!connection.isConnected) {
    await connection.connect();
  }

  // Initialize Repositories
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const auditRepository = new AuditRepository();
  const permissionRepository = new PermissionRepository();
  const resourceRepository = new ResourceRepository();

  // Initialize Gateways
  const authGateway = new JwtAuthGateway();

  // Initialize Use Cases - User
  const createUserUseCase = new CreateUserUseCase(userRepository, roleRepository, auditRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, roleRepository, auditRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository, roleRepository);
  const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(userRepository, auditRepository, authGateway);

  // Initialize Use Cases - Auth
  const loginUseCase = new LoginUseCase(
    userRepository, 
    roleRepository, 
    permissionRepository, 
    resourceRepository, 
    auditRepository
  );

  // Initialize Use Cases - Role
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, auditRepository);
  const getRolesUseCase = new GetRolesUseCase(roleRepository);
  const updateRoleUseCase = new UpdateRoleUseCase(roleRepository, auditRepository);

  // Initialize Use Cases - Audit
  const getAuditsUseCase = new GetAuditsUseCase(auditRepository, roleRepository);

  // Initialize Use Cases - Permission
  const createResourceUseCase = new CreateResourceUseCase(resourceRepository, auditRepository);
  const createPermissionUseCase = new CreatePermissionUseCase(permissionRepository, auditRepository, resourceRepository);

  // Initialize Controllers
  const userController = new UserController(
    createUserUseCase, 
    updateUserUseCase, 
    getUsersUseCase,
    updateUserPasswordUseCase
  );
  const authController = new AuthController(loginUseCase);
  const roleController = new RoleController(createRoleUseCase, getRolesUseCase, updateRoleUseCase);
  const auditController = new AuditController(getAuditsUseCase);
  const permissionController = new PermissionController(createResourceUseCase, createPermissionUseCase);

  return {
    userController,
    authController,
    roleController,
    auditController,
    permissionController
  };
}

export default createContainer;