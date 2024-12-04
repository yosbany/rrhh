import { differenceInMonthsMVD } from '../dates';

export function calculateDailySalary(salary: number): number {
  return Math.round((salary / 30) * 100) / 100;
}

export function calculateLicenseDays(startDate: string): number {
  const years = Math.abs(differenceInMonthsMVD(new Date(), startDate)) / 12;
  
  // Base: 20 days per year = 1.67 days per month
  const baseDaysPerMonth = 20 / 12;
  
  // After 5 years: +1 day every 4 years
  if (years > 5) {
    const additionalDays = Math.floor((years - 5) / 4);
    const additionalDaysPerMonth = additionalDays / 12;
    return Math.round((baseDaysPerMonth + additionalDaysPerMonth) * 100) / 100;
  }
  
  return 1.67; // Fixed 1.67 days per month for first 5 years
}

export function calculateLicenseAmount(salary: number, days: number): number {
  const dailySalary = calculateDailySalary(salary);
  return Math.round(dailySalary * days * 100) / 100;
}