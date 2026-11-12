import { describe, expect, it } from 'vitest';
import Printer from '../../src/models/Printer';
import { PrinterStatus } from '../../src/types/enums';

describe('Printer model', () => {
  const makePrinter = (overrides: Record<string, unknown> = {}) =>
    Printer.build({
      name: 'Impressora 01',
      model: 'Ender 3 V3 SE',
      manufacturer: 'Creality',
      status: PrinterStatus.AVAILABLE,
      nozzleDiameter: 0.4,
      maxTemperature: 260,
      notes: null,
      ...overrides,
    } as never);

  it('deve identificar impressora disponível', () => {
    expect(makePrinter().isAvailable()).toBe(true);
  });

  it('deve aplicar AVAILABLE como status padrão', () => {
    const printer = Printer.build({ name: 'P1', model: 'M1', manufacturer: 'Fab', maxTemperature: 250 } as never);
    expect(printer.status).toBe(PrinterStatus.AVAILABLE);
  });

  it('deve iniciar impressão quando estiver disponível', () => {
    const printer = makePrinter();
    printer.startPrinting();
    expect(printer.status).toBe(PrinterStatus.PRINTING);
    expect(printer.isAvailable()).toBe(false);
  });

  it('não deve iniciar impressão quando estiver ocupada', () => {
    expect(() => makePrinter({ status: PrinterStatus.PRINTING }).startPrinting()).toThrow(
      'A impressora não está disponível.'
    );
  });

  it('não deve iniciar impressão quando estiver em manutenção', () => {
    expect(() => makePrinter({ status: PrinterStatus.MAINTENANCE }).startPrinting()).toThrow();
  });
});
