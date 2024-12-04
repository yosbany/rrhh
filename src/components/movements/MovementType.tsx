interface MovementTypeProps {
  type: 'credit' | 'debit';
}

export default function MovementType({ type }: MovementTypeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      type === 'credit'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    }`}>
      {type === 'credit' ? 'Crédito' : 'Débito'}
    </span>
  );
}