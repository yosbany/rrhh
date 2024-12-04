import { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Employee } from '../../types';
import EmployeeCard from './EmployeeCard';
import toast from 'react-hot-toast';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const snapshot = await get(ref(db, 'employees'));
      if (snapshot.exists()) {
        const employeesData = Object.values(snapshot.val() as Record<string, Employee>);
        setEmployees(employeesData);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Error al cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`¿Está seguro que desea eliminar al empleado ${employee.fullName}? Esta acción eliminará todos los datos asociados y no se puede deshacer.`)) {
      return;
    }

    try {
      const updates: Record<string, null> = {
        [`employees/${employee.id}`]: null,
        [`salaryHistory/${employee.id}`]: null,
        [`movements/${employee.id}`]: null
      };

      await update(ref(db), updates);
      toast.success('Empleado eliminado exitosamente');
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error al eliminar el empleado');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onDelete={handleDeleteEmployee}
        />
      ))}
    </div>
  );
}