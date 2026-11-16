import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  MaterialType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrinterStatus,
  PrintJobStatus,
} from '../../src/types/enums';
import app from '../../src/app';
import {
  Customer,
  Material,
  Order,
  OrderItem,
  Payment,
  Printer,
  PrintJob,
  Product,
  User,
} from '../../src/models';

async function makeCustomer() {
  return Customer.create({
    name: 'Cliente de Teste',
    email: 'cliente.teste@example.com',
    phone: '85999990000',
    document: '12345678901',
    address: 'Rua de Teste, 100',
    city: 'Aracati',
    state: 'CE',
    zipCode: '62800-000',
  });
}

async function makeProduct() {
  return Product.create({
    name: 'Suporte de câmera',
    description: 'Peça impressa em 3D para câmera FPV',
    sku: 'SUP-CAM-001',
    category: 'Acessórios',
    weight: 35.5,
    printTime: 120,
    cost: 8.5,
    price: 20,
    isActive: true,
  });
}

async function makeMaterial() {
  return Material.create({
    name: 'PLA Preto',
    type: MaterialType.PLA,
    color: 'Preto',
    brand: 'Filamento Teste',
    diameter: 1.75,
    pricePerKg: 89.9,
    stockGrams: 1000,
    minStockGrams: 100,
  });
}

async function makePrinter() {
  return Printer.create({
    name: 'Ender de Teste',
    model: 'Ender 3 V3 SE',
    manufacturer: 'Creality',
    status: PrinterStatus.AVAILABLE,
    nozzleDiameter: 0.4,
    maxTemperature: 260,
    notes: null,
  });
}

async function makeOrder() {
  const customer = await makeCustomer();

  return Order.create({
    customerId: customer.id,
    status: OrderStatus.PENDING,
    totalAmount: 100,
    discount: 10,
    finalAmount: 90,
    notes: null,
  });
}

async function makeOrderItem() {
  const order = await makeOrder();
  const product = await makeProduct();

  return OrderItem.create({
    orderId: order.id,
    productId: product.id,
    quantity: 2,
    unitPrice: 20,
    subtotal: 40,
  });
}

async function makePayment() {
  const order = await makeOrder();

  return Payment.create({
    orderId: order.id,
    amount: 0.01,
    method: PaymentMethod.PIX,
    status: PaymentStatus.PENDING,
    transactionId: null,
    paidAt: null,
  });
}

async function makePrintJob() {
  const orderItem = await makeOrderItem();
  const printer = await makePrinter();
  const material = await makeMaterial();

  return PrintJob.create({
    orderItemId: orderItem.id,
    printerId: printer.id,
    materialId: material.id,
    status: PrintJobStatus.PENDING,
    quantity: 1,
    estimatedTime: 90,
    actualTime: null,
    materialUsedGrams: 0,
    startedAt: null,
    finishedAt: null,
    failureReason: null,
    notes: null,
  });
}

