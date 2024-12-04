import { useState, useEffect } from 'react';
import { getOrCreateAccount, getAccountMovements, calculateBalance } from '../../utils/accounts';
import { conceptLabels } from '../../utils/constants';
import PaymentConcept from './PaymentConcept';
import toast from 'react-hot-toast';

interface PaymentConceptListProps {
  currentSalary: number;
  employeeId: string;
  onPaymentsChange: (payments: Record<string, { amount: number; days?: number }>) => void;
}

export default function PaymentConceptList({
  currentSalary,
  employeeId,
  onPaymentsChange
}: PaymentConceptListProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [payments, setPayments] = useState<Record<string, { amount: number; days?: number }>>({
    licencia: { amount: 0, days: 0 },
    vacacional: { amount: 0 },
    aguinaldo: { amount: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalances();
  }, [employeeId]);

  const loadBalances = async () => {
    try {
      setLoading(true);
      const concepts = ['licencia', 'vacacional', 'aguinaldo'] as const;
      const newBalances: Record<string, number> = {};

      for (const concept of concepts) {
        const account = await getOrCreateAccount(employeeId, concept);
        const movements = await getAccountMovements(account.id);
        newBalances[concept] = calculateBalance(movements);
      }

      setBalances(newBalances);
    } catch (error) {
      console.error('Error loading balances:', error);
      toast.error('Error al cargar los saldos');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (concept: string, amount: number, days?: number) => {
    const newPayments = {
      ...payments,
      [concept]: { amount, days }
    };
    setPayments(newPayments);
    onPaymentsChange(newPayments);
  };

  if (loading) {
    return <div className="text-center py-4">Cargando saldos...</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(conceptLabels).map(([concept, label]) => (
        <PaymentConcept
          key={concept}
          concept={concept}
          label={label}
          isSelected={selectedConcept === concept}
          balance={balances[concept] || 0}
          payment={payments[concept]}
          currentSalary={currentSalary}
          onSelect={() => setSelectedConcept(selectedConcept === concept ? null : concept)}
          onChange={handlePaymentChange}
        />
      ))}
    </div>
  );
}