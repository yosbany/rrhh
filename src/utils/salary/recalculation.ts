import { Movement } from '../../types';
import { calculateLicenseDays, calculateDailySalary } from '../calculations/license';
import { calculateVacationalSalary, calculateAguinaldo } from '../calculations/benefits';

export async function recalculateMovements(
  employeeId: string,
  newSalary: number,
  startDate: string,
  movements: Movement[]
): Promise<Record<string, any>> {
  const updates: Record<string, any> = {};
  const timestamp = new Date().toISOString();

  for (const movement of movements) {
    let newAmount: number;

    switch (movement.concept) {
      case 'licencia': {
        const monthlyDays = calculateLicenseDays(startDate);
        const dailySalary = calculateDailySalary(newSalary);
        newAmount = Math.round(monthlyDays * dailySalary * 100) / 100;
        break;
      }
      case 'vacacional':
        newAmount = calculateVacationalSalary(newSalary);
        break;
      case 'aguinaldo':
        newAmount = calculateAguinaldo(newSalary);
        break;
      default:
        continue;
    }

    updates[`movements/${movement.accountId}/${movement.id}`] = {
      ...movement,
      amount: newAmount,
      baseSalary: newSalary,
      updatedAt: timestamp
    };
  }

  return updates;
}