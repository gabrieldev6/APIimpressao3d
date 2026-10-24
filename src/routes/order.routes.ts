import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.status(201).json({ message: 'Criar pedido' });
});

router.get("/", (req, res) => {
  res.status(200).json({ message: 'Listando todos os pedidos' });
});

router.get("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Listando pedido com id ${req.params.id}`,
        id: req.params.id
    });
});

router.patch("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Atualizando pedido com id ${req.params.id}`,
    });
});

router.delete("/:id", (req, res) => {
    res.status(200).json({ 
        message: `Deletando pedido com id ${req.params.id}`,
    });
});

export default router;