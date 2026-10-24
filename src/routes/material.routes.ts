import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.status(201).json({ message: 'Criar material' });
});

router.get("/", (req, res) => {
  res.status(200).json({ message: 'Listando todos os materiais' });
});

router.get("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Listando material com id ${req.params.id}`,
        id: req.params.id
    });
});

router.patch("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Atualizando material com id ${req.params.id}`,
    });
});

router.delete("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Deletando material com id ${req.params.id}`,
    });
});

export default router;