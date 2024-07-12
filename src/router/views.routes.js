import { Router } from "express";
import ProductModel from "../models/product.model.js";

import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();

router.get("/explain", async (req, res) => {
    try {
        const result = await ProductModel.find({ $and: [{ category: "Decoracion" }, { title: "55457" }] }).explain();
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

router.get("/", async (req, res) => {
    try {
        return res.status(200).render("home", { title: "Home" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default router;