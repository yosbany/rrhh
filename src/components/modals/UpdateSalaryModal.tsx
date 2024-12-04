import { useState } from 'react';
import { X } from 'lucide-react';
import { SalaryService } from '../../services/SalaryService';
import { formatMoney } from '../../utils/formatters/currency';
import { formatDate, addMonthsMVD } from '../../utils/dates';
import toast from 'react-hot-toast';

interface UpdateSalaryModalProps {
  employeeId: string;
  currentSalary: number;
  salaryHistory: Array<{ startDate: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateSalaryModal({
  employeeId,
  currentSalary,
  salaryHistory,
  onClose,
  onSuccess
}: UpdateSalaryModalProps) {
  // Find the last salary period
  const lastSalary = [...salaryHistory]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  
  // Calculate the next month after the last period
  const minDate = formatDate(addMonthsMVD(new Date(lastSalary.startDate), 1), 'yyyy-MM');

  const [newSalary, setNewSalary] = useState(currentSalary.toString());
  const [selectedDate, setSelectedDate] = useState(minDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const amount = Math.round(parseFloat(newSalary));
      
      if (isNaN(amount) || amount <= 0) {
        toast.error('El salario debe ser un número positivo');
        return;
      }

      await SalaryService.updateSalary(
        employeeId,
        amount,
        selectedDate,
        currentSalary
      );

      toast.success('Salario actualizado exitosamente');
      onSuccess();
    } catch (error) {
      console.error('Error updating salary:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el salario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Actualizar Salario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mes y Año
            </label>
            <input
              type="month"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Debe ser posterior a {formatDate(lastSalary.startDate, 'MMMM yyyy')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nuevo Salario Base
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Salario actual: ${formatMoney(currentSalary)}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Actualizando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}