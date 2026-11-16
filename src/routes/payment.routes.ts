import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';

const router = Router();

// Listar todos os pagamentos
router.get('/', PaymentController.index);

// Buscar pagamento pelo ID
router.get('/:id', PaymentController.show);

// Cadastrar pagamento
router.post('/', PaymentController.store);

// Atualizar pagamento
router.patch('/:id', PaymentController.update);

// Marcar pagamento como pago
router.patch('/:id/mark-as-paid', PaymentController.markAsPaid);

// Excluir pagamento
router.delete('/:id', PaymentController.destroy);

export default router;