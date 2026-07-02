import { SessionRepository } from './repository';
import crypto from 'crypto';

export class SessionService {
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async startSession(branchId: string, tableId: string, guestCount: number) {
    const sessionToken = this.generateSessionToken();
    return await SessionRepository.create({ branchId, tableId, guestCount, sessionToken });
  }

  static async validateSession(sessionToken: string) {
    const session = await SessionRepository.findByToken(sessionToken);
    if (!session) throw new Error('Invalid session token');
    if (session.status !== 'ACTIVE') throw new Error(`Session is ${session.status.toLowerCase()}`);
    
    // Add logic to check expiration
    if (session.expiresAt && new Date() > session.expiresAt) {
      await SessionRepository.updateStatus(session.id, 'EXPIRED');
      throw new Error('Session has expired');
    }

    return session;
  }
}
