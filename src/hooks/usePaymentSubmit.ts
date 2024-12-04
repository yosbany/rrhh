import { PaymentService } from '../services/PaymentService';

interface PaymentDetail {
  amount: number;
  days?: number;
}

export function usePaymentSubmit(employeeId: string) {
  const submitPayment = async (
    payments: Record<string, PaymentDetail>,
    date: string
  ): Promise<boolean> => {
    return PaymentService.submitPayment(employeeId, payments, date);
  };

  return { submitPayment };
}