import { ref, get, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Account, Movement } from '../types';

export async function getOrCreateAccount(
  employeeId: string,
  concept: Account['concept']
): Promise<Account> {
  const accountsRef = ref(db, `accounts/${employeeId}`);
  const snapshot = await get(accountsRef);
  
  if (snapshot.exists()) {
    const accounts = snapshot.val();
    const existingAccount = Object.values(accounts).find(
      (acc: Account) => acc.concept === concept
    );
    if (existingAccount) return existingAccount;
  }

  const newAccountRef = push(ref(db, `accounts/${employeeId}`));
  const newAccount: Account = {
    id: newAccountRef.key!,
    employeeId,
    concept,
    balance: 0,
    lastMovementDate: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await set(newAccountRef, newAccount);
  return newAccount;
}

export async function getAccountMovements(accountId: string): Promise<Movement[]> {
  const movementsRef = ref(db, `movements/${accountId}`);
  const snapshot = await get(movementsRef);
  
  if (!snapshot.exists()) return [];
  
  // Sort movements first by date (month/year) and then by creation time
  return Object.values(snapshot.val() as Record<string, Movement>)
    .sort((a, b) => {
      // First compare by month/year
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const monthYearDiff = dateB.getTime() - dateA.getTime();
      
      // If same month/year, sort by creation time
      if (monthYearDiff === 0) {
        const createdAtA = new Date(a.createdAt);
        const createdAtB = new Date(b.createdAt);
        return createdAtB.getTime() - createdAtA.getTime();
      }
      
      return monthYearDiff;
    });
}

export function calculateBalance(movements: Movement[]): number {
  // Sort movements by date and creation time before calculating balance
  const sortedMovements = [...movements].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const monthYearDiff = dateB.getTime() - dateA.getTime();
    
    if (monthYearDiff === 0) {
      const createdAtA = new Date(a.createdAt);
      const createdAtB = new Date(b.createdAt);
      return createdAtB.getTime() - createdAtA.getTime();
    }
    
    return monthYearDiff;
  });
  
  return sortedMovements.reduce((balance, movement) => {
    const amount = Math.round(movement.amount * 100) / 100;
    if (movement.type === 'credit' && movement.status !== 'paid') {
      return balance + amount;
    } else if (movement.type === 'debit') {
      return balance - amount;
    }
    return balance;
  }, 0);
}