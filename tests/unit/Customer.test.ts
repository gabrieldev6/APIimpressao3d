import { describe, expect, it } from 'vitest';
import Customer from '../../src/models/Customer';

describe('Customer model', () => {
  const makeCustomer = (overrides: Record<string, unknown> = {}) =>
    Customer.build({
      name: 'Cliente Teste',
      email: 'cliente@example.com',
      phone: '(88) 99999-0000',
      document: '12345678900',
      address: 'Rua Central, 100',
      city: 'Aracati',
      state: 'CE',
      zipCode: '62800-000',
      ...overrides,
    } as never);

  it('deve criar uma instância com os dados do cliente', () => {
    const customer = makeCustomer();
    expect(customer.name).toBe('Cliente Teste');
    expect(customer.email).toBe('cliente@example.com');
  });

  it('deve formatar o endereço completo', () => {
    expect(makeCustomer().getFullAddress()).toBe(
      'Rua Central, 100, Aracati - CE, CEP: 62800-000'
    );
  });

  it('deve rejeitar um e-mail inválido', async () => {
    await expect(makeCustomer({ email: 'email-invalido' }).validate()).rejects.toThrow();
  });

  it('deve rejeitar a ausência de campos obrigatórios', async () => {
    await expect(makeCustomer({ name: null }).validate()).rejects.toThrow();
  });
});
