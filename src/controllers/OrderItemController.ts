import { Request, Response } from 'express';
import { Order, OrderItem, Product } from '../models';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class OrderItemController {
  
  static async index(req: Request, res: Response) {
    try {
      let where;
      if (req.query.orderId) {
        where = { orderId: Number(req.query.orderId) };
      }

      const items = await OrderItem.findAll({
        where,
        include: [{ model: Product, as: 'product' }],
        order: [['id', 'DESC']],
      });

      return res.status(200).json(items);
    } catch (error) {
      return handleControllerError(res, error, 'itens do pedido');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const item = await OrderItem.findByPk(id, {
        include: [{ model: Product, as: 'product' }],
      });

      if (!item) {
        return notFound(res, 'Item do pedido');
      }

      return res.status(200).json(item);
    } catch (error) {
      return handleControllerError(res, error, 'item do pedido');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const { orderId, productId, quantity, unitPrice } = req.body;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      let price = Number(unitPrice);
      if (unitPrice === undefined) {
        price = Number(product.price);
      }

      const draft = OrderItem.build({
        orderId,
        productId,
        quantity: Number(quantity),
        unitPrice: price,
        subtotal: 0,
      });

      const subtotal = draft.calculateSubtotal();

      const item = await OrderItem.create({
        orderId,
        productId,
        quantity: Number(quantity),
        unitPrice: price,
        subtotal,
      });

      return res.status(201).json({ message: 'Item adicionado ao pedido com sucesso.', item });
    } catch (error) {
      if (error instanceof Error && error.message === 'Quantidade ou preço inválido.') {
        return res.status(400).json({ message: error.message });
      }
      return handleControllerError(res, error, 'item do pedido');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const item = await OrderItem.findByPk(id);
      if (!item) {
        return notFound(res, 'Item do pedido');
      }

      let quantity = Number(req.body.quantity);
      if (req.body.quantity === undefined) {
        quantity = item.quantity;
      }

      let unitPrice = Number(req.body.unitPrice);
      if (req.body.unitPrice === undefined) {
        unitPrice = Number(item.unitPrice);
      }

      const draft = OrderItem.build({
        orderId: item.orderId,
        productId: item.productId,
        quantity,
        unitPrice,
        subtotal: 0,
      });

      const subtotal = draft.calculateSubtotal();

      await item.update({
        quantity,
        unitPrice,
        subtotal,
      });

      return res.status(200).json({ message: 'Item do pedido atualizado com sucesso.', item });
    } catch (error) {
      if (error instanceof Error && error.message === 'Quantidade ou preço inválido.') {
        return res.status(400).json({ message: error.message });
      }
      return handleControllerError(res, error, 'item do pedido');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const item = await OrderItem.findByPk(id);
      if (!item) {
        return notFound(res, 'Item do pedido');
      }

      await item.destroy();

      return res.status(200).json({ message: 'Item removido do pedido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'item do pedido');
    }
  }
}