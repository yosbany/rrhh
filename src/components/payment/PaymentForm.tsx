import { useState } from 'react';
import { usePaymentSubmit } from '../../hooks/usePaymentSubmit';
import { usePaymentReceipt } from '../../hooks/usePaymentReceipt';
import PaymentHeader from './PaymentHeader';
import PaymentDatePicker from './PaymentDatePicker';
import PaymentConceptList from './PaymentConceptList';
import PaymentSummary from './PaymentSummary';
import PaymentActions from './PaymentActions';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  employeeId: string;
  employeeName: string;
  employeeCI: string;
  currentSalary: number;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function PaymentForm({
  employeeId,
  employeeName,
  employeeCI,
  currentSalary,
  onClose,
  onSuccess
}: PaymentFormProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [payments, setPayments] = useState<Record<string, { amount: number; days?: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitPayment } = usePaymentSubmit(employeeId);
  const { generateReceipt } = usePaymentReceipt(employeeName, employeeCI);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const total = Object.values(payments).reduce((sum, p) => sum + p.amount, 0);
    if (total === 0) {
      toast.error('Debe seleccionar al menos un concepto para pagar');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitPayment(payments, selectedDate);
      generateReceipt(payments, selectedDate);
      toast.success('Pago generado exitosamente');
      await onSuccess();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <PaymentHeader onClose={onClose} />
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <PaymentDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <PaymentConceptList
              currentSalary={currentSalary}
              employeeId={employeeId}
              onPaymentsChange={setPayments}
            />
          </div>

          <div className="px-6 py-4">
            <PaymentSummary payments={payments} />
          </div>
          
          <div className="px-6 py-4 bg-gray-50">
            <PaymentActions
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}