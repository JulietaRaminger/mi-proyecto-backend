import { Router } from "express";
import cartController from "../controllers/cartController.js";

const router = Router();
const cart = new cartController();

router.get("/", async (req, res) => {
    try {
        const allCarts = await cart.getCarts();
        return res.status(200).render("carts", {
            title: "Carts",
            carts: allCarts,
        });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default router;