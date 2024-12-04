import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { SalaryHistory } from '../../types';
import { formatMonthYear } from '../../utils/dates';
import { formatMoney } from '../../utils/format';
import { updateMovementsForSalary, updateAllMovements } from '../../utils/movements';
import EditSalaryModal from '../modals/EditSalaryModal';
import toast from 'react-hot-toast';

interface SalaryHistoryTableProps {
  employeeId: string;
  salaryHistory: SalaryHistory[];
  employmentStartDate: string;
  onRefresh: () => void;
}

export default function SalaryHistoryTable({
  employeeId,
  salaryHistory,
  employmentStartDate,
  onRefresh
}: SalaryHistoryTableProps) {
  const [editingSalary, setEditingSalary] = useState<SalaryHistory | null>(null);
  const [updatingMovements, setUpdatingMovements] = useState<Record<string, boolean>>({});
  const [updatingAll, setUpdatingAll] = useState(false);

  const handleDelete = async (salary: SalaryHistory) => {
    if (!salary.id) return;

    try {
      const sortedHistory = [...salaryHistory].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // No permitir eliminar el primer salario (fecha de ingreso)
      if (salary.id === sortedHistory[sortedHistory.length - 1].id) {
        toast.error('No se puede eliminar el salario inicial');
        return;
      }

      // Solo permitir eliminar el último salario registrado
      if (salary.id !== sortedHistory[0].id) {
        toast.error('Solo se puede eliminar el último salario registrado');
        return;
      }

      const updates: Record<string, any> = {};

      // Actualizar salario anterior si existe
      const previousSalary = sortedHistory[1];
      if (previousSalary) {
        updates[`salaryHistory/${employeeId}/${previousSalary.id}/endDate`] = null;
        updates[`employees/${employeeId}/currentSalary`] = previousSalary.amount;
      }

      // Eliminar salario actual
      updates[`salaryHistory/${employeeId}/${salary.id}`] = null;

      await update(ref(db), updates);
      
      // Actualizar movimientos del salario anterior
      if (previousSalary) {
        await updateMovementsForSalary(employeeId, previousSalary, employmentStartDate);
      }

      toast.success('Salario eliminado exitosamente');
      onRefresh();
    } catch (error) {
      console.error('Error deleting salary:', error);
      toast.error('Error al eliminar el salario');
    }
  };

  const handleUpdateMovements = async (salary: SalaryHistory) => {
    if (!salary.id) return;

    try {
      setUpdatingMovements(prev => ({ ...prev, [salary.id]: true }));
      await updateMovementsForSalary(employeeId, salary, employmentStartDate);
      toast.success('Movimientos actualizados exitosamente');
    } catch (error) {
      console.error('Error updating movements:', error);
      toast.error('Error al actualizar los movimientos');
    } finally {
      setUpdatingMovements(prev => ({ ...prev, [salary.id]: false }));
    }
  };

  const handleUpdateAllMovements = async () => {
    try {
      setUpdatingAll(true);
      await updateAllMovements(employeeId, salaryHistory, employmentStartDate);
      toast.success('Todos los movimientos actualizados exitosamente');
    } catch (error) {
      console.error('Error updating all movements:', error);
      toast.error('Error al actualizar todos los movimientos');
    } finally {
      setUpdatingAll(false);
    }
  };

  const sortedSalaryHistory = [...salaryHistory].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const isFirstSalary = (salaryId: string) => {
    return salaryId === sortedSalaryHistory[sortedSalaryHistory.length - 1].id;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Historial de Salarios</h2>
        <button
          onClick={handleUpdateAllMovements}
          disabled={updatingAll}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 ${
            updatingAll ? 'cursor-wait' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${updatingAll ? 'animate-spin' : ''}`} />
          {updatingAll ? 'Actualizando...' : 'Actualizar Todos los Movimientos'}
        </button>
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
                    <button
                      onClick={() => setEditingSalary(salary)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={isFirstSalary(salary.id)}
                      title={isFirstSalary(salary.id) ? 'No se puede editar el salario inicial' : 'Editar salario'}
                    >
                      <Edit2 className={`w-4 h-4 ${isFirstSalary(salary.id) ? 'opacity-50' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(salary)}
                      className="text-red-600 hover:text-red-900"
                      disabled={salary.id !== sortedSalaryHistory[0].id || isFirstSalary(salary.id)}
                      title={
                        isFirstSalary(salary.id)
                          ? 'No se puede eliminar el salario inicial'
                          : salary.id !== sortedSalaryHistory[0].id
                          ? 'Solo se puede eliminar el último salario'
                          : 'Eliminar salario'
                      }
                    >
                      <Trash2 className={`w-4 h-4 ${
                        (salary.id !== sortedSalaryHistory[0].id || isFirstSalary(salary.id))
                          ? 'opacity-50'
                          : ''
                      }`} />
                    </button>
                    <button
                      onClick={() => handleUpdateMovements(salary)}
                      disabled={updatingMovements[salary.id]}
                      className={`text-green-500 hover:text-green-700 ${
                        updatingMovements[salary.id] ? 'animate-spin' : ''
                      }`}
                      title="Actualizar movimientos"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSalary && (
        <EditSalaryModal
          salary={editingSalary}
          allSalaries={salaryHistory}
          employmentStartDate={employmentStartDate}
          onClose={() => setEditingSalary(null)}
          onSuccess={() => {
            setEditingSalary(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}