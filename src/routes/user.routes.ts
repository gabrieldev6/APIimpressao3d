import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.status(201).json({ message: 'Criar usuario' });
});

router.get("/", (req, res) => {
  res.status(200).json({ message: 'Listando todos os usuarios' });
});

router.get("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Listando usuario com id ${req.params.id}`,
        id: req.params.id
    });
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