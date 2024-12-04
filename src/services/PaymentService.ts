import { ref, push, set, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { Movement, Payment } from '../types';
import { toISOStringWithTZ, startOfMonthMVD } from '../utils/dates';
import { getOrCreateAccount } from '../utils/accounts';

interface PaymentDetail {
  amount: number;
  days?: number;
}

export class PaymentService {
  static async submitPayment(
    employeeId: string,
    payments: Record<string, PaymentDetail>,
    date: string
  ): Promise<boolean> {
    try {
      const paymentDate = toISOStringWithTZ(startOfMonthMVD(date));
      const paymentRef = push(ref(db, `payments/${employeeId}`));
      const paymentId = paymentRef.key!;
      
      const total = Object.values(payments)
        .reduce((sum, p) => sum + Math.round(p.amount * 100) / 100, 0);
      
      // Create debit movements first to get their IDs
      const movementDetails = await Promise.all(
        Object.entries(payments)
          .filter(([_, detail]) => detail.amount > 0)
          .map(async ([concept, detail]) => {
            const account = await getOrCreateAccount(employeeId, concept as Movement['concept']);
            const movementRef = push(ref(db, `movements/${account.id}`));
            const movementId = movementRef.key!;

            const movement: Omit<Movement, 'id'> = {
              accountId: account.id,
              concept: concept as Movement['concept'],
              type: 'debit',
              amount: Math.round(detail.amount * 100) / 100,
              date: paymentDate,
              days: detail.days ? Math.round(detail.days * 100) / 100 : null,
              status: 'completed',
              reference: paymentId,
              order: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            return {
              concept: concept as Movement['concept'],
              amount: detail.amount,
              days: detail.days,
              movementId,
              movement,
              accountId: account.id
            };
          })
      );

      // Create payment with movement IDs
      const payment: Omit<Payment, 'id'> = {
        employeeId,
        date: paymentDate,
        total,
        status: 'completed',
        details: movementDetails.map(detail => ({
          concept: detail.concept,
          amount: Math.round(detail.amount * 100) / 100,
          days: detail.days ? Math.round(detail.days * 100) / 100 : null,
          movementId: detail.movementId
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create batch update
      const updates: Record<string, any> = {
        [`payments/${employeeId}/${paymentId}`]: { ...payment, id: paymentId }
      };

      // Add movements to batch update
      movementDetails.forEach(detail => {
        updates[`movements/${detail.accountId}/${detail.movementId}`] = {
          ...detail.movement,
          id: detail.movementId
        };
      });

      // Perform atomic update
      await update(ref(db), updates);

      return true;
    } catch (error) {
      console.error('Error submitting payment:', error);
      throw new Error('Error al procesar el pago. Por favor, intente nuevamente.');
    }
  }
}