import express, { Router } from 'express';
import morgan from 'morgan';
import { protect } from '../infras/http/middlewares/authMiddleware';
import { IContainer } from './container';

export async function createRoutes(container: IContainer): Promise<Router> {
  const router = express.Router();
  const { userController, authController, roleController, auditController, permissionController } = container;

  // Global Middleware
  router.use(express.json());
  router.use(morgan('dev'));

  // ============ Public Routes ============
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

export default createRoutes;