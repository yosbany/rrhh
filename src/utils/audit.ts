import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';

interface AuditData {
  employeeId: string;
  previousAmount: number;
  newAmount: number;
  startDate: string;
  affectedMovements: number;
  isFutureUpdate?: boolean;
}

export async function createAuditLog(
  action: string,
  data: AuditData
): Promise<void> {
  const logRef = push(ref(db, 'auditLogs'));
  
  const log = {
    id: logRef.key,
    action,
    data,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  await set(logRef, log);
}