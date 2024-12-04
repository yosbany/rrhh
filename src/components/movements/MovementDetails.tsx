import { useState } from 'react';
import { Movement } from '../../types';
import { formatMoney } from '../../utils/formatters/currency';
import { calculateDailySalary } from '../../utils/calculations/license';
import { differenceInMonthsMVD } from '../../utils/dates';
import { Info, X } from 'lucide-react';

interface MovementDetailsProps {
  movement: Movement;
}

export default function MovementDetails({ movement }: MovementDetailsProps) {
  const [showModal, setShowModal] = useState(false);

  const renderLicenseDetails = () => {
    if (!movement.baseSalary) return null;

    const dailySalary = calculateDailySalary(movement.baseSalary);
    const years = Math.abs(differenceInMonthsMVD(new Date(), movement.date)) / 12;
    const daysPerYear = years > 5 
      ? 20 + Math.floor((years - 5) / 4)
      : 20;
    const monthlyDays = Math.round((daysPerYear / 12) * 100) / 100;
    const calculatedAmount = Math.round(dailySalary * monthlyDays * 100) / 100;

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Base de Cálculo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salario base:</span>
              <span className="font-medium">${formatMoney(movement.baseSalary)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Jornal diario:</span>
              <span className="font-medium">${formatMoney(dailySalary)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              (Salario base / 30 días)
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Cálculo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Días acumulados al año:</span>
              <span className="font-medium">{daysPerYear} días</span>
            </div>
            <div className="text-sm text-gray-500">
              {years < 5 
                ? '(Antigüedad menor a 5 años = 20 días)'
                : `(20 días base + ${daysPerYear - 20} días adicionales por antigüedad)`
              }
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Días acumulados al mes:</span>
              <span className="font-medium">{monthlyDays.toFixed(2)} días</span>
            </div>
            <div className="text-sm text-gray-500">
              (Días acumulados al año / 12)
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">${formatMoney(calculatedAmount)}</span>
            </div>
            <div className="text-sm text-gray-500">
              (Jornal diario × Días acumulados al mes)
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBenefitDetails = () => {
    if (!movement.baseSalary) return null;

    const calculatedAmount = movement.concept === 'vacacional'
      ? Math.round(movement.baseSalary * 0.2 * 100) / 100
      : Math.round(movement.baseSalary / 12 * 100) / 100;

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Base de Cálculo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salario base:</span>
              <span className="font-medium">${formatMoney(movement.baseSalary)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Cálculo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {movement.concept === 'vacacional' ? 'Porcentaje' : 'Proporción'}:
              </span>
              <span className="font-medium">
                {movement.concept === 'vacacional' ? '20%' : '1/12'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">${formatMoney(calculatedAmount)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {movement.concept === 'vacacional'
                ? '(Salario base × 20%)'
                : '(Salario base / 12 meses)'
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (movement.type === 'credit') {
      switch (movement.concept) {
        case 'licencia':
          return renderLicenseDetails();
        case 'vacacional':
        case 'aguinaldo':
          return renderBenefitDetails();
        default:
          return null;
      }
    }
    return null;
  };

  const details = renderDetails();
  if (!details) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        title="Ver detalles del cálculo"
      >
        <Info className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                    Detalles del Cálculo
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-2">
                  {details}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}