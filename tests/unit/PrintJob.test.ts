import { describe, expect, it } from 'vitest';
import PrintJob from '../../src/models/PrintJob';
import { PrintJobStatus } from '../../src/types/enums';

describe('PrintJob model', () => {
  const makeJob = (overrides: Record<string, unknown> = {}) =>
    PrintJob.build({
      orderItemId: 1,
      printerId: 1,
      materialId: 1,
      status: PrintJobStatus.PENDING,
      quantity: 2,
      estimatedTime: 120,
      actualTime: null,
      materialUsedGrams: 0,
      startedAt: null,
      finishedAt: null,
      failureReason: null,
      notes: null,
      ...overrides,
    } as never);

  it('deve aplicar PENDING como status padrão', () => {
    const job = PrintJob.build({ orderItemId: 1, printerId: 1, materialId: 1, quantity: 1, estimatedTime: 30 } as never);
    expect(job.status).toBe(PrintJobStatus.PENDING);
  });

  it('deve iniciar um trabalho pendente', () => {
    const job = makeJob();
    job.start();
    expect(job.status).toBe(PrintJobStatus.PRINTING);
    expect(job.startedAt).toBeInstanceOf(Date);
  });

  it('não deve iniciar trabalho que não esteja pendente', () => {
    expect(() => makeJob({ status: PrintJobStatus.PRINTING }).start()).toThrow(
      'Somente trabalhos pendentes podem ser iniciados.'
    );
  });

  it('deve concluir um trabalho em andamento', () => {
    const job = makeJob();
    job.start();
    job.finish(125, 42.5);
    expect(job.status).toBe(PrintJobStatus.COMPLETED);
    expect(job.actualTime).toBe(125);
    expect(Number(job.materialUsedGrams)).toBe(42.5);
    expect(job.finishedAt).toBeInstanceOf(Date);
  });

  it('não deve concluir trabalho que não esteja em andamento', () => {
    expect(() => makeJob().finish(10, 5)).toThrow('O trabalho não está em andamento.');
  });

  it('não deve aceitar tempo real negativo', () => {
    const job = makeJob();
    job.start();
    expect(() => job.finish(-1, 5)).toThrow('Tempo ou consumo inválido.');
  });

  it('não deve aceitar consumo de material negativo', () => {
    const job = makeJob();
    job.start();
    expect(() => job.finish(10, -1)).toThrow('Tempo ou consumo inválido.');
  });

  it('deve marcar como falho um trabalho em andamento', () => {
    const job = makeJob();
    job.start();
    job.fail('Falha de energia');
    expect(job.status).toBe(PrintJobStatus.FAILED);
    expect(job.failureReason).toBe('Falha de energia');
    expect(job.finishedAt).toBeInstanceOf(Date);
  });

  it('não deve marcar como falho um trabalho que não esteja em andamento', () => {
    expect(() => makeJob().fail('Erro')).toThrow(
      'Somente trabalhos em andamento podem falhar.'
    );
  });

  it('deve validar quantidade mínima igual a um', async () => {
    await expect(makeJob({ quantity: 0 }).validate()).rejects.toThrow();
  });
});
