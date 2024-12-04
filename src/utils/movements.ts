import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Movement } from '../types';
import { calculateLicenseDays, calculateDailySalary } from './calculations/license';
import { calculateVacationalSalary, calculateAguinaldo } from './calculations/benefits';
import { 
  startOfMonthMVD,
  getCurrentDateMVD,
  isBeforeMVD,
  toISOStringWithTZ,
  addMonthsMVD
} from './dates';
import { getOrCreateAccount } from './accounts';

export async function createInitialMovements(
  employeeId: string,
  salary: number,
  startDate: string,
  selectedAccounts: Record<string, boolean>
): Promise<void> {
  const start = startOfMonthMVD(startDate);
  const now = getCurrentDateMVD();

  if (isBeforeMVD(now, start)) {
    throw new Error('La fecha de ingreso no puede ser posterior a la fecha actual');
  }

  let currentDate = start;

  while (!isBeforeMVD(now, currentDate)) {
    if (selectedAccounts.licencia) {
      await createLicenseMovement(employeeId, salary, currentDate, startDate);
    }
    if (selectedAccounts.vacacional) {
      await createVacationalMovement(employeeId, salary, currentDate);
    }
    if (selectedAccounts.aguinaldo) {
      await createAguinaldoMovement(employeeId, salary, currentDate);
    }
    
    currentDate = addMonthsMVD(currentDate, 1);
  }
}

async function createLicenseMovement(
  employeeId: string,
  salary: number,
  date: Date,
  startDate: string
): Promise<void> {
  const account = await getOrCreateAccount(employeeId, 'licencia');
  const monthlyDays = calculateLicenseDays(startDate);
  const dailySalary = calculateDailySalary(salary);
  const amount = Math.round(monthlyDays * dailySalary * 100) / 100;

  const movement: Omit<Movement, 'id'> = {
    accountId: account.id,
    concept: 'licencia',
    type: 'credit',
    amount,
    date: toISOStringWithTZ(date),
    order: 0,
    days: monthlyDays,
    baseSalary: salary,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const movementRef = push(ref(db, `movements/${account.id}`));
  await set(movementRef, { ...movement, id: movementRef.key });
}

async function createVacationalMovement(
  employeeId: string,
  salary: number,
  date: Date
): Promise<void> {
  const account = await getOrCreateAccount(employeeId, 'vacacional');
  const amount = calculateVacationalSalary(salary);

  const movement: Omit<Movement, 'id'> = {
    accountId: account.id,
    concept: 'vacacional',
    type: 'credit',
    amount: Math.round(amount * 100) / 100,
    date: toISOStringWithTZ(date),
    order: 0,
    days: null,
    baseSalary: salary,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const movementRef = push(ref(db, `movements/${account.id}`));
  await set(movementRef, { ...movement, id: movementRef.key });
}

async function createAguinaldoMovement(
  employeeId: string,
  salary: number,
  date: Date
): Promise<void> {
  const account = await getOrCreateAccount(employeeId, 'aguinaldo');
  const amount = calculateAguinaldo(salary);

  const movement: Omit<Movement, 'id'> = {
    accountId: account.id,
    concept: 'aguinaldo',
    type: 'credit',
    amount: Math.round(amount * 100) / 100,
    date: toISOStringWithTZ(date),
    order: 0,
    days: null,
    baseSalary: salary,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const movementRef = push(ref(db, `movements/${account.id}`));
  await set(movementRef, { ...movement, id: movementRef.key });
}

export async function updateMovementsForSalary(
  employeeId: string,
  salary: { amount: number; startDate: string; endDate: string | null },
  employmentStartDate: string
): Promise<void> {
  const start = startOfMonthMVD(salary.startDate);
  const end = salary.endDate ? startOfMonthMVD(salary.endDate) : getCurrentDateMVD();
  
  let currentDate = start;
  
  while (!isBeforeMVD(end, currentDate)) {
    await Promise.all([
      createLicenseMovement(employeeId, salary.amount, currentDate, employmentStartDate),
      createVacationalMovement(employeeId, salary.amount, currentDate),
      createAguinaldoMovement(employeeId, salary.amount, currentDate)
    ]);
    
    currentDate = addMonthsMVD(currentDate, 1);
  }
}

export async function updateAllMovements(
  employeeId: string,
  salaryHistory: Array<{ amount: number; startDate: string; endDate: string | null }>,
  employmentStartDate: string
): Promise<void> {
  for (const salary of salaryHistory) {
    await updateMovementsForSalary(employeeId, salary, employmentStartDate);
  }
}