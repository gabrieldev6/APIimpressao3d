import { Request, Response } from 'express';
import { Customer, Order, OrderItem, Payment } from '../models';
import { OrderStatus } from '../types/enums';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class OrderController {

  static async index(_req: Request, res: Response) {
    try {
      const orders = await Order.findAll({
        include: [
          { model: Customer, as: 'customer' },
          { model: OrderItem, as: 'items' },
          { model: Payment, as: 'payments' },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(orders);
    } catch (error) {
      return handleControllerError(res, error, 'pedidos');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const order = await Order.findByPk(id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: OrderItem, as: 'items' },
          { model: Payment, as: 'payments' },
        ],
      });

      if (!order) {
        return notFound(res, 'Pedido');
      }

      return res.status(200).json(order);
    } catch (error) {
      return handleControllerError(res, error, 'pedido');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        customerId,
        status = OrderStatus.PENDING,
        totalAmount = 0,
        discount = 0,
        notes = null,
      } = req.body;

      const amount = Number(totalAmount);
      const discountAmount = Number(discount);

      const orderDraft = Order.build({
        customerId,
        status,
        totalAmount: amount,
        discount: discountAmount,
        finalAmount: 0,
        notes,
      });

      const finalAmount = orderDraft.calculateFinalAmount();

      const order = await Order.create({
        customerId,
        status,
        totalAmount: amount,
        discount: discountAmount,
        finalAmount,
        notes,
      });

      return res.status(201).json({ message: 'Pedido cadastrado com sucesso.', order });
    } catch (error) {

      if (
        error instanceof Error &&
        error.message === 'Valores do pedido inválidos.'
      ) {
        return res.status(400).json({ message: error.message });
      }

      return handleControllerError(res, error, 'pedido');

    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return notFound(res, 'Pedido');
      }

      let totalAmount = Number(req.body.totalAmount);
      if (req.body.totalAmount === undefined) {
        totalAmount = Number(order.totalAmount);
      }

      let discount = Number(req.body.discount);
      if (req.body.discount === undefined) {
        discount = Number(order.discount);
      }

      let notes = req.body.notes;
      if (req.body.notes === undefined) {
        notes = order.notes;
      }

      const draft = Order.build({
        customerId: req.body.customerId ?? order.customerId,
        status: req.body.status ?? order.status,
        totalAmount,
        discount,
        finalAmount: 0,
        notes,
      });

      const finalAmount = draft.calculateFinalAmount();
      const data: Record<string, unknown> = {
        totalAmount,
        discount,
        finalAmount,
      };

      for (const key of ['customerId', 'status', 'notes'] as const) {
        if (req.body[key] !== undefined) {
          data[key] = req.body[key];
        }
      }

      await order.update(data);
      return res.status(200).json({ message: 'Pedido atualizado com sucesso.', order });
    } catch (error) {
       if (
        error instanceof Error &&
        error.message === 'Valores do pedido inválidos.'
      ) {
        return res.status(400).json({ message: error.message });
      }

      return handleControllerError(res, error, 'pedido');
    }
  }

  static async cancel(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return notFound(res, 'Pedido');
      }

      order.cancel();
      await order.save();

      return res.status(200).json({ message: 'Pedido cancelado com sucesso.', order });
    } catch (error) {
      if (error instanceof Error && error.message === 'Não é possível cancelar um pedido concluído.') {
        return res.status(409).json({ message: error.message });
      }
      return handleControllerError(res, error, 'pedido');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return notFound(res, 'Pedido');
      }

      await order.destroy();
      return res.status(200).json({ message: 'Pedido removido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'pedido');
    }
  }
}