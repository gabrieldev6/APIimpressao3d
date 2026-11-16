
import { Request, Response } from 'express';
import User from '../models/User';

export class UserController {
  static async store(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    const { password: _password, ...safeUser } = user.toJSON();
    
    return res.status(201).json({
      message: 'Usuário criado com sucesso. 1',
      user: safeUser,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);


    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      return res.status(409).json({
        message: 'Este e-mail já está cadastrado.',
      });
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeValidationError'
    ) {
      return res.status(400).json({
        message: 'Dados inválidos.',
      });
    }

    return res.status(500).json({
      message: 'Erro ao cadastrar usuário.',
    });
  }
}


static async index(req: Request, res: Response) {
  try {
    const users = await User.findAll();

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);

    return res.status(500).json({
      message: 'Erro ao buscar usuários.',
    });
  }
}

static async show(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);

    return res.status(500).json({
      message: 'Erro ao buscar usuário.',
    });
  }
}

}

export default UserController;
