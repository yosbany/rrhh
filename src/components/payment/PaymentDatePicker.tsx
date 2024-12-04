interface PaymentDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PaymentDatePicker({ value, onChange }: PaymentDatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Mes y Año
      </label>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
      />
      <p className="mt-1 text-sm text-gray-500">
        Seleccione el período para el pago
      </p>
    </div>
  );
}