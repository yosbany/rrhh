import { Movement } from '../../types';
import { formatMonthYear } from '../../utils/formatters/date';
import { formatMoney } from '../../utils/formatters/currency';
import MovementType from './MovementType';
import MovementDetails from './MovementDetails';
import MovementActions from './MovementActions';
import { calculateBalance } from '../../utils/accounts';

interface MovementRowProps {
  movement: Movement;
  movements: Movement[];
  index: number;
}

export default function MovementRow({
  movement,
  movements,
  index
}: MovementRowProps) {
  const balance = calculateBalance(movements.slice(index));
  const sign = movement.type === 'credit' ? '+' : '-';
  const amount = formatMoney(movement.amount);
  const days = movement.days !== null && movement.days !== undefined 
    ? ` (${Number(movement.days).toFixed(2)} días)` 
    : '';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatMonthYear(movement.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <MovementType type={movement.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${
          movement.type === 'credit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {sign} ${amount}{days}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${formatMoney(balance)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          <MovementDetails movement={movement} />
          <MovementActions movement={movement} />
        </div>
      </td>
    </tr>
  );
}