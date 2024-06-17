import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();
const product = new productController();

router.post("/", async (req, res) => {
    const { category, title, description, price, thumbnail, code, stock } = req.body;
    return res.status(201).send(await product.addProduct(category, title, description, price, thumbnail, code, stock));
});

router.get("/", async (req, res) => {
    return res.status(200).send(await product.getProducts());
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    return res.status(200).send(await product.getProductById(id));
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    return res.status(200).send(await product.deleteProductById(id));
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { category, title, description, price, thumbnail, code, stock, available } = req.body;
    return res.status(200).send(await product.updateProduct({ id, category, title, description, thumbnail, price, code, stock, available }));
});

router.put("/available/:id", async (req, res) => {
    const id = Number(req.params.id);
    const result = await product.toggleAvailability(id);
    if (result.error) {
        return res.status(404).send(result);
    }
    return res.status(200).send(result);
});

export default router;