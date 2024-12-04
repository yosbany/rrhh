import { conceptLabels } from '../../utils/constants';

interface MovementsHeaderProps {
  concept: string;
}

export default function MovementsHeader({ concept }: MovementsHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Movimientos - {conceptLabels[concept]}
        </h2>
      </div>
    </div>
  );
}