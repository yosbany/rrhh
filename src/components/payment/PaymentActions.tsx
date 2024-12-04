interface PaymentActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export default function PaymentActions({ onClose, isSubmitting }: PaymentActionsProps) {
  return (
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
        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Generando...' : 'Generar Pago'}
      </button>
    </div>
  );
}