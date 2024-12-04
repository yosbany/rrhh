import { formatMoney } from '../../utils/format';

interface PaymentConceptProps {
  concept: string;
  label: string;
  isSelected: boolean;
  balance: number;
  payment: { amount: number; days?: number };
  currentSalary: number;
  onSelect: () => void;
  onChange: (concept: string, amount: number, days?: number) => void;
}

export default function PaymentConcept({
  concept,
  label,
  isSelected,
  balance,
  payment,
  currentSalary,
  onSelect,
  onChange
}: PaymentConceptProps) {
  const handleAmountChange = (value: string) => {
    const parsedValue = parseFloat(value) || 0;
    const newAmount = Math.max(0, Math.min(parsedValue, balance));
    onChange(concept, newAmount, payment.days);
  };

  const handleDaysChange = (value: string) => {
    if (concept !== 'licencia') return;
    
    const parsedValue = parseInt(value) || 0;
    const dailySalary = Math.round(currentSalary / 30);
    const maxDays = Math.floor(balance / dailySalary);
    const newDays = Math.max(0, Math.min(parsedValue, maxDays));
    const newAmount = newDays * dailySalary;
    
    onChange(concept, newAmount, newDays);
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isSelected ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSelect}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              isSelected ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
            }`}
          >
            {isSelected && (
              <span className="block w-2 h-2 rounded-full bg-white" />
            )}
          </button>
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm text-gray-500">
          Disponible: ${formatMoney(balance)}
        </div>
      </div>

      {isSelected && (
        <div className="space-y-4">
          {concept === 'licencia' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Días
              </label>
              <input
                type="number"
                min="0"
                value={payment.days || 0}
                onChange={(e) => handleDaysChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="0"
                max={balance}
                value={payment.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}