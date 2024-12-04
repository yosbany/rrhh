import { formatNumber } from '../../utils/formatters/number';

interface MovementDaysProps {
  days: number | null | undefined;
}

export default function MovementDays({ days }: MovementDaysProps) {
  if (days === null || days === undefined) {
    return null;
  }

  return (
    <span className="text-sm text-gray-500">
      ({formatNumber(days, 2)} días)
    </span>
  );
}