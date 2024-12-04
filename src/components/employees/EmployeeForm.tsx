import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../../lib/firebase';
import { X } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { startOfMonthMVD, toISOStringWithTZ } from '../../utils/dates';
import { conceptLabels } from '../../utils/constants';
import { createInitialMovements } from '../../utils/movements';
import toast from 'react-hot-toast';

interface EmployeeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeForm({ onClose, onSuccess }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    ci: '',
    startDate: '',
    currentSalary: ''
  });

  const [selectedAccounts, setSelectedAccounts] = useState({
    licencia: true,
    vacacional: true,
    aguinaldo: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCI = (ci: string) => {
    const ciRegex = /^\d\.\d{3}\.\d{3}-\d$/;
    return ciRegex.test(ci);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCI(formData.ci)) {
      toast.error('El formato de la CI debe ser X.XXX.XXX-X');
      return;
    }

    // Validate at least one account selected
    if (!Object.values(selectedAccounts).some(selected => selected)) {
      toast.error('Debe seleccionar al menos una cuenta');
      return;
    }

    try {
      setIsSubmitting(true);
      const employeeId = push(ref(db, 'employees')).key!;
      const salary = Math.round(parseFloat(formData.currentSalary));
      
      // Convert the input date to Montevideo timezone
      const startDate = toISOStringWithTZ(startOfMonthMVD(formData.startDate));

      // Create initial salary history record
      const salaryHistoryRef = push(ref(db, `salaryHistory/${employeeId}`));
      
      await Promise.all([
        set(ref(db, `employees/${employeeId}`), {
          id: employeeId,
          fullName: formData.fullName,
          ci: formData.ci,
          startDate,
          currentSalary: salary,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
        set(salaryHistoryRef, {
          id: salaryHistoryRef.key,
          employeeId,
          amount: salary,
          startDate,
          endDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      ]);

      // Create accounts and initial movements
      await createInitialMovements(
        employeeId,
        salary,
        startDate,
        selectedAccounts
      );

      toast.success('Empleado creado exitosamente');
      onSuccess();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Error al crear el empleado');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nuevo Empleado</h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cédula de Identidad
            </label>
            <IMaskInput
              mask="0.000.000-0"
              definitions={{
                '0': /[0-9]/
              }}
              required
              disabled={isSubmitting}
              value={formData.ci}
              onAccept={(value) => setFormData({ ...formData, ci: value })}
              placeholder="X.XXX.XXX-X"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Ingreso
            </label>
            <input
              type="date"
              required
              disabled={isSubmitting}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salario Base
            </label>
            <input
              type="number"
              required
              disabled={isSubmitting}
              min="1"
              step="1"
              value={formData.currentSalary}
              onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuentas a Crear
            </label>
            <div className="space-y-2">
              {Object.entries(conceptLabels).map(([concept, label]) => (
                <label key={concept} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={selectedAccounts[concept]}
                    onChange={(e) => setSelectedAccounts({
                      ...selectedAccounts,
                      [concept]: e.target.checked
                    })}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}