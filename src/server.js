/* Servidor Express */
import express from "express";
import mongoDB from "./config/mongoose.config.js";
import productRouter from "./router/api.product.routes.js";
import viewsProductRouter from "./router/app.product.routes.js";
import cartRouter from "./router/api.cart.routes.js";
import viewsCartRouter from "./router/app.cart.routes.js";
import viewsRouter from "./router/views.routes.js";
import PATH from "./utils/path.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/socket.config.js";

const PORT = 8080;
const HOST = "localhost"; // 127.0.0.1
const server = express();

server.use(express.urlencoded({ extended: true })); // para recibir los datos en urlencoded desde postman
server.use(express.json());

// configuracion del motor de plantillas
handlebars.CONFIG(server);

// declaracion de ruta estatica
server.use("/", express.static(PATH.css));
server.use("/", express.static(PATH.js));
server.use("/", express.static(PATH.images));
server.use("/products", express.static(PATH.css));
server.use("/products", express.static(PATH.images));
server.use("/carts", express.static(PATH.css));
server.use("/realTimeProducts", express.static(PATH.js));
server.use("/realTimeProducts", express.static(PATH.css));
server.use("/realTimeProducts", express.static(PATH.images));

// Declaración de enrutadores
server.use("/", viewsRouter);
server.use("/carts", viewsCartRouter);
server.use("/products", viewsProductRouter);
server.use("/api/products", productRouter);
server.use("/api/carts", cartRouter);

// Metodo que gestiona las rutas inexistentes.
server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// control de errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el Servidor</h1>");
});

// metodo oyente de solicitudes
const serverHTTP = server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

// asi enviamos el serverHttp al socket.config.js.
serverSocket.CONFIG(serverHTTP);