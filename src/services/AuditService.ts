import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { AuditLog } from '../types';
import { getAuditLogPath } from '../config/database/paths';
import { useAuth } from '../contexts/AuthContext';

export class AuditService {
  static async logCreate(
    entityType: AuditLog['entityType'],
    entityId: string,
    data: Record<string, any>
  ): Promise<void> {
    await this.createLog('create', entityType, entityId, data);
  }

  static async logUpdate(
    entityType: AuditLog['entityType'],
    entityId: string,
    changes: Record<string, any>
  ): Promise<void> {
    await this.createLog('update', entityType, entityId, changes);
  }

  static async logDelete(
    entityType: AuditLog['entityType'],
    entityId: string
  ): Promise<void> {
    await this.createLog('delete', entityType, entityId, {});
  }

  private static async createLog(
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    changes: Record<string, any>
  ): Promise<void> {
    const { user } = useAuth();
    if (!user) throw new Error('User not authenticated');

    const logRef = push(ref(db, getAuditLogPath()));
    
    const log: Omit<AuditLog, 'id'> = {
      userId: user.uid,
      action,
      entityType,
      entityId,
      changes,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any
    };

    await logRef.set({ ...log, id: logRef.key });
  }
}