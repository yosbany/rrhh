import { DollarSign, Plus } from 'lucide-react';
import { Employee } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatMoney } from '../../utils/format';

interface EmployeeHeaderProps {
  employee: Employee;
  onUpdateSalary: () => void;
  onGeneratePayment: () => void;
}

export default function EmployeeHeader({
  employee,
  onUpdateSalary,
  onGeneratePayment
}: EmployeeHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">CI: {employee.ci}</p>
          <p className="text-sm text-gray-500">
            Fecha de Ingreso: {formatDate(employee.startDate)}
          </p>
          <p className="text-sm text-gray-500">
            Salario Actual: ${formatMoney(employee.currentSalary)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onUpdateSalary}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            <DollarSign className="w-4 h-4" />
            Actualizar Salario
          </button>
          <button
            onClick={onGeneratePayment}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            <Plus className="w-4 h-4" />
            Generar Pago
          </button>
        </div>
      </div>
    </div>
  );
}