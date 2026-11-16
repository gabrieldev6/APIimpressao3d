import {Router} from 'express';
import OrderItemController from '../controllers/OrderItemController';

const router = Router();

router.get('/', OrderItemController.index);

router.get('/:id', OrderItemController.show);

// Cadastrar item de pedido
router.post('/', OrderItemController.store);

// Atualizar item de pedido
router.patch('/:id', OrderItemController.update);

// Excluir item de pedido
router.delete('/:id', OrderItemController.destroy);

export default router;