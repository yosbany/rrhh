/**
 * Calculates vacation salary (20% of base salary)
 */
export function calculateVacationalSalary(salary: number): number {
  return Math.round((salary * 0.2) * 100) / 100;
}

/**
 * Calculates aguinaldo (one month's salary divided by 12)
 */
export function calculateAguinaldo(salary: number): number {
  return Math.round((salary / 12) * 100) / 100;
}