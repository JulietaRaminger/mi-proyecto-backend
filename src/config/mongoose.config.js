import { connect, Types } from "mongoose";

const connectDB = async () => {
    const URI = "mongodb+srv://julietaraminger:PFucmdOvKhfCPHFD@cluster0.uwq4ups.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "denadiseno", // Nombre de la base de datos.
    };

    try {
        await connect(URI, options);
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }
};

const isValidId = (id) => {
    return Types.ObjectId.isValid(id); // esto devuelve true o false.
};

export default { connectDB, isValidId };