import { useState, useEffect, useCallback } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { Employee, SalaryHistory } from '../types';
import toast from 'react-hot-toast';

export function useEmployee(employeeId: string | undefined) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployee = useCallback(async () => {
    if (!employeeId) {
      setError(new Error('Employee ID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [employeeSnap, salarySnap] = await Promise.all([
        get(ref(db, `employees/${employeeId}`)),
        get(ref(db, `salaryHistory/${employeeId}`))
      ]);

      if (!employeeSnap.exists()) {
        setError(new Error('Employee not found'));
        toast.error('Empleado no encontrado');
        return;
      }

      const employeeData = employeeSnap.val() as Employee;
      setEmployee(employeeData);

      if (salarySnap.exists()) {
        const history = Object.values(salarySnap.val()) as SalaryHistory[];
        setSalaryHistory(history.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        ));
      } else {
        setSalaryHistory([]);
      }

      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching employee:', err);
      toast.error('Error al cargar los datos del empleado');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const refresh = useCallback(async () => {
    await fetchEmployee();
  }, [fetchEmployee]);

  return { employee, salaryHistory, loading, error, refresh };
}