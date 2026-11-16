import { Router } from "express";
import ProductController from "../controllers/ProductController";


const router = Router();

// Listar todos os produtos
router.get("/", ProductController.index);

// Buscar produto pelo ID
router.get("/:id", ProductController.show);

// Cadastrar produto
router.post("/", ProductController.store);

// Atualizar produto
router.patch("/:id", ProductController.update);

// Desativar produto
router.patch("/:id/deactivate", ProductController.deactivate);

// Apagar produto
router.delete("/:id", ProductController.destroy);


export default router;