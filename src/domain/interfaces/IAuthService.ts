import { User } from '../entities/User';

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  permissions?: PermissionDTO[];
  role?: RoleDTO;
}

/**
 * Permission DTO for auth response
 */
export interface PermissionDTO {
  id: number;
  create_s: boolean;
  update_s: boolean;
  delete_s: boolean;
  view: boolean;
  resource_id: number;
  role_id: number;
  resourceName: string;
}

/**
 * Role DTO for auth response
 */
export interface RoleDTO {
  id: number;
  name: string;
  keyValue: string;
  is_delete: boolean;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Token payload interface
 */
export interface TokenPayload {
  id: number;
  username: string;
  email?: string;
  roleId?: number;
  roleKeyValue?: string;
  iat?: number;
  exp?: number;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

/**
 * Change password interface
 */
export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Token verification result
 */
export interface TokenVerificationResult {
  valid: boolean;
  decoded?: TokenPayload;
  error?: string;
}

/**
 * Authentication Service Interface
 * Handles all authentication and authorization related operations
 */
export interface IAuthService {
  /**
   * Authenticate a user with username/email and password
   * @param credentials - User login credentials
   * @returns AuthResult with user data and token
   */
  login(credentials: LoginCredentials): Promise<AuthResult>;

  /**
   * Logout a user by invalidating their token
   * @param token - JWT token to invalidate
   * @returns Promise<boolean> indicating success
   */
  logout(token: string): Promise<boolean>;

  /**
   * Verify a JWT token
   * @param token - JWT token to verify
   * @returns TokenVerificationResult with decoded payload or error
   */
  verifyToken(token: string): Promise<TokenVerificationResult>;

  /**
   * Generate a new JWT token for a user
   * @param userId - User ID
   * @param additionalData - Optional additional data to include in token
   * @returns Generated token string
   */
  generateToken(userId: number, additionalData?: Partial<TokenPayload>): Promise<string>;

  /**
   * Refresh an expired token
   * @param expiredToken - Expired JWT token
   * @returns New token string or null if refresh not allowed
   */
  refreshToken(expiredToken: string): Promise<string | null>;

  /**
   * Hash a password
   * @param password - Plain text password
   * @returns Hashed password
   */
  hashPassword(password: string): Promise<string>;

  /**
   * Compare a plain text password with a hash
   * @param password - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns Boolean indicating if password matches
   */
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Object with isValid and message
   */
  validatePasswordStrength(password: string): { isValid: boolean; message: string };

  /**
   * Generate a password reset token
   * @param email - User's email address
   * @returns Reset token string or null if email not found
   */
  generatePasswordResetToken(email: string): Promise<string | null>;

  /**
   * Reset password using reset token
   * @param request - Password reset request data
   * @returns AuthResult with success status
   */
  resetPassword(request: PasswordResetRequest): Promise<AuthResult>;

  /**
   * Change user password (authenticated)
   * @param request - Change password request data
   * @returns AuthResult with success status
   */
  changePassword(request: ChangePasswordRequest): Promise<AuthResult>;

  /**
   * Check if a user has a specific permission
   * @param userId - User ID
   * @param resource - Resource name
   * @param action - Action to check (create, read, update, delete)
   * @returns Boolean indicating if user has permission
   */
  hasPermission(userId: number, resource: string, action: 'create' | 'read' | 'update' | 'delete'): Promise<boolean>;

  /**
   * Get all permissions for a user
   * @param userId - User ID
   * @returns Array of permissions with resource names
   */
  getUserPermissions(userId: number): Promise<PermissionDTO[]>;

  /**
   * Get user role details
   * @param userId - User ID
   * @returns RoleDTO with role information
   */
  getUserRole(userId: number): Promise<RoleDTO | null>;

  /**
   * Check if user is authenticated
   * @param token - JWT token to check
   * @returns Boolean indicating if user is authenticated
   */
  isAuthenticated(token: string): Promise<boolean>;

  /**
   * Get user from token
   * @param token - JWT token
   * @returns User object or null if invalid
   */
  getUserFromToken(token: string): Promise<User | null>;

  /**
   * Validate token expiration
   * @param token - JWT token
   * @returns Boolean indicating if token is expired
   */
  isTokenExpired(token: string): Promise<boolean>;

  /**
   * Blacklist a token (for logout)
   * @param token - Token to blacklist
   * @param expirationTime - How long to keep token in blacklist
   * @returns Promise<void>
   */
  blacklistToken(token: string, expirationTime?: number): Promise<void>;

  /**
   * Check if token is blacklisted
   * @param token - Token to check
   * @returns Boolean indicating if token is blacklisted
   */
  isTokenBlacklisted(token: string): Promise<boolean>;

  /**
   * Get current user ID from token
   * @param token - JWT token
   * @returns User ID or null if invalid
   */
  getUserIdFromToken(token: string): Promise<number | null>;

  /**
   * Generate secure session ID
   * @returns Unique session ID string
   */
  generateSessionId(): string;

  /**
   * Validate session
   * @param sessionId - Session ID to validate
   * @returns Boolean indicating if session is valid
   */
  validateSession(sessionId: string): Promise<boolean>;

  /**
   * Destroy user session
   * @param sessionId - Session ID to destroy
   * @returns Promise<void>
   */
  destroySession(sessionId: string): Promise<void>;

  /**
   * Get rate limit status for login attempts
   * @param identifier - User identifier (username/email/IP)
   * @returns Object with remaining attempts and reset time
   */
  getLoginRateLimit(identifier: string): Promise<{
    remaining: number;
    resetTime: Date;
    isLocked: boolean;
  }>;

  /**
   * Track login attempt
   * @param identifier - User identifier
   * @param success - Whether attempt was successful
   * @returns Promise<void>
   */
  trackLoginAttempt(identifier: string, success: boolean): Promise<void>;

  /**
   * Reset login attempts counter
   * @param identifier - User identifier
   * @returns Promise<void>
   */
  resetLoginAttempts(identifier: string): Promise<void>;

  /**
   * Generate MFA token (if MFA is enabled)
   * @param userId - User ID
   * @returns MFA secret and QR code URL
   */
  generateMFAToken(userId: number): Promise<{ secret: string; qrCodeUrl: string } | null>;

  /**
   * Verify MFA token
   * @param userId - User ID
   * @param token - MFA token to verify
   * @returns Boolean indicating if token is valid
   */
  verifyMFAToken(userId: number, token: string): Promise<boolean>;

  /**
   * Enable MFA for user
   * @param userId - User ID
   * @param token - MFA token to verify
   * @returns Promise<boolean>
   */
  enableMFA(userId: number, token: string): Promise<boolean>;

  /**
   * Disable MFA for user
   * @param userId - User ID
   * @returns Promise<boolean>
   */
  disableMFA(userId: number): Promise<boolean>;

  /**
   * Get security headers for response
   * @returns Object with security headers
   */
  getSecurityHeaders(): Record<string, string>;

  /**
   * Validate CSRF token
   * @param token - CSRF token to validate
   * @param sessionId - Session ID for validation
   * @returns Boolean indicating if token is valid
   */
  validateCSRFToken(token: string, sessionId: string): Promise<boolean>;

  /**
   * Generate CSRF token
   * @param sessionId - Session ID for binding
   * @returns CSRF token string
   */
  generateCSRFToken(sessionId: string): Promise<string>;
}

export default IAuthService;