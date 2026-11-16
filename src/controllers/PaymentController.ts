import { Request, Response } from 'express';
import { Order, Payment } from '../models';
import { PaymentStatus } from '../types/enums';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class PaymentController {
  
  static async index(req: Request, res: Response) {
    try {
      let where;
      if (req.query.orderId) {
        where = { orderId: Number(req.query.orderId) };
      }

      const payments = await Payment.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(payments);
    } catch (error) {
      return handleControllerError(res, error, 'pagamentos');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return notFound(res, 'Pagamento');
      }

      return res.status(200).json(payment);
    } catch (error) {
      return handleControllerError(res, error, 'pagamento');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        orderId,
        amount,
        method,
        status = PaymentStatus.PENDING,
        transactionId = null,
      } = req.body;

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      const payment = await Payment.create({
        orderId,
        amount,
        method,
        status,
        transactionId,
        paidAt: null,
      });

      return res.status(201).json({ message: 'Pagamento registrado com sucesso.', payment });
    } catch (error) {
      return handleControllerError(res, error, 'pagamento');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return notFound(res, 'Pagamento');
      }

      const fields = ['amount', 'method', 'status', 'transactionId', 'paidAt'] as const;
      const data = Object.fromEntries(
        fields
          .filter((key) => req.body[key] !== undefined)
          .map((key) => [key, req.body[key]])
      );

      await payment.update(data);
      return res.status(200).json({ message: 'Pagamento atualizado com sucesso.', payment });
    } catch (error) {
      return handleControllerError(res, error, 'pagamento');
    }
  }

  static async markAsPaid(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return notFound(res, 'Pagamento');
      }

      payment.markAsPaid();
      await payment.save();
      return res.status(200).json({ message: 'Pagamento confirmado com sucesso.', payment });
    } catch (error) {
      return handleControllerError(res, error, 'pagamento');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return notFound(res, 'Pagamento');
      }

      await payment.destroy();
      return res.status(200).json({ message: 'Pagamento removido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'pagamento');
    }
  }
}