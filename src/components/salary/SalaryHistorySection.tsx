import { useState } from 'react';
import { SalaryHistory } from '../../types';
import { formatMonthYear } from '../../utils/formatters/date';
import { formatMoney } from '../../utils/formatters/currency';
import { Trash2 } from 'lucide-react';
import { deleteSalaryHistory } from '../../utils/salary/deletion';
import toast from 'react-hot-toast';

interface SalaryHistorySectionProps {
  employeeId: string;
  salaryHistory: SalaryHistory[];
  employmentStartDate: string;
  onRefresh: () => Promise<void>;
}

export default function SalaryHistorySection({
  employeeId,
  salaryHistory,
  employmentStartDate,
  onRefresh
}: SalaryHistorySectionProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedSalaryHistory = [...salaryHistory].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const isFirstSalary = (salaryId: string) => {
    return salaryId === sortedSalaryHistory[sortedSalaryHistory.length - 1].id;
  };

  const handleDelete = async (salary: SalaryHistory) => {
    if (!confirm('¿Está seguro que desea eliminar este salario? Esta acción eliminará los movimientos asociados y no se puede deshacer.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const success = await deleteSalaryHistory(
        employeeId,
        salary,
        salaryHistory,
        employmentStartDate
      );

      if (success) {
        await onRefresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Historial de Salarios</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes/Año Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes/Año Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSalaryHistory.map((salary) => (
              <tr key={salary.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatMonthYear(salary.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {salary.endDate ? formatMonthYear(salary.endDate) : 'Actual'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${formatMoney(salary.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {!isFirstSalary(salary.id) && salary.id === sortedSalaryHistory[0].id && (
                      <button
                        onClick={() => handleDelete(salary)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isDeleting}
                        title="Eliminar salario"
                      >
                        <Trash2 className={`w-4 h-4 ${isDeleting ? 'opacity-50' : ''}`} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}