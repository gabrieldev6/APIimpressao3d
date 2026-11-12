import { describe, expect, it } from 'vitest';
import Material from '../../src/models/Material';
import { MaterialType } from '../../src/types/enums';

describe('Material model', () => {
  const makeMaterial = (overrides: Record<string, unknown> = {}) =>
    Material.build({
      name: 'PLA Branco',
      type: MaterialType.PLA,
      color: 'Branco',
      brand: 'Marca Teste',
      diameter: 1.75,
      pricePerKg: 100,
      stockGrams: 1000,
      minStockGrams: 200,
      ...overrides,
    } as never);

  it('deve aplicar os valores padrão de diâmetro e estoque mínimo', () => {
    const material = Material.build({
      name: 'PLA', type: MaterialType.PLA, color: 'Preto', brand: 'Teste', pricePerKg: 100,
    } as never);
    expect(Number(material.diameter)).toBe(1.75);
    expect(material.stockGrams).toBe(0);
    expect(material.minStockGrams).toBe(500);
  });

  it('deve identificar estoque abaixo do mínimo', () => {
    expect(makeMaterial({ stockGrams: 100, minStockGrams: 200 }).hasLowStock()).toBe(true);
  });

  it('deve considerar estoque igual ao mínimo como baixo', () => {
    expect(makeMaterial({ stockGrams: 200, minStockGrams: 200 }).hasLowStock()).toBe(true);
  });

  it('deve identificar estoque suficiente', () => {
    expect(makeMaterial({ stockGrams: 300, minStockGrams: 200 }).hasLowStock()).toBe(false);
  });

  it('deve calcular o custo proporcional ao peso utilizado', () => {
    expect(makeMaterial({ pricePerKg: 100 }).calculateCost(250)).toBe(25);
  });

  it('deve aceitar consumo zero', () => {
    expect(makeMaterial().calculateCost(0)).toBe(0);
  });

  it('deve rejeitar quantidade negativa', () => {
    expect(() => makeMaterial().calculateCost(-1)).toThrow('A quantidade não pode ser negativa.');
  });
});
