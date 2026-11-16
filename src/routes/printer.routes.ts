import { Router } from 'express';
import PrinterController from '../controllers/PrinterController';


const router = Router();

// Listar todos os trabalhos de impressão
router.get('/', PrinterController.index);

// Buscar trabalho de impressão pelo ID
router.get('/:id', PrinterController.show);

// Cadastrar trabalho de impressão
router.post('/', PrinterController.store);

// Atualizar trabalho de impressão
router.patch('/:id', PrinterController.update);

// Iniciar trabalho de impressão
router.patch('/:id/start', PrinterController.startPrinting);

// Excluir trabalho de impressão
router.delete('/:id', PrinterController.destroy);

export default router;
