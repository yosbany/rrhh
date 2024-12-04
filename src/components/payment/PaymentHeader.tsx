import { X } from 'lucide-react';

interface PaymentHeaderProps {
  onClose: () => void;
}

export default function PaymentHeader({ onClose }: PaymentHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Generar Pago</h2>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}