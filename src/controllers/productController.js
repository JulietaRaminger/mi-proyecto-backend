import fs from "fs";
import path from "path";

export default class productController {
    // Constructor
    constructor() {
        this.path = path.join("./src/data/product.json");
    }

    // Funciones privadas
    #generarId = (products) => {
        let idMayor = 0;
        products.forEach((product) => {
            if (product.id > idMayor) {
                idMayor = product.id;
            }
        });
        return idMayor + 1;
    };

    #readProductos = async () => {
        await this.#ensureFileExists();
        const respuesta = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(respuesta);
    };

    #escribirArchivo = async (datos) => {
        return await fs.promises.writeFile(this.path, JSON.stringify(datos, null, "\t")); // Escribir los productos combinados en el archivo
    };

    #validateCode = (products, code) => {
        const validate = products.find((product) => product.code === code);
        if (validate) {
            console.log("El código ya existe");
        }
        return !validate;
    };

    #identifyId = async (id) => {
        const respuesta = await this.#readProductos();
        const productId = respuesta.find((product) => product.id === id);
        return productId;
    };

    #ensureFileExists = async () => {
        try {
            await fs.promises.access(this.path, fs.constants.F_OK);
        } catch (error) {
            await this.#escribirArchivo([]);
        }
    };

    // Funciones públicas
    addProduct = async ({ category, title, description, price, thumbnail = [], code, stock, available }) => {
        await this.#ensureFileExists();
        const products = await this.#readProductos();
        const product = {
            id: this.#generarId(products),
            category,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            available: available !== undefined ? available : true,
        };
        if (!category || !title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        } else {
            if (this.#validateCode(products, code)) {
                const productoAgregado = [ ...products, product ];
                await this.#escribirArchivo(productoAgregado);
                return "Producto Agregado";
            }
        }
    };

    getProductById = async (id) => {
        await this.#ensureFileExists();
        const respuesta = await this.#identifyId(id);
        if (!respuesta) {
            return "Not Found";
        } else {
            return respuesta;
        }
    };

    deleteProductById = async (id) => {
        await this.#ensureFileExists();
        let products = await this.#readProductos();
        products = products.filter((product) => product.id !== id);
        await this.#escribirArchivo(products);
        return "Producto Eliminado";
    };

    updateProduct = async ({ id, ...product }) => {
        await this.#ensureFileExists();
        const existingProduct = await this.#identifyId(id);
        if (existingProduct) {
            let products = await this.#readProductos();
            products = products.map((p) => (p.id === id ? { id, ...product } : p));
            await this.#escribirArchivo(products);
            return "Producto Modificado";
        } else {
            return "Producto no encontrado";
        }
    };

    toggleAvailability = async (id) => {
        await this.#ensureFileExists();
        const products = await this.#readProductos();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
            return "Producto no encontrado";
        }
        products[index].available = !products[index].available;
        await this.#escribirArchivo(products);
        return products[index];
    };

    getProducts = async () => {
        await this.#ensureFileExists();
        const products = await this.#readProductos();
        return products;
    };
}