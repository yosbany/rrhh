import { ref, set } from 'firebase/database';
import { db } from '../../lib/firebase';

// Database paths and indexes
export const DB_PATHS = {
  EMPLOYEES: 'employees',
  MOVEMENTS: 'movements',
  PAYMENTS: 'payments',
} as const;

// Database indexes
export const DB_INDEXES = {
  EMPLOYEES_BY_CI: 'indexes/employees/byCI',
  MOVEMENTS_BY_DATE: 'indexes/movements/byDate',
  PAYMENTS_BY_EMPLOYEE: 'indexes/payments/byEmployee',
  AUDIT_BY_ENTITY: 'indexes/audit/byEntity'
} as const;

// Initialize database indexes
export async function initializeIndexes() {
  const updates: Record<string, any> = {};

  // Employee CI index
  updates[`${DB_INDEXES.EMPLOYEES_BY_CI}/.indexOn`] = ['ci'];

  // Movements date index
  updates[`${DB_INDEXES.MOVEMENTS_BY_DATE}/.indexOn`] = ['date'];

  // Payments by employee index
  updates[`${DB_INDEXES.PAYMENTS_BY_EMPLOYEE}/.indexOn`] = ['employeeId', 'date'];

  // Audit logs by entity index
  updates[`${DB_INDEXES.AUDIT_BY_ENTITY}/.indexOn`] = ['entityType', 'entityId'];

  await set(ref(db), updates);
}

// Database rules (to be applied in Firebase Console)
export const DATABASE_RULES = {
  rules: {
    ".read": "auth != null",
    ".write": "auth != null",
    "employees": {
      ".indexOn": ["ci", "status"],
      "$employeeId": {
        ".validate": "newData.hasChildren(['fullName', 'ci', 'startDate', 'currentSalary', 'status'])"
      }
    },
    "accounts": {
      ".indexOn": ["employeeId", "concept"],
      "$accountId": {
        ".validate": "newData.hasChildren(['employeeId', 'concept', 'balance'])"
      }
    },
    "movements": {
      ".indexOn": ["accountId", "date", "status"],
      "$movementId": {
        ".validate": "newData.hasChildren(['accountId', 'type', 'amount', 'date', 'status'])"
      }
    },
    "payments": {
      ".indexOn": ["employeeId", "date", "status"],
      "$paymentId": {
        ".validate": "newData.hasChildren(['employeeId', 'date', 'total', 'status'])"
      }
    },
    "auditLogs": {
      ".indexOn": ["entityType", "entityId", "userId", "action"],
      "$logId": {
        ".validate": "newData.hasChildren(['userId', 'action', 'entityType', 'entityId'])"
      }
    }
  }
};