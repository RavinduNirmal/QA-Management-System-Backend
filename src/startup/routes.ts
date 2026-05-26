import express, { Router } from 'express';
import morgan from 'morgan';
import { protect } from '../infras/http/middlewares/authMiddleware';
import { IContainer } from './container';

export async function createRoutes(container: IContainer): Promise<Router> {
  const router = express.Router();
  const { userController, authController, roleController, auditController, permissionController ,  projectController, testSuiteController ,
    testCaseController, testExecutionController, testCycleController ,  defectController } = container;

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

  // ============ Project Routes ============
 router.post('/api/v1/ecrTrans/projects', (req, res) => projectController.createProject(req, res));
 router.get('/api/v1/ecrTrans/projects', (req, res) => projectController.getProjects(req, res));
 router.post('/api/v1/ecrTrans/projects/assign-user', (req, res) => projectController.assignUserToProject(req, res));
router.get('/api/v1/ecrTrans/projects/:projectId/users', (req, res) => projectController.getProjectUsers(req, res));
router.get('/api/v1/ecrTrans/users/:userId/projects', (req, res) => projectController.getUserProjects(req, res));

// ============ Test Suite Routes ============
router.post('/api/v1/ecrTrans/test-suites', (req, res) => testSuiteController.createTestSuite(req, res));
router.get('/api/v1/ecrTrans/test-suites', (req, res) => testSuiteController.getTestSuites(req, res));

// ============ Test Case Routes ============
router.post('/api/v1/ecrTrans/test-cases', (req, res) => testCaseController.createTestCase(req, res));
router.get('/api/v1/ecrTrans/test-cases', (req, res) => testCaseController.getTestCases(req, res));
router.put('/api/v1/ecrTrans/test-cases/:id', (req, res) => testCaseController.updateTestCase(req, res));

// ============ Test Execution Routes ============
router.post('/api/v1/ecrTrans/test-executions', (req, res) => testExecutionController.executeTestCase(req, res));
router.get('/api/v1/ecrTrans/test-executions', (req, res) => testExecutionController.getExecutions(req, res));
router.get('/api/v1/ecrTrans/test-executions/stats/:projectId', (req, res) => testExecutionController.getExecutionStats(req, res));

// ============ Milestone & Test Cycle Routes ============
router.post('/api/v1/ecrTrans/milestones', (req, res) => testCycleController.createMilestone(req, res));
router.get('/api/v1/ecrTrans/milestones', (req, res) => testCycleController.getMilestones(req, res));
router.post('/api/v1/ecrTrans/test-cycles', (req, res) => testCycleController.createTestCycle(req, res));
router.get('/api/v1/ecrTrans/test-cycles', (req, res) => testCycleController.getTestCycles(req, res));
router.put('/api/v1/ecrTrans/test-cycles/:id', (req, res) => testCycleController.updateTestCycle(req, res));
router.get('/api/v1/ecrTrans/test-cycles/:id/summary', (req, res) => testCycleController.getTestCycleSummary(req, res));

// ============ Defect Routes ============
router.post('/api/v1/ecrTrans/defects', (req, res) => defectController.createDefect(req, res));
router.get('/api/v1/ecrTrans/defects', (req, res) => defectController.getDefects(req, res));
router.get('/api/v1/ecrTrans/defects/stats/:projectId', (req, res) => defectController.getDefectStats(req, res));
router.put('/api/v1/ecrTrans/defects/:id', (req, res) => defectController.updateDefect(req, res));


return router;
}

export default createRoutes;