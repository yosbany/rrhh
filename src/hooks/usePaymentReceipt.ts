import { jsPDF } from 'jspdf';
import { formatMonthYear } from '../utils/dates';
import { formatMoney } from '../utils/format';
import { conceptLabels } from '../utils/constants';

interface PaymentDetail {
  amount: number;
  days?: number;
}

export function usePaymentReceipt(employeeName: string, employeeCI: string) {
  const generateReceipt = (
    payments: Record<string, { amount: number; days?: number }>,
    date: string
  ) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.text('Recibo de Pago', pageWidth / 2, y, { align: 'center' });
    
    y += 20;
    
    // Employee Info
    doc.setFontSize(12);
    doc.text(`Empleado: ${employeeName}`, 20, y);
    y += 10;
    doc.text(`CI: ${employeeCI}`, 20, y);
    y += 10;
    doc.text(`Período: ${formatMonthYear(date)}`, 20, y);
    
    y += 20;

    // Payment Details
    doc.setFontSize(12);
    let total = 0;

    Object.entries(payments).forEach(([concept, payment]) => {
      if (payment.amount > 0) {
        doc.text(conceptLabels[concept], 20, y);
        if (payment.days) {
          doc.text(`(${payment.days} días)`, 80, y);
        }
        doc.text(`$${formatMoney(payment.amount)}`, pageWidth - 40, y, { align: 'right' });
        y += 10;
        total += payment.amount;
      }
    });

    // Total
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 15;
    doc.setFontSize(14);
    doc.text('Total:', 20, y);
    doc.text(`$${formatMoney(total)}`, pageWidth - 40, y, { align: 'right' });

    // Signature
    y += 40;
    doc.line(20, y, 100, y);
    y += 10;
    doc.setFontSize(10);
    doc.text('Firma del empleado', 20, y);

    // Save
    doc.save(`recibo-${employeeName.toLowerCase().replace(/\s+/g, '-')}-${date}.pdf`);
  };

  return { generateReceipt };
}