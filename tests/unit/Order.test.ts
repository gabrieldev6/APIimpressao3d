import { describe, expect, it } from 'vitest';
import Order from '../../src/models/Order';
import { OrderStatus } from '../../src/types/enums';

describe('Order model', () => {
  const makeOrder = (overrides: Record<string, unknown> = {}) =>
    Order.build({
      customerId: 1,
      status: OrderStatus.PENDING,
      totalAmount: 150,
      discount: 20,
      finalAmount: 130,
      notes: null,
      ...overrides,
    } as never);

  it('deve aplicar o status PENDING como padrão', () => {
    const order = Order.build({ customerId: 1 } as never);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('deve calcular o valor final com desconto', () => {
    expect(makeOrder().calculateFinalAmount()).toBe(130);
  });

  it('deve calcular corretamente sem desconto', () => {
    expect(makeOrder({ totalAmount: 99.9, discount: 0 }).calculateFinalAmount()).toBe(99.9);
  });

  it('deve rejeitar total negativo', () => {
    expect(() => makeOrder({ totalAmount: -1 }).calculateFinalAmount()).toThrow('Valores do pedido inválidos.');
  });

  it('deve rejeitar desconto negativo', () => {
    expect(() => makeOrder({ discount: -1 }).calculateFinalAmount()).toThrow();
  });

  it('deve rejeitar desconto maior que o total', () => {
    expect(() => makeOrder({ totalAmount: 10, discount: 11 }).calculateFinalAmount()).toThrow();
  });

  it('deve identificar pedido concluído', () => {
    expect(makeOrder({ status: OrderStatus.COMPLETED }).isCompleted()).toBe(true);
  });

  it('deve cancelar pedido que ainda não foi concluído', () => {
    const order = makeOrder();
    order.cancel();
    expect(order.status).toBe(OrderStatus.CANCELLED);
  });

  it('não deve permitir cancelar pedido concluído', () => {
    expect(() => makeOrder({ status: OrderStatus.COMPLETED }).cancel()).toThrow(
      'Não é possível cancelar um pedido concluído.'
    );
  });
});
