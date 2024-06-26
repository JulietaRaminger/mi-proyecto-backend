import multer from "multer";
import path from "path";

// Configurar el almacenamiento de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join("src", "public", "images")); // Construye la ruta correcta
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo con un timestamp
    },
});

const uploader = multer({ storage });
export default uploader;