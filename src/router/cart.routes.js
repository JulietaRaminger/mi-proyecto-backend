import { Router } from "express";
import cartController from "../controllers/cartController.js";

const router = Router();
const cart = new cartController();

// cart manager
router.post("/", async (req, res) => {
    res.status(201).send(await cart.addCart());
});

router.get("/", async (req, res) => {
    res.status(200).send(await cart.getCarts());
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    res.status(200).send(await cart.getCartById(id));
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    return res.status(200).send(await cart.deleteCartById(id));
});

router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    res.status(200).send(await cart.addProductToCart(cartId, productId));
});

export default router;