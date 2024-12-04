import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Movement } from '../../types';
import { startOfMonthMVD } from '../dates';

export async function getAffectedMovements(
  employeeId: string,
  startDate: string
): Promise<Movement[]> {
  const accounts = await get(ref(db, 'accounts/' + employeeId));
  if (!accounts.exists()) return [];

  const movements: Movement[] = [];
  const startTimestamp = startOfMonthMVD(startDate).getTime();

  for (const account of Object.values(accounts.val())) {
    const accountMovements = await get(ref(db, 'movements/' + account.id));
    if (accountMovements.exists()) {
      const accountMovementsList = Object.values(accountMovements.val() as Record<string, Movement>);
      movements.push(...accountMovementsList.filter(m => 
        new Date(m.date).getTime() >= startTimestamp && 
        m.type === 'credit' &&
        m.status === 'pending'
      ));
    }
  }

  return movements;
}