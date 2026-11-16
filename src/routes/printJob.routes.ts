import { Router } from 'express';
import PrintJobController from '../controllers/PrintJobController';

const router = Router();

// Cadastrar trabalho de impressão
router.post('/', PrintJobController.store);

// Listar todos os trabalhos de impressão
router.get('/', PrintJobController.index);

// Buscar trabalho de impressão pelo ID
router.get('/:id', PrintJobController.show);

// Iniciar trabalho de impressão
router.patch('/:id/start', PrintJobController.start);

// Finalizar trabalho de impressão
router.patch('/:id/finish', PrintJobController.finish);

// Registrar falha no trabalho de impressão
router.patch('/:id/fail', PrintJobController.fail);

// Atualizar trabalho de impressão
router.patch('/:id', PrintJobController.update);

// Excluir trabalho de impressão
router.delete('/:id', PrintJobController.destroy);

export default router;
