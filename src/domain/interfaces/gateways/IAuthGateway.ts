export interface IAuthGateway {
  /**
   * Generate a JWT token for a user
   * @param userId - User ID
   * @returns JWT token string
   */
  generateToken(userId: number): string;

  /**
   * Verify a JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   * @throws Error if token is invalid
   */
  verifyToken(token: string): any;

  /**
   * Hash a password using bcrypt
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
   * Generate a refresh token
   * @param userId - User ID
   * @returns Refresh token string
   */
  generateRefreshToken?(userId: number): string;

  /**
   * Verify a refresh token
   * @param token - Refresh token to verify
   * @returns Decoded token payload
   */
  verifyRefreshToken?(token: string): any;

  /**
   * Decode a JWT token without verification
   * @param token - JWT token
   * @returns Decoded token payload
   */
  decodeToken?(token: string): any;

  /**
   * Check if a token is expired
   * @param token - JWT token
   * @returns Boolean indicating if token is expired
   */
  isTokenExpired?(token: string): boolean;

  /**
   * Get token expiration date
   * @param token - JWT token
   * @returns Expiration date or null
   */
  getTokenExpiry?(token: string): Date | null;

  /**
   * Generate a secure random token
   * @param length - Token length in bytes (default: 32)
   * @returns Secure random token as hex string
   */
  generateSecureToken?(length?: number): string;

  /**
   * Hash a token using SHA-256
   * @param token - Token to hash
   * @returns Hashed token
   */
  hashToken?(token: string): string;

  /**
   * Compare a token with its hash
   * @param token - Plain token
   * @param hashedToken - Hashed token to compare against
   * @returns Boolean indicating if token matches
   */
  compareHashToken?(token: string, hashedToken: string): Promise<boolean>;
}

export default IAuthGateway;