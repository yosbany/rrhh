import { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Payment } from '../../types';
import { formatMonthYear } from '../../utils/formatters/date';
import { formatMoney } from '../../utils/formatters/currency';
import { conceptLabels } from '../../utils/constants';
import { usePaymentReceipt } from '../../hooks/usePaymentReceipt';
import { Printer, Trash2 } from 'lucide-react';
import DeletePaymentModal from '../modals/DeletePaymentModal';
import toast from 'react-hot-toast';

interface PaymentHistorySectionProps {
  employeeId: string;
  employeeName: string;
  employeeCI: string;
  onRefresh?: () => Promise<void>;
}

export default function PaymentHistorySection({ 
  employeeId,
  employeeName,
  employeeCI,
  onRefresh 
}: PaymentHistorySectionProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const { generateReceipt } = usePaymentReceipt(employeeName, employeeCI);

  useEffect(() => {
    loadPayments();
  }, [employeeId]);

  const loadPayments = async () => {
    try {
      const snapshot = await get(ref(db, `payments/${employeeId}`));
      if (snapshot.exists()) {
        const paymentsData = Object.values(snapshot.val() as Record<string, Payment>);
        setPayments(paymentsData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;

    try {
      setDeleting(paymentToDelete.id);
      const updates: Record<string, null> = {};

      // Delete payment
      updates[`payments/${employeeId}/${paymentToDelete.id}`] = null;

      // Delete associated movements
      for (const detail of paymentToDelete.details) {
        if (detail.movementId) {
          const accountSnapshot = await get(ref(db, `accounts/${employeeId}`));
          if (accountSnapshot.exists()) {
            const accounts = Object.values(accountSnapshot.val());
            const account = accounts.find((acc: any) => acc.concept === detail.concept);
            if (account) {
              updates[`movements/${account.id}/${detail.movementId}`] = null;
            }
          }
        }
      }

      await update(ref(db), updates);
      toast.success('Pago eliminado exitosamente');
      
      if (onRefresh) {
        await onRefresh();
      } else {
        await loadPayments();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Error al eliminar el pago');
    } finally {
      setDeleting(null);
      setPaymentToDelete(null);
    }
  };

  const handlePrint = (payment: Payment) => {
    const paymentDetails = payment.details.reduce((acc, detail) => {
      acc[detail.concept] = {
        amount: detail.amount,
        days: detail.days || undefined
      };
      return acc;
    }, {} as Record<string, { amount: number; days?: number }>);

    generateReceipt(paymentDetails, payment.date);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center">Cargando pagos...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Historial de Pagos</h2>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conceptos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatMonthYear(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {payment.details.map((detail, index) => (
                          <div key={index}>
                            {conceptLabels[detail.concept]}
                            {detail.days && ` (${detail.days} días)`}:
                            <span className="ml-1 font-medium">
                              ${formatMoney(detail.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${formatMoney(payment.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePrint(payment)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Imprimir recibo"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setPaymentToDelete(payment)}
                          disabled={deleting === payment.id}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                          title="Eliminar pago"
                        >
                          <Trash2 className={`w-5 h-5 ${deleting === payment.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body text-center text-gray-500">
            No hay pagos registrados
          </div>
        )}
      </div>

      {paymentToDelete && (
        <DeletePaymentModal
          payment={paymentToDelete}
          isDeleting={deleting === paymentToDelete.id}
          onConfirm={handleDeleteConfirm}
          onClose={() => setPaymentToDelete(null)}
        />
      )}
    </>
  );
}