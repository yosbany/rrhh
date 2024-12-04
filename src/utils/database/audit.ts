import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../../lib/firebase';
import { AuditLog } from '../../types';
import { DB_PATHS } from './schema';
import { useAuth } from '../../contexts/AuthContext';

export async function createAuditLog(
  action: AuditLog['action'],
  entityType: AuditLog['entityType'],
  entityId: string,
  changes: Record<string, any>
): Promise<void> {
  const { user } = useAuth();
  if (!user) throw new Error('User not authenticated');

  const now = new Date().toISOString();
  const logRef = push(ref(db, DB_PATHS.AUDIT_LOGS));
  
  const log: Omit<AuditLog, 'id'> = {
    userId: user.uid,
    action,
    entityType,
    entityId,
    changes,
    createdAt: now,
    updatedAt: now
  };

  await set(logRef, { ...log, id: logRef.key });
}