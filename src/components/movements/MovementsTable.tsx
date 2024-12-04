import { useState, useEffect } from 'react';
import { Movement } from '../../types';
import { getOrCreateAccount, getAccountMovements } from '../../utils/accounts';
import { conceptLabels } from '../../utils/constants';
import MovementList from './MovementList';
import toast from 'react-hot-toast';

interface MovementsTableProps {
  employeeId: string;
  concept: string;
  onMovementsUpdate: () => Promise<void>;
}

export default function MovementsTable({
  employeeId,
  concept,
  onMovementsUpdate
}: MovementsTableProps) {
  const [accountId, setAccountId] = useState<string>('');
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovements = async () => {
      try {
        const account = await getOrCreateAccount(employeeId, concept as Movement['concept']);
        setAccountId(account.id);
        const accountMovements = await getAccountMovements(account.id);
        
        // Sort movements by date (month/year) and creation time
        const sortedMovements = [...accountMovements].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const monthYearDiff = dateB.getTime() - dateA.getTime();
          
          if (monthYearDiff === 0) {
            const createdAtA = new Date(a.createdAt);
            const createdAtB = new Date(b.createdAt);
            return createdAtB.getTime() - createdAtA.getTime();
          }
          
          return monthYearDiff;
        });
        
        setMovements(sortedMovements);
      } catch (error) {
        console.error('Error loading movements:', error);
        toast.error('Error al cargar los movimientos');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && concept) {
      loadMovements();
    }
  }, [employeeId, concept]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">Cargando movimientos...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          Movimientos - {conceptLabels[concept]}
        </h2>
      </div>

      {movements.length > 0 ? (
        <MovementList movements={movements} />
      ) : (
        <div className="p-6 text-center text-gray-500">
          No hay movimientos registrados
        </div>
      )}
    </div>
  );
}