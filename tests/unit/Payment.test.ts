import { describe, expect, it } from 'vitest';
import Payment from '../../src/models/Payment';
import { PaymentMethod, PaymentStatus } from '../../src/types/enums';

describe('Payment model', () => {
  const makePayment = (overrides: Record<string, unknown> = {}) =>
    Payment.build({
      orderId: 1,
      amount: 100,
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
      transactionId: null,
      paidAt: null,
      ...overrides,
    } as never);

  it('deve aplicar PENDING como status padrão', () => {
    const payment = Payment.build({ orderId: 1, amount: 100, method: PaymentMethod.PIX } as never);
    expect(payment.status).toBe(PaymentStatus.PENDING);
  });

  it('deve indicar que pagamento aprovado está pago', () => {
    expect(makePayment({ status: PaymentStatus.APPROVED }).isPaid()).toBe(true);
  });

  it('deve indicar que pagamento pendente não está pago', () => {
    expect(makePayment().isPaid()).toBe(false);
  });

  it('deve marcar pagamento como aprovado e preencher paidAt', () => {
    const payment = makePayment();
    payment.markAsPaid();
    expect(payment.status).toBe(PaymentStatus.APPROVED);
    expect(payment.paidAt).toBeInstanceOf(Date);
  });

  it('deve rejeitar valor inferior ao mínimo de R$ 0,01', async () => {
    await expect(makePayment({ amount: 0 }).validate()).rejects.toThrow();
  });

  it('deve aceitar valor igual a R$ 0,01', async () => {
    await expect(makePayment({ amount: 0.01 }).validate()).resolves.toBeUndefined();
  });
});
