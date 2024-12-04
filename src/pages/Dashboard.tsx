import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { DollarSign, Users, Calendar } from 'lucide-react';
import { Employee } from '../types';
import { formatMoney } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProvisions: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employeesSnap, movementsSnap] = await Promise.all([
          get(ref(db, 'employees')),
          get(ref(db, 'movements'))
        ]);

        const employees = employeesSnap.val() || {};
        const movements = movementsSnap.val() || {};

        let totalProvisions = 0;
        let pendingPayments = 0;

        // Calculate totals from all movements
        Object.values(movements).forEach((employeeMovements) => {
          Object.values(employeeMovements as Record<string, any>).forEach((movement) => {
            const amount = Math.round(movement.amount * 100) / 100;
            if (movement.type === 'credit') {
              totalProvisions += amount;
              if (movement.status === 'pending') {
                pendingPayments += amount;
              }
            }
          });
        });

        setStats({
          totalEmployees: Object.keys(employees).length,
          totalProvisions: Math.round(totalProvisions * 100) / 100,
          pendingPayments: Math.round(pendingPayments * 100) / 100
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Empleados</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Provisiones Totales</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ${formatMoney(stats.totalProvisions)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pagos Pendientes</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ${formatMoney(stats.pendingPayments)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}