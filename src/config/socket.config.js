/* Servidor */
import { Server } from "socket.io";
import ProductManager from "../controllers/ProductManager.js";

const PRODUCT = new ProductManager();

const CONFIG = (serverHTTP) => {
    const serverIo = new Server(serverHTTP);
    serverIo.on("connection", async (socket) => {
        const id = socket.client.id;
        console.log("Conexion establecida", id);

        try {
            const products = await PRODUCT.getProducts();
            socket.emit("products", products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            socket.emit("productsError", { message: "Error al obtener productos" });
        }

        socket.on("add-product", async (product) => {
            console.log(product);
            try {
                await PRODUCT.addProduct({ ...product });
                socket.emit("products", await PRODUCT.getProducts());
            } catch (error) {
                console.error("Error al agregar producto:", error);
                socket.emit("productsError", { message: "Error al agregar producto" });
            }
        });

        socket.on("delete-product", async (id) => {
            console.log(id);
            try {
                await PRODUCT.deleteProductById(id);
                const updatedProducts = await PRODUCT.getProducts();
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

        socket.on("toggle-availability", async (id) => {
            console.log(id);
            try {
                await PRODUCT.toggleAvailability(id);
                const updatedProducts = await PRODUCT.getProducts();
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al cambiar disponibilidad:", error);
                socket.emit("productsError", { message: "Error al cambiar disponibilidad" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un Cliente");
        });
    });
};

export default { CONFIG };