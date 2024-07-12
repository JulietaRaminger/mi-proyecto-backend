import { Router } from "express";
import productController from "../controllers/productController.js";
import ProductModel from "../models/product.model.js";

import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();
const product = new productController();

router.get("/", async (req, res) => {
    try {
        const allProducts = await product.getProducts();
        return res.status(200).render("home", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

router.get("/explain", async (req, res) => {
    try {
        const result = await ProductModel.find({ $and: [{ category: "BATERIA" }, { title: "55457" }] }).explain();
        console.log(result.executionStats);
        res.status(200).json({ status: true, payload: result.executionStats });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default router;