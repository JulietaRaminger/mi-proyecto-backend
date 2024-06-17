import handlebars from "express-handlebars";
import path from "../utils/path.js";

const config = (server) => {
    server.engine("handlebars", handlebars.engine());
    server.set("views", path.views);
    server.set("view engine", "handlebars");
};

export default { config };