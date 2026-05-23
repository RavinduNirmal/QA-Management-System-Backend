import express from 'express';
import morgan from 'morgan';
import { protect } from '../infras/http/middlewares/authMiddleware';

// Controllers
import { UserController } from '../infras/http/controllers/UserController';
import { AuthController } from '../infras/http/controllers/AuthController';
import { RoleController } from '../infras/http/controllers/RoleController';
import { AuditController } from '../infras/http/controllers/AuditController';
import { PermissionController } from '../infras/http/controllers/PermissionController';

// Repository Imports
import { UserRepository } from '../infras/database/repositories/UserRepository';
import { RoleRepository } from '../infras/database/repositories/RoleRepository';
import { AuditRepository } from '../infras/database/repositories/AuditRepository';
import { PermissionRepository } from '../infras/database/repositories/PermissionRepository';
import { ResourceRepository } from '../infras/database/repositories/ResourceRepository';

// Use Case Imports
import { CreateUserUseCase } from '../app/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../app/usecases/user/UpdateUserUseCase';
import { GetUsersUseCase } from '../app/usecases/user/GetUserUseCase';
import { UpdateUserPasswordUseCase } from '../app/usecases/user/UpdateUserPasswordUseCase';
import { LoginUseCase } from '../app/usecases/auth/LoginUseCase';
import { CreateRoleUseCase } from '../app/usecases/role/CreateRoleUseCase';
import { GetRolesUseCase } from '../app/usecases/role/GetRoleUseCase';
import { UpdateRoleUseCase } from '../app/usecases/role/UpdateRoleUseCase';
import { GetAuditsUseCase } from '../app/usecases/audit/GetAuditsUseCase';
import { CreateResourceUseCase } from '../app/usecases/permission/CreateResouceUseCase';
import { CreatePermissionUseCase } from '../app/usecases/permission/CreatePermissionUseCase';

// Gateway Imports
import { JwtAuthGateway } from '../domain/interfaces/gateways/impl/JWTAuthGateway';

// Don't instantiate repositories at module level - do it in the function
export async function initializeRoutes() {
  const router = express.Router();

  // Wait for TypeORM connection to be ready
  const { getConnection } = await import('typeorm');
  const connection = getConnection();
  
  if (!connection.isConnected) {
    await connection.connect();
  }

  // Repositories - now instantiated after connection is ready
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const auditRepository = new AuditRepository();
  const permissionRepository = new PermissionRepository();
  const resourceRepository = new ResourceRepository();

  // Gateway
  const authGateway = new JwtAuthGateway();

  // Use Cases - User
  const createUserUseCase = new CreateUserUseCase(userRepository, roleRepository, auditRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, roleRepository, auditRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository, roleRepository);
  const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(userRepository, auditRepository, authGateway);

  // Use Cases - Auth
  const loginUseCase = new LoginUseCase(
    userRepository, 
    roleRepository, 
    permissionRepository, 
    resourceRepository, 
    auditRepository
  );

  // Use Cases - Role
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, auditRepository);
  const getRolesUseCase = new GetRolesUseCase(roleRepository);
  const updateRoleUseCase = new UpdateRoleUseCase(roleRepository, auditRepository);

  // Use Cases - Audit
  const getAuditsUseCase = new GetAuditsUseCase(auditRepository, roleRepository);

  // Use Cases - Permission
  const createResourceUseCase = new CreateResourceUseCase(resourceRepository, auditRepository);
  const createPermissionUseCase = new CreatePermissionUseCase(permissionRepository, auditRepository, resourceRepository);

  // Controllers
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

  // Middleware
  router.use(express.json());
  router.use(morgan('dev'));

  // ============ Auth Routes ============
  router.post('/api/v1/ecrTrans/login', (req, res) => authController.login(req, res));

  // ============ Protected Routes ============
  router.use(protect);

  // User Routes
  router.post('/api/v1/ecrTrans/insertuser', (req, res) => userController.createUser(req, res));
  router.put('/api/v1/ecrTrans/user/edit/:id', (req, res) => userController.updateUser(req, res));
  router.get('/api/v1/ecrTrans/users', (req, res) => userController.getUsers(req, res));
  router.put('/api/v1/ecrTrans/user/edit/password/:id', (req, res) => userController.updatePassword(req, res));

  // Role Routes
  router.post('/api/v1/ecrTrans/createrole', (req, res) => roleController.createRole(req, res));
  router.get('/api/v1/ecrTrans/roles', (req, res) => roleController.getRoles(req, res));
  router.put('/api/v1/ecrTrans/role/edit/:id', (req, res) => roleController.updateRole(req, res));

  // Audit Routes
  router.get('/api/v1/ecrTrans/audits', (req, res) => auditController.getAudits(req, res));

  // Permission Routes
  router.post('/api/v1/ecrTrans/createResource', (req, res) => permissionController.createResource(req, res));
  router.post('/api/v1/ecrTrans/createPermission', (req, res) => permissionController.createPermission(req, res));

  return router;
}

// For backward compatibility, export a placeholder
const router = express.Router();
export default router;