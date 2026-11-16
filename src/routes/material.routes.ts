import { Router } from "express";
import MaterialController from "../controllers/MaterialController";

const router = Router();

// Listar todos os materiais
router.get("/", MaterialController.index);

// Buscar material pelo ID
router.get("/:id", MaterialController.show);

// Cadastrar material
router.post("/", MaterialController.store);

// Atualizar material
router.patch("/:id", MaterialController.update);

// Desativar material
router.delete("/:id", MaterialController.destroy);




export default router;