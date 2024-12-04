import { useState } from 'react';
import PaymentForm from '../payment/PaymentForm';

interface GeneratePaymentModalProps {
  employeeId: string;
  employeeName: string;
  employeeCI: string;
  currentSalary: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GeneratePaymentModal({
  employeeId,
  employeeName,
  employeeCI,
  currentSalary,
  onClose,
  onSuccess
}: GeneratePaymentModalProps) {
  return (
    <PaymentForm
      employeeId={employeeId}
      employeeName={employeeName}
      employeeCI={employeeCI}
      currentSalary={currentSalary}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}