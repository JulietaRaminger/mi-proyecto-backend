import fs from "fs";
import path from "path";
import productController from "./productController.js";

const product = new productController();

export default class cartController {
    // constructor
    constructor() {
        this.path = path.join("./src/data/cart.json");
    }

    // funciones privadas
    #generarId = (carts) => {
        let idMayor = 0;
        carts.forEach((cart) => {
            if (cart.id > idMayor) {
                idMayor = cart.id;
            }
        });
        return idMayor + 1;
    };

    #readCarts = async () => {
        await this.#ensureFileExists();
        const respuesta = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(respuesta);
    };

    #escribirArchivo = async (datos) => {
        return await fs.promises.writeFile(this.path, JSON.stringify(datos, null, "\t")); // escribir los productos combinados en el archivo
    };

    #identifyId = async (id) => {
        const respuesta = await this.#readCarts();
        const cartId = respuesta.find((cart) => cart.id === id);
        return cartId;
    };

    #ensureFileExists = async () => {
        try {
            await fs.promises.access(this.path, fs.constants.F_OK);
        } catch (error) {
            await this.#escribirArchivo([]);
        }
    };

    // funciones públicas
    addCart = async () => {
        await this.#ensureFileExists();
        const carts = await this.#readCarts();

        const cart = {
            id: this.#generarId(carts),
            products: [],
        };
        const allCarts = [ ...carts, cart ];
        await this.#escribirArchivo(allCarts);
        return "carrito agregado";
    };

    getCartById = async (id) => {
        const respuesta = await this.#identifyId(id);
        if(!respuesta){
            return "not found";
        } else {
            return respuesta;
        }
    };

    addProductToCart = async (cartId, productId) => {
        await this.#ensureFileExists(); // asegura que el archivo exista antes de cualquier operación
        try {
            const cartById = await this.getCartById(cartId);
            const productById = await product.getProductById(productId);
            if (!cartById) {
                return "carrito no encontrado";
            }
            if (!productById) {
                return "producto no encontrado";
            }
            const carts = await this.#readCarts();
            const cartIndex = carts.findIndex((cart) => cart.id === cartId);
            const productIndex = carts[cartIndex].products.findIndex((product) => product.productId === productId);
            if (productIndex === -1) {
                carts[cartIndex].products.push({ productId, cantidad: 1 });
                await this.#escribirArchivo(carts);
                return "producto agregado";
            } else {
                carts[cartIndex].products[productIndex].cantidad += 1;
                await this.#escribirArchivo(carts);
                return "cantidad del producto incrementada";
            }
        } catch (error) {
            return "error interno";
        }
    };

    deleteCartById = async (id) => {
        await this.#ensureFileExists();
        let carts = await this.#readCarts();
        carts = carts.filter((cart) => cart.id !== id);
        await this.#escribirArchivo(carts);
        console.log("carrito eliminado");
    };

    getCarts = async () => {
        await this.#ensureFileExists();
        const carts = await this.#readCarts();
        return carts;
    };
}