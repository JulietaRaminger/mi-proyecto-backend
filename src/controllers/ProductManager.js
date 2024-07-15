import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

export default class ProductManager {
    #itemModel;

    // Constructor
    constructor() {
        this.#itemModel = ProductModel;
    }

    // Funciones privadas
    #readItems = async (limit, skip, sort, filter) => {
        try {
            const items = await this.#itemModel.find(filter).limit(limit).skip(skip).sort(sort).lean();
            return items;
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al leer el archivo";
        }
    };

    #escribirArchivo = async (datos) => {
        try {
            return await datos.save();
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al escribir el archivo";
        }
    };

    #identifyId = async (id) => {
        try {
            const itemId = await this.#itemModel.findById(id);
            return itemId;
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al identificar el producto";
        }
    };

    // Funciones públicas
    countProducts = async () => {
        try {
            return await ProductModel.countDocuments();
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al contar los productos";
        }
    };

    addProduct = async ({ category, title, description, price, thumbnail = [], code, stock, available }) => {

        if (!category || !title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        }
        const products = await this.#readItems();
        try {
            const product = new this.#itemModel({
                category,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                available: available !== undefined ? available : true,
            });
            const sameCode = products.find((product) => product.code === code);
            if (sameCode){
                return "El codigo ya existe";
            }
            await this.#escribirArchivo(product);
            return "Producto agregado correctamente";
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al agregar el producto";
        }
    };

    getProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#identifyId(id);
            return product;
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener el producto";
        }
    };

    deleteProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            await this.#itemModel.findByIdAndDelete(id);
            return "Producto Eliminado";
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al eliminar el producto";
        }
    };

    updateProduct = async ( id, updateData ) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const updatedProduct = await this.#itemModel.findByIdAndUpdate(id, updateData, { new: true });
            if (updatedProduct) {
                return "Producto Modificado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al actualizar el producto";
        }
    };

    toggleAvailability = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#identifyId(id);
            if (product) {
                product.available = !product.available;
                await this.#escribirArchivo(product);
                return product;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al cambiar la disponibilidad del producto";
        }
    };

    getProducts = async (limit, skip, sort, filter) => {
        try {
            return await this.#readItems(limit, skip, sort, filter);
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener los productos";
        }
    };
}