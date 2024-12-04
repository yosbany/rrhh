export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee extends BaseEntity {
  fullName: string;
  ci: string;
  startDate: string;
  currentSalary: number;
  status: 'active' | 'inactive';
}

export interface SalaryHistory extends BaseEntity {
  employeeId: string;
  amount: number;
  startDate: string;
  endDate: string | null;
}

export interface Account extends BaseEntity {
  employeeId: string;
  concept: 'licencia' | 'vacacional' | 'aguinaldo';
  balance: number;
  lastMovementDate: string | null;
  status: 'active' | 'inactive';
}

export interface Movement extends BaseEntity {
  accountId: string;
  concept: 'licencia' | 'vacacional' | 'aguinaldo';
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  order: number;
  days: number | null;
  baseSalary?: number;
  status: 'pending' | 'completed' | 'paid' | 'cancelled';
  reference?: string;
  metadata?: Record<string, any>;
}

export interface Payment extends BaseEntity {
  employeeId: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  details: PaymentDetail[];
}

export interface PaymentDetail {
  concept: 'licencia' | 'vacacional' | 'aguinaldo';
  amount: number;
  days: number | null;
  movementId: string;
}