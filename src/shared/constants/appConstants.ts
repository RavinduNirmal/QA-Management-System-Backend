export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  
  // Password
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
  SALT_ROUNDS: 12,
  
  // Token
  JWT_EXPIRY: '1h',
  JWT_REFRESH_EXPIRY: '3d',
  
  // Rate Limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  

  // Roles
  SUPER_ADMIN_ROLE: 'SUPER_ADMIN',
  ADMIN_ROLE: 'ADMIN',
  
  // Resources
  DEFAULT_RESOURCES: ['User', 'Role', 'Audit', 'Report', 'Permission', 'Resource'],
  
  // Audit Actions
  AUDIT_ACTIONS: {
    CREATE: 'Create',
    UPDATE: 'Update',
    DELETE: 'Delete',
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    VIEW: 'View',
  },
  
  // Query Operators
  SORT_ORDER: {
    ASC: 'ASC',
    DESC: 'DESC',
  },
};

export default APP_CONSTANTS;