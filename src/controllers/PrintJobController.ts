import { Request, Response } from 'express';
import { Material, OrderItem, PrintJob, Printer } from '../models';
import { PrintJobStatus } from '../types/enums';
import { getId, handleControllerError, invalidId, notFound } from './controllerUtils';

export default class PrintJobController {
  
  static async index(req: Request, res: Response) {
    try {
      let where;
      if (req.query.status) {
        where = { status: String(req.query.status) };
      }

      const jobs = await PrintJob.findAll({
        where,
        include: [
          { model: OrderItem, as: 'orderItem' },
          { model: Printer, as: 'printer' },
          { model: Material, as: 'material' },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(jobs);

    } catch (error) {
      
      return handleControllerError(res, error, 'trabalhos de impressão');
    }
  }

  static async show(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id, {
        include: [
          { model: OrderItem, as: 'orderItem' },
          { model: Printer, as: 'printer' },
          { model: Material, as: 'material' },
        ],
      });

      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      return res.status(200).json(job);
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const {
        orderItemId,
        printerId,
        materialId,
        status = PrintJobStatus.PENDING,
        quantity,
        estimatedTime,
        actualTime = null,
        materialUsedGrams = 0,
        startedAt = null, 
        finishedAt = null, 
        failureReason = null, 
        notes = null,
      } = req.body;

      const [orderItem, printer, material] = await Promise.all([
        OrderItem.findByPk(orderItemId),
        Printer.findByPk(printerId),
        Material.findByPk(materialId),
      ]);

      if (!orderItem) {
        return res.status(404).json({ message: 'Item do pedido não encontrado.' });
      }
      if (!printer) {
        return res.status(404).json({ message: 'Impressora não encontrada.' });
      }
      if (!material) {
        return res.status(404).json({ message: 'Material não encontrado.' });
      }

      const job = await PrintJob.create({
        orderItemId,
        printerId,
        materialId,
        status,
        quantity,
        estimatedTime,
        actualTime,
        materialUsedGrams,
        startedAt,
        finishedAt,
        failureReason,
        notes,
      });

      return res.status(201).json({ message: 'Trabalho de impressão criado com sucesso.', job });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async update(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id);
      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      const fields = [
        'orderItemId', 'printerId', 'materialId', 'status', 'quantity', 'estimatedTime',
        'actualTime', 'materialUsedGrams', 'startedAt', 'finishedAt', 'failureReason', 'notes',
      ] as const;

      const data = Object.fromEntries(
        fields
          .filter((key) => req.body[key] !== undefined)
          .map((key) => [key, req.body[key]])
      );

      await job.update(data);

      return res.status(200).json({ message: 'Trabalho de impressão atualizado com sucesso.', job });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async start(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id);
      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      try {
        job.start();
      } catch (error) {
        let message = 'Não foi possível iniciar o trabalho.';
        if (error instanceof Error) {
          message = error.message;
        }
        return res.status(409).json({ message });
      }

      await job.save();

      return res.status(200).json({ message: 'Trabalho de impressão iniciado.', job });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async finish(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id);
      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      const { actualTime, materialUsedGrams } = req.body;

      try {
        job.finish(Number(actualTime), Number(materialUsedGrams));
      } catch (error) {
        let message = 'Dados de finalização inválidos.';
        if (error instanceof Error) {
          message = error.message;
        }
        return res.status(400).json({ message });
      }

      await job.save();

      return res.status(200).json({ message: 'Trabalho de impressão concluído.', job });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async fail(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id);
      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      let reason = '';
      if (req.body.reason !== undefined && req.body.reason !== null) {
        reason = String(req.body.reason).trim();
      } else {
        reason = '';
      }

      if (!reason) {
        return res.status(400).json({ message: 'Informe o motivo da falha.' });
      }

      try {
        job.fail(reason);
        
      } catch (error) {
        let message = 'Não foi possível registrar a falha.';
        if (error instanceof Error) {
          message = error.message;
        }
        return res.status(409).json({ message });
      }

      await job.save();

      return res.status(200).json({ message: 'Falha do trabalho registrada.', job });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }

  static async destroy(req: Request, res: Response) {
    const id = getId(req);
    if (!id) {
      return invalidId(res);
    }

    try {
      const job = await PrintJob.findByPk(id);
      if (!job) {
        return notFound(res, 'Trabalho de impressão');
      }

      await job.destroy();

      return res.status(200).json({ message: 'Trabalho de impressão removido com sucesso.' });
    } catch (error) {
      return handleControllerError(res, error, 'trabalho de impressão');
    }
  }
}