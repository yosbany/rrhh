/**
 * Database path constants to ensure consistency across the application
 */
export const DB_PATHS = {
  EMPLOYEES: 'employees',
  SALARY_HISTORY: 'salaryHistory',
  ACCOUNTS: 'accounts',
  MOVEMENTS: 'movements',
  PAYMENTS: 'payments',
  USERS: 'users',
  AUDIT_LOGS: 'auditLogs',
  INDEXES: {
    EMPLOYEES: 'indexes/employees',
    MOVEMENTS: 'indexes/movements',
    PAYMENTS: 'indexes/payments',
    AUDIT: 'indexes/audit'
  }
} as const;

/**
 * Type-safe path builder functions
 */
export const getEmployeePath = (employeeId?: string) => 
  employeeId ? `${DB_PATHS.EMPLOYEES}/${employeeId}` : DB_PATHS.EMPLOYEES;

export const getSalaryHistoryPath = (employeeId?: string) =>
  employeeId ? `${DB_PATHS.SALARY_HISTORY}/${employeeId}` : DB_PATHS.SALARY_HISTORY;

export const getAccountPath = (employeeId?: string, accountId?: string) => {
  const base = `${DB_PATHS.ACCOUNTS}/${employeeId}`;
  return accountId ? `${base}/${accountId}` : base;
};

export const getMovementPath = (accountId?: string, movementId?: string) => {
  const base = `${DB_PATHS.MOVEMENTS}/${accountId}`;
  return movementId ? `${base}/${movementId}` : base;
};

export const getPaymentPath = (employeeId?: string, paymentId?: string) => {
  const base = `${DB_PATHS.PAYMENTS}/${employeeId}`;
  return paymentId ? `${base}/${paymentId}` : base;
};

export const getAuditLogPath = (logId?: string) =>
  logId ? `${DB_PATHS.AUDIT_LOGS}/${logId}` : DB_PATHS.AUDIT_LOGS;