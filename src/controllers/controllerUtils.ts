import { Request, Response } from 'express';

/** Converte e valida IDs recebidos pela URL. */
export function getId(req: Request): number | null {
  const rawId = req.params.id;
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Padroniza os erros mais comuns do Sequelize sem expor detalhes internos. */
export function handleControllerError(
  res: Response,
  error: unknown,
  entity: string,
): Response {
  
  const errorName = error instanceof Error ? error.name : '';

  if (errorName === 'SequelizeValidationError' || errorName === 'SequelizeDatabaseError') {
    return res.status(400).json({ message: `Dados inválidos para ${entity}.` });
  }

  if (errorName === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: `Já existe um registro com esses dados de ${entity}.` });
  }

  if (errorName === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ message: `Não foi possível realizar a operação: existe uma referência inválida ou relacionada a ${entity}.` });
  }

  if (errorName === 'SequelizeEmptyResultError') {
    return res.status(404).json({ message: `${entity} não encontrado(a).` });
  }

  console.error(`Erro no controller de ${entity}:`, error);
  return res.status(500).json({ message: `Erro interno ao processar ${entity}.` });
}

export function invalidId(res: Response): Response {
  return res.status(400).json({ message: 'ID inválido.' });
}

export function notFound(res: Response, entity: string): Response {
  return res.status(404).json({ message: `${entity} não encontrado(a).` });
}
