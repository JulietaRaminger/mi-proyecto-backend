/* Servidor Express */
import express from "express";
import productRouter from "./router/product.routes.js";
import cartRouter from "./router/cart.routes.js";
import viewsRouter from "./router/views.routes.js";
import pathConfig from "./utils/path.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/socket.config.js";

const port = 8080;
const host = "localhost"; // 127.0.0.1
const server = express();

server.use(express.urlencoded({ extended: true })); // para recibir los datos en urlencoded desde postman
server.use(express.json());

// configuración del motor de plantillas
handlebars.config(server);

// declaración de ruta estática
server.use("/", express.static(pathConfig.css));
server.use("/", express.static(pathConfig.js));
server.use("/", express.static(pathConfig.images));
server.use("/realtimeproducts", express.static(pathConfig.js));
server.use("/realtimeproducts", express.static(pathConfig.css));
server.use("/realtimeproducts", express.static(pathConfig.images));

// declaración de enrutadores
server.use("/", viewsRouter);
server.use("/api/products", productRouter);
server.use("/api/carts", cartRouter);

// método que gestiona las rutas inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// control de errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el servidor</h1>");
});

// método oyente de solicitudes
const serverHttp = server.listen(port, () => {
    console.log(`Ejecutándose en http://${host}:${port}`);
});

// así enviamos el serverHttp al socket.config.js
serverSocket.config(serverHttp);