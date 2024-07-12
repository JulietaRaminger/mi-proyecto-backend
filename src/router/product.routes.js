import { Router } from "express";
import productController from "../controllers/productController.js";

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

router.post("/", async (req, res) => {
    try {
        const { category, title, description, price, thumbnail, code, stock } = req.body;
        const product = await product.addProduct({ category, title, description, price, thumbnail, code, stock });
        res.status(201).json({ status: true, payload: product });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
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

        const filters = {};
        if (filter) {
            const filterPairs = filter.split(",");
            filterPairs.forEach((pair) => {
                const [ key, value ] = pair.split(":");
                filters[key] = value;
            });
        }

        const products = await product.getProducts(limitNumber, skip, sortOptions, filters);

        const result = {
            status: true,
            payload: products,
            totalPages: totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            prevLink: pageNumber > 1 ? `/api/products?limit=${limitNumber}&page=${pageNumber - 1}&sort=${sort}&filter=${filter}` : null,
            nextLink: pageNumber < totalPages ? `/api/products?limit=${limitNumber}&page=${pageNumber + 1}&sort=${sort}&filter=${filter}` : null,
        };

        return res.status(200).json({ result: result });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await product.getProductById(ID);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await product.deleteProductById(ID);
        res.status(200).json({ status: true, payload: product });
    }catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const { category, title, description, price, thumbnail, code, stock, available } = req.body;
        const updateData = { category, title, description, price, thumbnail, code, stock, available };
        const productUpdated = await product.updateProduct( ID, updateData );
        if (!productUpdated) {
            return res.status(404).json({ status: false, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: true, payload: productUpdated });
    }catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }
});

router.put("/available/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const RESULT = await product.toggleAvailability(ID);

        if (RESULT === "Producto no encontrado") {
            return res.status(404).json({ status: false, message: RESULT });
        }

        return res.status(200).json({ status: true, payload: RESULT });
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error.message);
    }

});

export default router;