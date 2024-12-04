import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Trash2 } from 'lucide-react';
import { Employee } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatMoney } from '../../utils/format';

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, onDelete }: EmployeeCardProps) {
  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <Link 
            to={`/employees/${employee.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-gray-700"
          >
            {employee.fullName}
          </Link>
          <button
            onClick={() => onDelete(employee)}
            className="text-red-600 hover:text-red-800"
            title="Eliminar empleado"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">CI: {employee.ci}</p>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Ingreso: {formatDate(employee.startDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Salario: ${formatMoney(employee.currentSalary)}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50">
        <Link
          to={`/employees/${employee.id}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Ver detalles →
        </Link>
      </div>
    </div>
  );
}