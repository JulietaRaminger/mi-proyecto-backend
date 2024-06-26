import { Router } from "express";
import productController from "../controllers/productController.js";
// import uploader from "../utils/uploader.js";

const router = Router();
const product = new productController();

router.get("/", async (req, res) => {
    try {
        const allProducts = await product.getProducts();
        return res.status(200).render("home", {
            title: "products",
            products: allProducts,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/realtimeproducts", async (req, res) => {
    return res.status(200).render("realTimeProducts", { title: "realtimeproducts" });
});

// router.post("/realtimeproducts", uploader.single("file"), async (req, res) => {
//     const { file } = req;

//     if (!file) {
//         res.status(400).send({ state: "error", message: "file is required" });
//         return;
//     }

//     const filename = file.filename;
//     const { category, title, description, price, code, stock } = req.body;

//     try {
//         await product.addProduct(category, title, description, price, filename, code, stock);
//         return res.redirect("http://localhost:8080/realtimeproducts");
//     } catch (error) {
//         res.status(500).send({ state: "error", message: error.message });
//     }
// });

export default router;