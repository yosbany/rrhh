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
  
  return Object.values(snapshot.val() as Record<string, Movement>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculateBalance(movements: Movement[]): number {
  return movements.reduce((balance, movement) => {
    const amount = Math.round(movement.amount * 100) / 100;
    if (movement.type === 'credit' && movement.status !== 'paid') {
      return balance + amount;
    } else if (movement.type === 'debit') {
      return balance - amount;
    }
    return balance;
  }, 0);
}