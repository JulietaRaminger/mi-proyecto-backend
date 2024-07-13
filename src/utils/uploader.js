import multer from "multer";
import path from "../utils/path.js";
import moment from "moment";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.images);
    },
    filename: function(req, file, cb){
        const randomNumber = Math.floor(Math.random()*(9999 - 1000 + 1) + 1000); // esto es para crear un numero entre 1000 y 9999.
        const dateTime = moment().format("DDMMYYYY_HHmmss");
        const extension = file.originalname.slice(file.originalname.lastIndexOf("."));
        const filename = `file_${randomNumber}_${dateTime}${extension}`;
        cb(null, filename);
    },
});

const uploader = multer({ storage });
export default uploader;