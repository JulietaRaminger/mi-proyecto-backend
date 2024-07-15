import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ROUTER = Router();
const PRODUCT = new ProductManager();

ROUTER.post("/", async (req, res) => {
    try {
        const { category, title, description, price, thumbnail, code, stock } = req.body;
        const product = await PRODUCT.addProduct({ category, title, description, price, thumbnail, code, stock });
        res.status(201).json({ status: true, payload: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/", async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const limitNumber = limit ? Number(limit) : 10;
        const pageNumber = page ? Number(page) : 1;
        const skip = (pageNumber - 1) * limitNumber;
        const totalProducts = await PRODUCT.countProducts();
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

        const products = await PRODUCT.getProducts(limitNumber, skip, sortOptions, filters);

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

        return res.status(200).json({ result });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await PRODUCT.getProductById(ID);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.delete("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await PRODUCT.deleteProductById(ID);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.put("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const { category, title, description, price, thumbnail, code, stock, available } = req.body;
        const updateData = { category, title, description, price, thumbnail, code, stock, available };
        const productUpdated = await PRODUCT.updateProduct( ID, updateData );
        if (!productUpdated) {
            return res.status(404).json({ status: false, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: true, payload: productUpdated });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.put("/available/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        const RESULT = await PRODUCT.toggleAvailability(ID);

        if (RESULT === "Producto no encontrado") {
            return res.status(404).json({ status: false, message: RESULT });
        }

        return res.status(200).json({ status: true, payload: RESULT });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default ROUTER;