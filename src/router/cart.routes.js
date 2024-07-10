import { Router } from "express";
import cartController from "../controllers/cartController.js";
import uploader from "../utils/uploader.js";

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
const cart = new cartController();

// cart manager
router.post("/", uploader.single("file"), async (req, res) => {
    try{
        res.status(201).send(await cart.addCart());
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.post("/:cid/products/:pid", uploader.single("file"), async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        res.status(200).send(await cart.addProductToCart(cartId, productId));
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.get("/", async (req, res) => {
    try{
        res.status(200).send(await cart.getCarts());
    }catch (error) {
        errorHandler(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        res.status(200).send(await cart.getCartById(id));
    }catch (error) {
        errorHandler(res, error.message);
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        res.status(200).send(await cart.deleteProductFromCart(cartId, productId));
    } catch (error) {
        console.log(error.message);
        errorHandler(res, error.message);
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        // Validar que la cantidad sea un número
        if (typeof quantity !== "number") {
            return res.status(400).json({ status: false, message: "Cantidad inválida" });
        }

        const updateResult = await cart.updateCartQuantity(cartId, productId, quantity);
        console.log("Resultado de la actualización:", updateResult);

        if (updateResult === "Carrito no encontrado" || updateResult === "Producto no encontrado en el carrito" || updateResult === "ID no válido") {
            return res.status(404).json({ status: false, message: updateResult });
        } else if (updateResult === "Error al modificar la cantidad del producto en el carrito") {
            return res.status(500).json({ status: false, message: updateResult });
        } else {
            res.status(200).json({ status: true, message: updateResult });
        }
    } catch (error) {
        console.log("Error en el servidor:", error.message);
        errorHandler(res, error.message);
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const deleteResult = await cart.cleanCart(cartId);
        console.log("Resultado de la eliminación:", deleteResult);

        if (deleteResult === "Carrito no encontrado" || deleteResult === "ID no válido") {
            return res.status(404).json({ status: false, message: deleteResult });
        } else if (deleteResult === "Error al eliminar los productos del carrito") {
            return res.status(500).json({ status: false, message: deleteResult });
        } else {
            res.status(200).json({ status: true, message: deleteResult });
        }
    } catch (error) {
        console.log("Error en el servidor:", error.message);
        errorHandler(res, error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { products } = req.body; // Ahora se espera que el cuerpo de la solicitud contenga un arreglo de productos
        const updateData = { products };
        const cartUpdated = await cart.updateCart(id, updateData);
        if (!cartUpdated) {
            return res.status(404).json({ status: false, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        console.log(error.message);
        errorHandler(res, error.message);
    }
});

export default router;