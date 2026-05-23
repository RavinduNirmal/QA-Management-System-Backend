import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { IAuthGateway } from '../IAuthGateway';

export class JwtAuthGateway implements IAuthGateway {
  
  generateToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '24h'
    });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }

  generateRefreshToken(userId: number): string {
    return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!);
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const exp = decoded.exp;
      if (!exp) return true;
      return Date.now() >= exp * 1000;
    } catch (error) {
      return true;
    }
  }

  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async compareHashToken(token: string, hashedToken: string): Promise<boolean> {
    const hash = this.hashToken(token);
    return hash === hashedToken;
  }
}

export default JwtAuthGateway;