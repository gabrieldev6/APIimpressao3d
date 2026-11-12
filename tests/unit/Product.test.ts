import { describe, expect, it } from 'vitest';
import Product from '../../src/models/Product';

describe('Product model', () => {
  const makeProduct = (overrides: Record<string, unknown> = {}) =>
    Product.build({
      name: 'Suporte de câmera',
      description: 'Suporte impresso em 3D',
      sku: 'SUP-CAM-001',
      category: 'Acessórios',
      weight: 50,
      printTime: 120,
      cost: 12.5,
      price: 30,
      isActive: true,
      ...overrides,
    } as never);

  it('deve criar uma instância de produto', () => {
    const product = makeProduct();
    expect(product.name).toBe('Suporte de câmera');
    expect(product.sku).toBe('SUP-CAM-001');
  });

  it('deve calcular o lucro unitário', () => {
    expect(makeProduct().calculateProfit()).toBe(17.5);
  });

  it('deve calcular o custo total para uma quantidade', () => {
    expect(makeProduct({ cost: 12.5 }).calculateTotalCost(4)).toBe(50);
  });

  it('deve rejeitar quantidade zero', () => {
    expect(() => makeProduct().calculateTotalCost(0)).toThrow('A quantidade deve ser um inteiro positivo.');
  });

  it('deve rejeitar quantidade negativa', () => {
    expect(() => makeProduct().calculateTotalCost(-2)).toThrow();
  });

  it('deve rejeitar quantidade fracionária', () => {
    expect(() => makeProduct().calculateTotalCost(1.5)).toThrow();
  });

  it('deve desativar o produto', () => {
    const product = makeProduct();
    product.deactivate();
    expect(product.isActive).toBe(false);
  });
});
