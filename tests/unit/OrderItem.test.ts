import { describe, expect, it } from 'vitest';
import OrderItem from '../../src/models/OrderItem';

describe('OrderItem model', () => {
  const makeItem = (overrides: Record<string, unknown> = {}) =>
    OrderItem.build({ orderId: 1, productId: 2, quantity: 3, unitPrice: 12.5, subtotal: 37.5, ...overrides } as never);

  it('deve calcular o subtotal', () => {
    expect(makeItem().calculateSubtotal()).toBe(37.5);
  });

  it('deve arredondar o subtotal para duas casas decimais', () => {
    expect(makeItem({ quantity: 3, unitPrice: 1.236 }).calculateSubtotal()).toBe(3.71);
  });

  it('deve rejeitar quantidade igual a zero', () => {
    expect(() => makeItem({ quantity: 0 }).calculateSubtotal()).toThrow('Quantidade ou preço inválido.');
  });

  it('deve rejeitar quantidade negativa', () => {
    expect(() => makeItem({ quantity: -1 }).calculateSubtotal()).toThrow();
  });

  it('deve rejeitar preço unitário negativo', () => {
    expect(() => makeItem({ unitPrice: -1 }).calculateSubtotal()).toThrow();
  });

  it('deve aceitar preço unitário igual a zero', () => {
    expect(makeItem({ unitPrice: 0 }).calculateSubtotal()).toBe(0);
  });

  it('deve validar quantidade mínima igual a um', async () => {
    await expect(makeItem({ quantity: 0 }).validate()).rejects.toThrow();
  });
});
