import { formatMoney } from '../../utils/format';
import { conceptLabels } from '../../utils/constants';

interface PaymentSummaryProps {
  payments: Record<string, { amount: number; days?: number }>;
}

export default function PaymentSummary({ payments }: PaymentSummaryProps) {
  const total = Object.values(payments).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="border-t border-gray-200 pt-4 mt-6">
      <h3 className="text-lg font-medium mb-4">Resumen del Pago</h3>
      <div className="space-y-2">
        {Object.entries(payments).map(([concept, payment]) => (
          payment.amount > 0 && (
            <div key={concept} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {conceptLabels[concept]}
                {payment.days && ` (${payment.days} días)`}
              </span>
              <span className="font-medium">${formatMoney(payment.amount)}</span>
            </div>
          )
        ))}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium">Total</span>
          <span className="font-medium">${formatMoney(total)}</span>
        </div>
      </div>
    </div>
  );
}