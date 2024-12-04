/**
 * Firebase Realtime Database security rules
 */
export const DATABASE_RULES = {
  rules: {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "employees": {
      ".indexOn": ["ci", "status"],
      "$employeeId": {
        ".validate": `
          newData.hasChildren(['fullName', 'ci', 'startDate', 'currentSalary', 'status']) &&
          newData.child('fullName').isString() &&
          newData.child('ci').matches(/^\\d\\.\\d{3}\\.\\d{3}-\\d$/) &&
          newData.child('startDate').isString() &&
          newData.child('currentSalary').isNumber() &&
          newData.child('currentSalary').val() > 0 &&
          newData.child('status').matches(/^(active|inactive)$/)
        `
      }
    },

    "salaryHistory": {
      "$employeeId": {
        ".indexOn": ["startDate"],
        "$salaryId": {
          ".validate": `
            newData.hasChildren(['employeeId', 'amount', 'startDate']) &&
            newData.child('employeeId').val() === $employeeId &&
            newData.child('amount').isNumber() &&
            newData.child('amount').val() > 0 &&
            newData.child('startDate').isString()
          `
        }
      }
    },

    "accounts": {
      "$employeeId": {
        ".indexOn": ["concept"],
        "$accountId": {
          ".validate": `
            newData.hasChildren(['employeeId', 'concept', 'balance']) &&
            newData.child('employeeId').val() === $employeeId &&
            newData.child('concept').matches(/^(licencia|vacacional|aguinaldo)$/) &&
            newData.child('balance').isNumber()
          `
        }
      }
    },

    "movements": {
      "$accountId": {
        ".indexOn": ["date", "type", "status"],
        "$movementId": {
          ".validate": `
            newData.hasChildren(['accountId', 'type', 'amount', 'date', 'status']) &&
            newData.child('accountId').val() === $accountId &&
            newData.child('type').matches(/^(credit|debit)$/) &&
            newData.child('amount').isNumber() &&
            newData.child('amount').val() > 0 &&
            newData.child('date').isString() &&
            newData.child('status').matches(/^(pending|completed|paid|cancelled)$/)
          `
        }
      }
    },

    "payments": {
      "$employeeId": {
        ".indexOn": ["date", "status"],
        "$paymentId": {
          ".validate": `
            newData.hasChildren(['employeeId', 'date', 'total', 'status', 'details']) &&
            newData.child('employeeId').val() === $employeeId &&
            newData.child('total').isNumber() &&
            newData.child('total').val() > 0 &&
            newData.child('date').isString() &&
            newData.child('status').matches(/^(pending|completed|cancelled)$/)
          `
        }
      }
    },

    "auditLogs": {
      ".indexOn": ["entityType", "entityId", "userId", "date"],
      "$logId": {
        ".validate": `
          newData.hasChildren(['userId', 'action', 'entityType', 'entityId', 'date']) &&
          newData.child('action').matches(/^(create|update|delete)$/) &&
          newData.child('entityType').matches(/^(employee|account|movement|payment)$/) &&
          newData.child('date').isString()
        `
      }
    }
  }
};