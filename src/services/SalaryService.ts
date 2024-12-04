import { ref, get, push, update, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { SalaryHistory, Movement } from '../types';
import { 
  startOfMonthMVD, 
  endOfMonthMVD, 
  toISOStringWithTZ,
  isBeforeMVD,
  addMonthsMVD
} from '../utils/dates';
import { recalculateMovements } from '../utils/salary/recalculation';
import { createAuditLog } from '../utils/audit';
import { getAffectedMovements } from '../utils/salary/movements';

export class SalaryService {
  static async updateSalary(
    employeeId: string,
    newAmount: number,
    startDate: string,
    currentSalary: number
  ): Promise<void> {
    try {
      const updates: Record<string, any> = {};
      const timestamp = new Date().toISOString();

      // Get previous salaries
      const previousSalaries = await this.getPreviousSalaries(employeeId);
      
      // Validate start date
      if (previousSalaries.length > 0) {
        const lastSalary = previousSalaries[0];
        const minDate = addMonthsMVD(new Date(lastSalary.startDate), 1);
        
        if (isBeforeMVD(startDate, minDate)) {
          throw new Error('La fecha del nuevo salario debe ser posterior al último salario registrado');
        }
      }

      // Create new salary record
      const salaryRef = push(ref(db, 'salaryHistory/' + employeeId));
      const newSalaryKey = salaryRef.key;

      // Update previous salary end date if exists
      if (previousSalaries.length > 0) {
        const lastSalary = previousSalaries[0];
        updates['salaryHistory/' + employeeId + '/' + lastSalary.id + '/endDate'] = 
          toISOStringWithTZ(endOfMonthMVD(startDate));
      }

      // Add new salary record
      updates['salaryHistory/' + employeeId + '/' + newSalaryKey] = {
        id: newSalaryKey,
        employeeId,
        amount: newAmount,
        startDate: toISOStringWithTZ(startOfMonthMVD(startDate)),
        endDate: null,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // Update employee current salary if start date is current or past
      const now = new Date();
      if (!isBeforeMVD(now, startDate)) {
        updates['employees/' + employeeId + '/currentSalary'] = newAmount;
      }

      // Get and update affected movements
      const affectedMovements = await getAffectedMovements(employeeId, startDate);
      const movementUpdates = await recalculateMovements(
        employeeId,
        newAmount,
        startDate,
        affectedMovements
      );

      // Merge all updates
      Object.assign(updates, movementUpdates);

      // Perform atomic update
      await update(ref(db), updates);

      // Create audit log
      await createAuditLog('salary_update', {
        employeeId,
        previousAmount: currentSalary,
        newAmount,
        startDate,
        affectedMovements: affectedMovements.length,
        isFutureUpdate: isBeforeMVD(now, startDate)
      });
    } catch (error) {
      console.error('Error updating salary:', error);
      throw error;
    }
  }

  private static async getPreviousSalaries(employeeId: string): Promise<SalaryHistory[]> {
    const snapshot = await get(ref(db, 'salaryHistory/' + employeeId));
    if (!snapshot.exists()) return [];

    return Object.values(snapshot.val() as Record<string, SalaryHistory>)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
}