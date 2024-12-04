import { Calendar, DollarSign } from 'lucide-react';
import { formatMoney } from '../../utils/format';
import { calculateDailySalary } from '../../utils/calculations';

interface EmployeeProvisionsProps {
  provisions: {
    licencia: number;
    vacacional: number;
    aguinaldo: number;
  };
  totalProvisions: number;
  salary: number;
  licenseDays: number;
}

export default function EmployeeProvisions({
  provisions,
  totalProvisions,
  salary,
  licenseDays
}: EmployeeProvisionsProps) {
  const dailySalary = calculateDailySalary(salary);
  const availableLicenseDays = Math.floor(provisions.licencia / dailySalary);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-lg text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Licencia</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${formatMoney(provisions.licencia)}
            </p>
            {availableLicenseDays > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {availableLicenseDays} días disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-lg text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Salario Vacacional</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${formatMoney(provisions.vacacional)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500 p-3 rounded-lg text-white">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Aguinaldo</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${formatMoney(provisions.aguinaldo)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}