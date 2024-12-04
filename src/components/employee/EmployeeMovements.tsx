import { useState } from 'react';
import { conceptLabels } from '../../utils/constants';
import MovementsTable from '../movements/MovementsTable';

interface EmployeeMovementsProps {
  employeeId: string;
  onMovementsUpdate: () => void;
}

export default function EmployeeMovements({
  employeeId,
  onMovementsUpdate
}: EmployeeMovementsProps) {
  const [selectedConcept, setSelectedConcept] = useState<string>('aguinaldo');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.entries(conceptLabels).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSelectedConcept(value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedConcept === value
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <MovementsTable
        employeeId={employeeId}
        concept={selectedConcept}
        onMovementsUpdate={onMovementsUpdate}
      />
    </div>
  );
}