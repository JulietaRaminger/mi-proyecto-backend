import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join("src", "public", "images"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploader = multer({ storage });

export default uploader;