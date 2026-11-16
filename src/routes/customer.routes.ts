
import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';

const router = Router();

// Cadastrar cliente
router.post('/', CustomerController.store);

// Listar todos os clientes
router.get('/', CustomerController.index);

// Buscar cliente pelo ID
router.get('/:id', CustomerController.show);

// Atualizar cliente
router.patch('/:id', CustomerController.update);

// Excluir cliente
router.delete('/:id', CustomerController.destroy);

export default router;
