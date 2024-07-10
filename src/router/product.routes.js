import { Router } from "express";
import productController from "../controllers/productController.js";
import uploader from "../utils/uploader.js";
/*import productModel from "../models/product.model.js";*/

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

const router = Router();
const product = new productController();

router.post("/", uploader.single("file"), async (req, res) => {
    try{
        const { category, title, description, price, thumbnail, code, stock } = req.body;
        const product = await product.addProduct({ category, title, description, price, thumbnail, code, stock });
        res.status(201).json({ status: true, payload: product });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.get("/", async (req, res) => {
    try{
        const { limit, page, sort } = req.query;
        const limitNumber = limit ? Number(limit) : 10;
        const pageNumber = page ? Number(page) : 1;
        const skip = (pageNumber - 1) * limitNumber;
        const totalProducts = await product.countProducts();
        const totalPages = Math.ceil(totalProducts / limitNumber);

        const sortOptions = {};
        if (sort) {
            const [ field, order ] = sort.split(":");
            sortOptions[field] = order === "1" ? 1 : -1;
        }

        const products = await product.getProducts(limitNumber, skip, sortOptions);

        const result = {
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            prevLink: pageNumber > 1 ? `/api/products?limit=${limitNumber}&page=${pageNumber - 1}` : null,
            nextLink: pageNumber < totalPages ? `/api/products?limit=${limitNumber}&page=${pageNumber + 1}` : null,
        };

        return res.status(200).json({ status: true, result: result });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try{
        const id = (req.params.id);
        const product = await product.getProductById(id);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const id = (req.params.id);
        const product = await product.deleteProductById(id);
        res.status(200).json({ status: true, payload: product });
    }catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.put("/:id", uploader.single("file"), async (req, res) => {
    try{
        const id = req.params.id;
        const { category, title, description, price, thumbnail, code, stock, available } = req.body;
        const updateData = { category, title, description, price, thumbnail, code, stock, available };
        const productUpdated = await product.updateProduct( id, updateData );
        if (!productUpdated) {
            return res.status(404).json({ status: false, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: true, payload: productUpdated });
    }catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }

});

router.put("/available/:id", uploader.single("file"), async (req, res) => {
    try{
        const id = req.params.id;
        const result = await product.toggleAvailability(id);
        if (result === "Producto no encontrado") {
            return res.status(404).json({ status: false, message: result });
        }
        return res.status(200).json({ status: true, payload: result });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }

});

export default router;