import { Request, Response } from 'express';
import { Printer } from '../models';
import { PrinterStatus } from '../types/enums';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class PrinterController {
  
  static async index(_req: Request, res: Response) {
    try {
      const printers = await Printer.findAll({ order: [['name', 'ASC']] });
      return res.status(200).json(printers);
    } catch (error) {
      return handleControllerError(res, error, 'impressoras');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const printer = await Printer.findByPk(id);
      if (!printer) {
        return notFound(res, 'Impressora');
      }
      return res.status(200).json(printer);
    } catch (error) {
      return handleControllerError(res, error, 'impressora');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        name,
        model,
        manufacturer,
        status = PrinterStatus.AVAILABLE,
        nozzleDiameter,
        maxTemperature,
        notes = null,
      } = req.body;

      const printer = await Printer.create({
        name,
        model,
        manufacturer,
        status,
        nozzleDiameter,
        maxTemperature,
        notes,
      });

      return res.status(201).json({ message: 'Impressora cadastrada com sucesso.', printer });
    } catch (error) {
      return handleControllerError(res, error, 'impressora');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const printer = await Printer.findByPk(id);
      if (!printer) {
        return notFound(res, 'Impressora');
      }

      const fields = [
        'name', 'model', 'manufacturer', 'status', 'nozzleDiameter', 'maxTemperature', 'notes',
      ] as const;

      const data = Object.fromEntries(
        fields
          .filter((key) => req.body[key] !== undefined)
          .map((key) => [key, req.body[key]])
      );

      await printer.update(data);
      return res.status(200).json({ message: 'Impressora atualizada com sucesso.', printer });
    } catch (error) {
      return handleControllerError(res, error, 'impressora');
    }
  }

  static async startPrinting(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const printer = await Printer.findByPk(id);
      if (!printer) {
        return notFound(res, 'Impressora');
      }

      try {
        printer.startPrinting();
      } catch (error) {
        let message = 'Não foi possível iniciar a impressora.';
        if (error instanceof Error) {
          message = error.message;
        }
        return res.status(409).json({ message });
      }

      await printer.save();
      return res.status(200).json({ message: 'Impressora marcada como em operação.', printer });
    } catch (error) {
      return handleControllerError(res, error, 'impressora');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const printer = await Printer.findByPk(id);
      if (!printer) {
        return notFound(res, 'Impressora');
      }

      await printer.destroy();
      return res.status(200).json({ message: 'Impressora removida com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'impressora');
    }
  }
}