import { Request, Response } from 'express';
import { Customer } from '../models';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class CustomerController {
  
  static async index(_req: Request, res: Response) {
    try {
      const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json(customers);
    } catch (error) {
      return handleControllerError(res, error, 'clientes');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return notFound(res, 'Cliente');
      }

      return res.status(200).json(customer);
    } catch (error) {
      return handleControllerError(res, error, 'cliente');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        phone,
        document,
        address,
        city,
        state,
        zipCode,
      } = req.body;

      const customer = await Customer.create({
        name,
        email,
        phone,
        document,
        address,
        city,
        state,
        zipCode,
      });

      return res.status(201).json({ message: 'Cliente cadastrado com sucesso.', customer });
    } catch (error) {
      return handleControllerError(res, error, 'cliente');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return notFound(res, 'Cliente');
      }

      const fields = [
        'name',
        'email',
        'phone',
        'document',
        'address',
        'city',
        'state',
        'zipCode',
      ] as const;

      const data = Object.fromEntries(
        fields
          .filter((key) => req.body[key] !== undefined)
          .map((key) => [key, req.body[key]])
      );

      await customer.update(data);
      return res.status(200).json({ message: 'Cliente atualizado com sucesso.', customer });
    } catch (error) {
      return handleControllerError(res, error, 'cliente');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return notFound(res, 'Cliente');
      }

      await customer.destroy();
      return res.status(200).json({ message: 'Cliente removido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'cliente');
    }
  }
}