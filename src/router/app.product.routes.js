import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();
const product = new productController();

router.get("/", async (req, res) => {
    try {
        const allProducts = await product.getProducts();
        return res.status(200).render("products", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default router;