import { Router } from "express";
import { OrderController } from "../controllers";

const router = Router();

// Listar todos os pedidos
router.get("/", OrderController.index);

// Buscar pedido pelo ID
router.get("/:id", OrderController.show);

// Cadastrar pedido
router.post("/", OrderController.store);

// Atualizar pedido
router.patch("/:id", OrderController.update);

// Cancelar pedido
router.patch("/:id/notes", OrderController.cancel);

// Desativar pedido
router.delete("/:id", OrderController.destroy);


export default router;