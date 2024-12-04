import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { getOrCreateAccount, getAccountMovements, calculateBalance } from '../utils/accounts';
import EmployeeHeader from '../components/employee/EmployeeHeader';
import EmployeeProvisions from '../components/employee/EmployeeProvisions';
import MovementsSection from '../components/movements/MovementsSection';
import SalaryHistorySection from '../components/salary/SalaryHistorySection';
import PaymentHistorySection from '../components/payment/PaymentHistorySection';
import UpdateSalaryModal from '../components/modals/UpdateSalaryModal';
import GeneratePaymentModal from '../components/modals/GeneratePaymentModal';
import toast from 'react-hot-toast';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee, salaryHistory, loading, error, refresh: refreshEmployee } = useEmployee(id);
  const [provisions, setProvisions] = useState({
    licencia: 0,
    vacacional: 0,
    aguinaldo: 0
  });
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadProvisions = useCallback(async () => {
    if (!id) return;

    try {
      const concepts = ['licencia', 'vacacional', 'aguinaldo'] as const;
      const balances = await Promise.all(
        concepts.map(async (concept) => {
          const account = await getOrCreateAccount(id, concept);
          const movements = await getAccountMovements(account.id);
          return {
            concept,
            balance: calculateBalance(movements)
          };
        })
      );

      const newProvisions = balances.reduce((acc, { concept, balance }) => ({
        ...acc,
        [concept]: balance
      }), {
        licencia: 0,
        vacacional: 0,
        aguinaldo: 0
      });

      setProvisions(newProvisions);
    } catch (error) {
      console.error('Error loading provisions:', error);
      toast.error('Error al cargar las provisiones');
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      navigate('/employees');
      return;
    }

    if (employee && id) {
      loadProvisions();
    }
  }, [employee, id, error, navigate, loadProvisions]);

  const handleDataUpdate = useCallback(async () => {
    try {
      await Promise.all([
        refreshEmployee(),
        loadProvisions()
      ]);
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Error al actualizar los datos');
    }
  }, [refreshEmployee, loadProvisions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!employee || !id) return null;

  return (
    <div className="space-y-6">
      <EmployeeHeader
        employee={employee}
        onUpdateSalary={() => setShowSalaryModal(true)}
        onGeneratePayment={() => setShowPaymentModal(true)}
      />

      <EmployeeProvisions
        provisions={provisions}
        salary={employee.currentSalary}
        startDate={employee.startDate}
      />

      <SalaryHistorySection
        employeeId={id}
        salaryHistory={salaryHistory}
        employmentStartDate={employee.startDate}
        onRefresh={handleDataUpdate}
      />

      <PaymentHistorySection 
        employeeId={id}
        employeeName={employee.fullName}
        employeeCI={employee.ci}
        onRefresh={handleDataUpdate}
      />

      <MovementsSection
        employeeId={id}
        onMovementsUpdate={handleDataUpdate}
      />

      {showSalaryModal && (
        <UpdateSalaryModal
          employeeId={id}
          currentSalary={employee.currentSalary}
          salaryHistory={salaryHistory}
          onClose={() => setShowSalaryModal(false)}
          onSuccess={async () => {
            setShowSalaryModal(false);
            await handleDataUpdate();
          }}
        />
      )}

      {showPaymentModal && (
        <GeneratePaymentModal
          employeeId={id}
          employeeName={employee.fullName}
          employeeCI={employee.ci}
          currentSalary={employee.currentSalary}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            setShowPaymentModal(false);
            await handleDataUpdate();
          }}
        />
      )}
    </div>
  );
}