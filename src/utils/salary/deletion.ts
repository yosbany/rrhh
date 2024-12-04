import { ref, get, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { SalaryHistory, Movement } from '../../types';
import { startOfMonthMVD, endOfMonthMVD } from '../dates';
import { updateMovementsForSalary } from '../movements';
import toast from 'react-hot-toast';

export async function deleteSalaryHistory(
  employeeId: string,
  salaryToDelete: SalaryHistory,
  allSalaryHistory: SalaryHistory[],
  employmentStartDate: string
): Promise<boolean> {
  try {
    const sortedHistory = [...allSalaryHistory].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    // No permitir eliminar el primer salario (fecha de ingreso)
    if (salaryToDelete.id === sortedHistory[sortedHistory.length - 1].id) {
      toast.error('No se puede eliminar el salario inicial');
      return false;
    }

    // Solo permitir eliminar el último salario registrado
    if (salaryToDelete.id !== sortedHistory[0].id) {
      toast.error('Solo se puede eliminar el último salario registrado');
      return false;
    }

    // Get previous salary
    const previousSalary = sortedHistory[1];
    if (!previousSalary) {
      toast.error('Error al encontrar el salario anterior');
      return false;
    }

    const updates: Record<string, any> = {};

    // Update previous salary end date and employee current salary
    updates[`salaryHistory/${employeeId}/${previousSalary.id}/endDate`] = null;
    updates[`employees/${employeeId}/currentSalary`] = previousSalary.amount;

    // Delete current salary
    updates[`salaryHistory/${employeeId}/${salaryToDelete.id}`] = null;

    // Delete affected movements
    const affectedMovements = await getAffectedMovements(
      employeeId,
      salaryToDelete.startDate,
      salaryToDelete.endDate
    );

    affectedMovements.forEach(movement => {
      updates[`movements/${movement.accountId}/${movement.id}`] = null;
    });

    // Perform atomic update
    await update(ref(db), updates);

    // Regenerate movements for previous salary period
    await updateMovementsForSalary(employeeId, previousSalary, employmentStartDate);

    toast.success('Salario eliminado exitosamente');
    return true;
  } catch (error) {
    console.error('Error deleting salary:', error);
    toast.error('Error al eliminar el salario');
    return false;
  }
}

async function getAffectedMovements(
  employeeId: string,
  startDate: string,
  endDate: string | null
): Promise<Movement[]> {
  const accounts = await get(ref(db, `accounts/${employeeId}`));
  if (!accounts.exists()) return [];

  const movements: Movement[] = [];
  const start = startOfMonthMVD(startDate).getTime();
  const end = endDate ? endOfMonthMVD(endDate).getTime() : Date.now();

  for (const account of Object.values(accounts.val())) {
    const accountMovements = await get(ref(db, `movements/${account.id}`));
    if (accountMovements.exists()) {
      const accountMovementsList = Object.values(accountMovements.val() as Record<string, Movement>);
      movements.push(...accountMovementsList.filter(m => {
        const movementDate = new Date(m.date).getTime();
        return movementDate >= start && 
               movementDate <= end && 
               m.type === 'credit' &&
               m.status === 'pending';
      }));
    }
  }

  return movements;
}