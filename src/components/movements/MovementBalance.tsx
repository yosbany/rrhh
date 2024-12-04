interface MovementBalanceProps {
  balance: number;
}

export default function MovementBalance({ balance }: MovementBalanceProps) {
  return (
    <span className="font-medium">
      ${balance.toFixed(2)}
    </span>
  );
}