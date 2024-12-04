import { Employee, Movement } from '../types';
import { Report } from '../types/reports';

export function generateReport(
  employees: Record<string, Employee>,
  movements: Record<string, Record<string, Movement>>
): Report {
  const report: Report = {
    totalProvisions: 0,
    totalPaid: 0,
    totalPending: 0,
    byType: {},
    byEmployee: {}
  };

  // Initialize report structure
  Object.entries(employees).forEach(([employeeId, employee]) => {
    report.byEmployee[employeeId] = {
      name: employee.fullName,
      provisions: 0,
      paid: 0,
      pending: 0
    };
  });

  // Process movements
  Object.entries(movements).forEach(([employeeId, employeeMovements]) => {
    Object.values(employeeMovements).forEach((movement) => {
      const amount = Math.round(movement.amount * 100) / 100;

      // Initialize concept if not exists
      if (!report.byType[movement.concept]) {
        report.byType[movement.concept] = {
          total: 0,
          paid: 0,
          pending: 0
        };
      }

      if (movement.type === 'credit') {
        report.totalProvisions += amount;
        report.byType[movement.concept].total += amount;
        report.byEmployee[employeeId].provisions += amount;

        if (movement.status === 'paid') {
          report.totalPaid += amount;
          report.byType[movement.concept].paid += amount;
          report.byEmployee[employeeId].paid += amount;
        } else {
          report.totalPending += amount;
          report.byType[movement.concept].pending += amount;
          report.byEmployee[employeeId].pending += amount;
        }
      }
    });
  });

  return report;
}