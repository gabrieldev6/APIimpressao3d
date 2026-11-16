import { Request, Response } from 'express';
import { Material } from '../models';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class MaterialController {
  
  static async index(_req: Request, res: Response) {
    try {
      const materials = await Material.findAll({ order: [['name', 'ASC']] });
      return res.status(200).json(materials);
    } catch (error) {
      return handleControllerError(res, error, 'materiais');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const material = await Material.findByPk(id);
      if (!material) {
        return notFound(res, 'Material');
      }

      return res.status(200).json(material);
    } catch (error) {
      return handleControllerError(res, error, 'material');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        name,
        type,
        color,
        brand,
        diameter,
        pricePerKg,
        stockGrams,
        minStockGrams,
      } = req.body;

      const material = await Material.create({
        name,
        type,
        color,
        brand,
        diameter,
        pricePerKg,
        stockGrams,
        minStockGrams,
      });

      return res.status(201).json({ message: 'Material cadastrado com sucesso.', material });
    } catch (error) {
      return handleControllerError(res, error, 'material');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const material = await Material.findByPk(id);
      if (!material) {
        return notFound(res, 'Material');
      }

      const fields = [
        'name',
        'type',
        'color',
        'brand',
        'diameter',
        'pricePerKg',
        'stockGrams',
        'minStockGrams',
      ] as const;

      const data = Object.fromEntries(
        fields
          .filter((key) => req.body[key] !== undefined)
          .map((key) => [key, req.body[key]])
      );

      await material.update(data);
      return res.status(200).json({ message: 'Material atualizado com sucesso.', material });
    } catch (error) {
      return handleControllerError(res, error, 'material');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const material = await Material.findByPk(id);
      if (!material) {
        return notFound(res, 'Material');
      }

      await material.destroy();
      return res.status(200).json({ message: 'Material removido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'material');
    }
  }
}