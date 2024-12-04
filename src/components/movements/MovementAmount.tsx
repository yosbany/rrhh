import { formatMoney } from '../../utils/formatters/currency';
import MovementDays from './MovementDays';

interface MovementAmountProps {
  amount: number;
  type: 'credit' | 'debit';
  days?: number | null;
}

export default function MovementAmount({ amount, type, days }: MovementAmountProps) {
  const sign = type === 'credit' ? '+' : '-';
  
  return (
    <span className={`text-sm font-medium ${
      type === 'credit' ? 'text-green-600' : 'text-red-600'
    }`}>
      {sign} ${formatMoney(amount)}
      {days && <MovementDays days={days} />}
    </span>
  );
}