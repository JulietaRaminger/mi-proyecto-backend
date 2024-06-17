import { Server } from "socket.io";
import productController from "../controllers/productController.js";

const productCtrl = new productController();

const config = (serverHttp) => {
    const serverIo = new Server(serverHttp);
    serverIo.on("connection", async (socket) => {
        const id = socket.client.id;
        console.log("Conexion establecida", id);

        try {
            const products = await productCtrl.getProducts(); // Usar productCtrl en lugar de product
            socket.emit("products", products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            socket.emit("productsError", { message: "Error al obtener productos" });
        }

        socket.on("add-product", async (productData) => {
            console.log(productData);
            try {
                await productCtrl.addProduct(productData); // Usar productCtrl en lugar de product
                const updatedProducts = await productCtrl.getProducts(); // Usar productCtrl en lugar de product
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al agregar producto:", error);
                socket.emit("productsError", { message: "Error al agregar producto" });
            }
        });

        socket.on("delete-product", async (id) => {
            console.log(id);
            try {
                await productCtrl.deleteProductById(Number(id)); // Usar productCtrl en lugar de product
                const updatedProducts = await productCtrl.getProducts(); // Usar productCtrl en lugar de product
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

        socket.on("toggle-availability", async (id) => {
            console.log(id);
            try {
                await productCtrl.toggleAvailability(Number(id)); // Usar productCtrl en lugar de product
                const updatedProducts = await productCtrl.getProducts(); // Usar productCtrl en lugar de product
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al cambiar disponibilidad:", error);
                socket.emit("productsError", { message: "Error al cambiar disponibilidad" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconectó un cliente");
        });
    });
};

export default { config };