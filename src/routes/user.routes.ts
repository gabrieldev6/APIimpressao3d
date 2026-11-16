import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

// Cadastrar usuário
router.post("/", UserController.store);

// Listar todos os usuários
router.get("/", UserController.index);

// Buscar usuário pelo ID
router.get("/:id", UserController.show);



export default router;