describe('API - testes de integração HTTP + Sequelize + MySQL', () => {
  
  it('GET / deve responder com a mensagem inicial', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to the API');
  });
  
  describe('Users', () => {
    const payload = {
      name: 'Usuário Teste',
      email: 'usuario@example.com',
      password: 'senha-forte',
      role: 'USER',
    };

    it('cria, lista e consulta um usuário', async () => {
      const created = await request(app).post('/api/users').send(payload).expect(201);
      const id = created.body.user.id;

      expect(created.body.user.email).toBe(payload.email);
      expect(created.body.user.password).toBeUndefined();

      const list = await request(app).get('/api/users').expect(200);
      expect(list.body).toHaveLength(1);

      const found = await request(app).get(`/api/users/${id}`).expect(200);
      expect(found.body.id).toBe(id);
    });

    it('rejeita e-mail duplicado', async () => {
      await request(app).post('/api/users').send(payload).expect(201);
      await request(app).post('/api/users').send(payload).expect(409);
    });

    it('retorna 404 para usuário inexistente', async () => {
      await request(app).get('/api/users/99999').expect(404);
    });
  });

  describe('Customers', () => {
    const payload = {
      name: 'Cliente HTTP',
      email: 'http.cliente@example.com',
      phone: '85988887777',
      document: '98765432100',
      address: 'Rua A, 10',
      city: 'Aracati',
      state: 'CE',
      zipCode: '62800-000',
    };

    it('executa criação, listagem, consulta, atualização e exclusão', async () => {
      const created = await request(app).post('/api/customers').send(payload).expect(201);
      const id = created.body.customer.id;

      await request(app)
        .get('/api/customers')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(1);
        });

      await request(app).get(`/api/customers/${id}`).expect(200);
      await request(app).patch(`/api/customers/${id}`).send({ name: 'Cliente Atualizado' }).expect(200);
      await request(app).delete(`/api/customers/${id}`).expect(200);
      await request(app).get(`/api/customers/${id}`).expect(404);
    });

    it('valida ID inválido', async () => {
      await request(app).get('/api/customers/abc').expect(400);
    });
  });

  describe('Products', () => {
    const payload = {
      name: 'Produto HTTP',
      description: 'Produto para teste',
      sku: 'HTTP-001',
      category: 'Teste',
      weight: 12.5,
      printTime: 60,
      cost: 5,
      price: 15,
    };

    it('executa criação, listagem, consulta, atualização, desativação e exclusão', async () => {
      const created = await request(app).post('/api/products').send(payload).expect(201);
      const id = created.body.product.id;

      await request(app).get('/api/products').expect(200);
      await request(app).get(`/api/products/${id}`).expect(200);

      await request(app).patch(`/api/products/${id}`).send({ price: 18 }).expect(200);

      const deactivated = await request(app).patch(`/api/products/${id}/deactivate`).expect(200);
      expect(deactivated.body.product.isActive).toBe(false);

      await request(app).delete(`/api/products/${id}`).expect(200);
    });

    it('rejeita SKU duplicado', async () => {

      await request(app).post('/api/products').send(payload).expect(201);
      await request(app).post('/api/products').send(payload).expect(409);
    });
  });

  describe('Materials', () => {
    const payload = {
      name: 'PETG Azul',
      type: 'PETG',
      color: 'Azul',
      brand: 'Marca Teste',
      diameter: 1.75,
      pricePerKg: 99.9,
      stockGrams: 750,
      minStockGrams: 100,
    };

    it('executa CRUD de materiais', async () => {
      const created = await request(app).post('/api/materials').send(payload).expect(201);
      const id = created.body.material.id;

      await request(app).get('/api/materials').expect(200);
      await request(app).get(`/api/materials/${id}`).expect(200);

      await request(app).patch(`/api/materials/${id}`).send({ stockGrams: 650 }).expect(200);
      await request(app).delete(`/api/materials/${id}`).expect(200);
      await request(app).get(`/api/materials/${id}`).expect(404);
    });
  });

  describe('Printers', () => {
    const payload = {
      name: 'Impressora HTTP',
      model: 'Ender 3',
      manufacturer: 'Creality',
      nozzleDiameter: 0.4,
      maxTemperature: 260,
    };

    it('cria, lista, consulta, atualiza, inicia e exclui impressora', async () => {
      const created = await request(app).post('/api/printers').send(payload).expect(201);
      const id = created.body.printer.id;

      await request(app).get('/api/printers').expect(200);

      await request(app).get(`/api/printers/${id}`).expect(200);
      await request(app).patch(`/api/printers/${id}`).send({ notes: 'Bico revisado' }).expect(200);

      const started = await request(app).patch(`/api/printers/${id}/start`).expect(200);
      expect(started.body.printer.status).toBe('PRINTING');

      await request(app).delete(`/api/printers/${id}`).expect(200);
    });

    it('não inicia uma impressora que já está ocupada', async () => {
      const printer = await makePrinter();
      await printer.update({ status: PrinterStatus.PRINTING });

      await request(app).patch(`/api/printers/${printer.id}/start`).expect(409);
    });
  });

  describe('Orders', () => {
    it('cria, lista, consulta, atualiza, cancela e exclui pedido', async () => {
      const customer = await makeCustomer();

      const created = await request(app)
        .post('/api/orders')
        .send({
          customerId: customer.id,
          totalAmount: 100,
          discount: 10,
          notes: 'Pedido de teste',
        })
        .expect(201);

      const id = created.body.order.id;
      expect(Number(created.body.order.finalAmount)).toBe(90);

      await request(app).get('/api/orders').expect(200);
      await request(app).get(`/api/orders/${id}`).expect(200);
      await request(app).patch(`/api/orders/${id}`).send({ discount: 15 }).expect(200);
      await request(app).patch(`/api/orders/${id}/notes`).expect(200);
      await request(app).delete(`/api/orders/${id}`).expect(200);
    });

    it('rejeita desconto maior que o total', async () => {
      const customer = await makeCustomer();

      await request(app)
        .post('/api/orders')
        .send({
          customerId: customer.id,
          totalAmount: 10,
          discount: 20,
        })
        .expect(400);
    });
  });

  describe('Order items', () => {
    it('cria, lista, consulta, atualiza e exclui item de pedido', async () => {
      const order = await makeOrder();
      const product = await makeProduct();

      const created = await request(app)
        .post('/api/order-items')
        .send({
          orderId: order.id,
          productId: product.id,
          quantity: 3,
        })
        .expect(201);

      const id = created.body.item.id;
      expect(Number(created.body.item.subtotal)).toBe(60);

      await request(app).get('/api/order-items').expect(200);
      await request(app).get(`/api/order-items/${id}`).expect(200);
      await request(app).patch(`/api/order-items/${id}`).send({ quantity: 4 }).expect(200);
      await request(app).delete(`/api/order-items/${id}`).expect(200);
    });

    it('rejeita quantidade zero', async () => {
      const order = await makeOrder();
      const product = await makeProduct();

      await request(app)
        .post('/api/order-items')
        .send({
          orderId: order.id,
          productId: product.id,
          quantity: 0,
        })
        .expect(400);
    });
  });

  describe('Payments', () => {
    it('cria, lista, consulta, atualiza, confirma e exclui pagamento de R$ 0,01', async () => {
      const order = await makeOrder();

      const created = await request(app)
        .post('/api/payments')
        .send({
          orderId: order.id,
          amount: 0.01,
          method: 'PIX',
        })
        .expect(201);

      const id = created.body.payment.id;
      expect(Number(created.body.payment.amount)).toBe(0.01);

      await request(app).get('/api/payments').expect(200);
      await request(app).get(`/api/payments/${id}`).expect(200);
      await request(app).patch(`/api/payments/${id}`).send({ transactionId: 'TX-TEST-001' }).expect(200);

      const paid = await request(app).patch(`/api/payments/${id}/mark-as-paid`).expect(200);
      expect(paid.body.payment.status).toBe('APPROVED');
      expect(paid.body.payment.paidAt).toBeTruthy();

      await request(app).delete(`/api/payments/${id}`).expect(200);
    });

    it('não permite pagamento inferior a R$ 0,01', async () => {
      const order = await makeOrder();

      await request(app)
        .post('/api/payments')
        .send({
          orderId: order.id,
          amount: 0,
          method: 'PIX',
        })
        .expect(400);
    });
  });

  describe('Print jobs', () => {
    it('cria, lista, consulta, inicia e finaliza trabalho de impressão', async () => {
      const orderItem = await makeOrderItem();
      const printer = await makePrinter();
      const material = await makeMaterial();

      const created = await request(app)
        .post('/api/print-jobs')
        .send({
          orderItemId: orderItem.id,
          printerId: printer.id,
          materialId: material.id,
          quantity: 1,
          estimatedTime: 90,
        })
        .expect(201);

      const id = created.body.job.id;

      await request(app).get('/api/print-jobs').expect(200);
      await request(app).get(`/api/print-jobs/${id}`).expect(200);

      const started = await request(app).patch(`/api/print-jobs/${id}/start`).expect(200);
      expect(started.body.job.status).toBe('PRINTING');

      const finished = await request(app)
        .patch(`/api/print-jobs/${id}/finish`)
        .send({
          actualTime: 95,
          materialUsedGrams: 18.5,
        })
        .expect(200);

      expect(finished.body.job.status).toBe('COMPLETED');

      await request(app).patch(`/api/print-jobs/${id}`).send({ notes: 'Concluído para teste' }).expect(200);
      await request(app).delete(`/api/print-jobs/${id}`).expect(200);
    });

    it('registra falha de um trabalho em andamento', async () => {
      const job = await makePrintJob();

      await request(app).patch(`/api/print-jobs/${job.id}/start`).expect(200);

      const failed = await request(app)
        .patch(`/api/print-jobs/${job.id}/fail`)
        .send({
          reason: 'Falha de adesão na primeira camada',
        })
        .expect(200);

      expect(failed.body.job.status).toBe('FAILED');
      expect(failed.body.job.failureReason).toBe('Falha de adesão na primeira camada');
    });

    it('exige motivo ao registrar falha', async () => {
      const job = await makePrintJob();

      await request(app).patch(`/api/print-jobs/${job.id}/start`).expect(200);
      await request(app).patch(`/api/print-jobs/${job.id}/fail`).send({ reason: ' ' }).expect(400);
    });
  });
});