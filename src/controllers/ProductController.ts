import { Request, Response } from 'express';
import { Product } from '../models';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class ProductController {
  static async index(_req: Request, res: Response) {

    try {
      const products = await Product.findAll({ order: [['createdAt', 'DESC']] });

      return res.status(200).json(products);
    } catch (error) {

      return handleControllerError(res, error, 'produtos');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);

    if (!id) {
      return invalidId(res);
    }

    try {
      const product = await Product.findByPk(id);

      if (!product) {

        return notFound(res, 'Produto');
      }

      return res.status(200).json(product);

    } catch (error) {

      return handleControllerError(res, error, 'produto');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const { name, description, sku, category, weight, printTime, cost, price, isActive } = req.body;
      const product = await Product.create({ name, description, sku, category, weight, printTime, cost, price, isActive: isActive ?? true });

      return res.status(201).json({ message: 'Produto cadastrado com sucesso.', product });
    
    } catch (error) {

      return handleControllerError(res, error, 'produto'); 
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req); 
    
    if (!id) {
      
      return invalidId(res);
    }
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        
        return notFound(res, 'Produto');
      }
      const fields = ['name', 'description', 'sku', 'category', 'weight', 'printTime', 'cost', 'price', 'isActive'] as const;
      const data = Object.fromEntries(fields.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
      
      await product.update(data);
      
      return res.status(200).json({ message: 'Produto atualizado com sucesso.', product });
    } catch (error) { 
      
      return handleControllerError(res, error, 'produto'); 
    }
  }

  static async deactivate(req: Request, res: Response) {
    const id = getId(req); 
    if (!id) {
      
      return invalidId(res);
    }
    try {
      const product = await Product.findByPk(id);
      if (!product) {

        return notFound(res, 'Produto');
      }

      product.deactivate();
      
      await product.save();
      
      return res.status(200).json({ message: 'Produto desativado com sucesso.', product });
      
    } catch (error) { 
      
      return handleControllerError(res, error, 'produto'); 
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req); 
    if (!id) {
      
      return invalidId(res);
    }
    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        
        return notFound(res, 'Produto');
      }
      await product.destroy();
      
      return res.status(200).json({ message: 'Produto removido com sucesso.' });
    
    } catch (error) {

      return handleControllerError(res, error, 'produto'); 
    }
  }
}
