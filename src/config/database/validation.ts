import { Employee, Account, Movement, Payment, AuditLog } from '../../types';

/**
 * Data validation schemas and utilities
 */
export const ValidationSchemas = {
  employee: {
    required: ['fullName', 'ci', 'startDate', 'currentSalary', 'status'],
    validate: (data: Partial<Employee>): string[] => {
      const errors: string[] = [];
      
      if (!data.fullName?.trim()) {
        errors.push('El nombre completo es requerido');
      }
      
      if (!data.ci?.match(/^\d\.\d{3}\.\d{3}-\d$/)) {
        errors.push('CI inválida. Formato requerido: X.XXX.XXX-X');
      }
      
      if (!data.startDate) {
        errors.push('La fecha de ingreso es requerida');
      }
      
      if (!data.currentSalary || data.currentSalary <= 0) {
        errors.push('El salario debe ser mayor a 0');
      }
      
      if (!['active', 'inactive'].includes(data.status || '')) {
        errors.push('Estado inválido');
      }
      
      return errors;
    }
  },

  movement: {
    required: ['accountId', 'type', 'amount', 'date', 'status'],
    validate: (data: Partial<Movement>): string[] => {
      const errors: string[] = [];
      
      if (!data.accountId) {
        errors.push('ID de cuenta requerido');
      }
      
      if (!['credit', 'debit'].includes(data.type || '')) {
        errors.push('Tipo de movimiento inválido');
      }
      
      if (!data.amount || data.amount <= 0) {
        errors.push('El monto debe ser mayor a 0');
      }
      
      if (!data.date) {
        errors.push('La fecha es requerida');
      }
      
      if (!['pending', 'completed', 'paid', 'cancelled'].includes(data.status || '')) {
        errors.push('Estado inválido');
      }
      
      return errors;
    }
  },

  payment: {
    required: ['employeeId', 'date', 'total', 'status', 'details'],
    validate: (data: Partial<Payment>): string[] => {
      const errors: string[] = [];
      
      if (!data.employeeId) {
        errors.push('ID de empleado requerido');
      }
      
      if (!data.date) {
        errors.push('La fecha es requerida');
      }
      
      if (!data.total || data.total <= 0) {
        errors.push('El total debe ser mayor a 0');
      }
      
      if (!['pending', 'completed', 'cancelled'].includes(data.status || '')) {
        errors.push('Estado inválido');
      }
      
      if (!Array.isArray(data.details) || data.details.length === 0) {
        errors.push('Se requiere al menos un detalle de pago');
      }
      
      return errors;
    }
  }
};

/**
 * Validate data before writing to database
 */
export function validateData<T>(
  entityType: keyof typeof ValidationSchemas,
  data: Partial<T>
): string[] {
  const schema = ValidationSchemas[entityType];
  if (!schema) {
    throw new Error(`Schema not found for entity type: ${entityType}`);
  }
  
  return schema.validate(data);
}