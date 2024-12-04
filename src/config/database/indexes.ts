import { DB_PATHS } from './paths';

/**
 * Database index definitions for optimized queries
 */
export const DB_INDEXES = {
  EMPLOYEES: {
    BY_CI: {
      path: `${DB_PATHS.INDEXES.EMPLOYEES}/byCI`,
      fields: ['ci']
    },
    BY_STATUS: {
      path: `${DB_PATHS.INDEXES.EMPLOYEES}/byStatus`,
      fields: ['status']
    }
  },
  MOVEMENTS: {
    BY_DATE: {
      path: `${DB_PATHS.INDEXES.MOVEMENTS}/byDate`,
      fields: ['date', 'type']
    },
    BY_STATUS: {
      path: `${DB_PATHS.INDEXES.MOVEMENTS}/byStatus`,
      fields: ['status', 'date']
    }
  },
  PAYMENTS: {
    BY_EMPLOYEE: {
      path: `${DB_PATHS.INDEXES.PAYMENTS}/byEmployee`,
      fields: ['employeeId', 'date']
    },
    BY_STATUS: {
      path: `${DB_PATHS.INDEXES.PAYMENTS}/byStatus`,
      fields: ['status', 'date']
    }
  },
  AUDIT: {
    BY_ENTITY: {
      path: `${DB_PATHS.INDEXES.AUDIT}/byEntity`,
      fields: ['entityType', 'entityId', 'date']
    },
    BY_USER: {
      path: `${DB_PATHS.INDEXES.AUDIT}/byUser`,
      fields: ['userId', 'date']
    }
  }
};

/**
 * Initialize database indexes
 */
export const initializeIndexes = async () => {
  const updates: Record<string, any> = {};

  // Add index definitions
  Object.values(DB_INDEXES).forEach(indexGroup => {
    Object.values(indexGroup).forEach(index => {
      updates[`${index.path}/.indexOn`] = index.fields;
    });
  });

  return updates;
};