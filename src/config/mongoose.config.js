import { connect } from "mongoose";

const connectDB = () => {
    const URI = "mongodb+srv://julietaraminger:iwCjUKDOtVPzIMg2@cluster0.uwq4ups.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "commerce", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));

};

export default {
    connectDB,
};