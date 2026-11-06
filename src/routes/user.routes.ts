import { Router } from "express";
import { User } from "../models";
import UserController from "../controllers/UserController";
const router = Router();

router.post("/", (req, res) => {

    try {
        
        UserController.store(req, res);
        
        return res.status(201).json({ message: 'Usuario criado com sucesso 1'});
    }
    catch (error) {
        return res.status(500).json({ message: 'Erro ao criar usuario' });
    }
 
});

router.get("/", (req, res) => {

    try {
        UserController.index(req, res);
        res.status(200).json({ message: 'Listando todos os usuarios' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar usuarios' });
    }
   
});

router.get("/:id", (req, res) => {

    try {
        UserController.show(req, res);
        res.status(200).json({ message: `Listando usuario com id ${req.params.id}`, id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuario' });
    }
});

router.patch("/:id", (req, res) => {
    res.status(200).json({
        message: `Atualizando usuario com id ${req.params.id}`,
    });
});

router.delete("/:id", (req, res) => {
    res.status(200).json({
        message: `Deletando usuario com id ${req.params.id}`,
    });
});

export default router;