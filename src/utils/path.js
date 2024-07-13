import path from "path";

const PATH = {
    root: path.dirname(""),
    src: path.join(path.dirname(""), "src"),
    public: path.join(path.dirname(""), "src", "public"),
    images: path.join(path.dirname(""), "src", "public", "images"),
    css: path.join(path.dirname(""), "src", "public", "css"),
    js: path.join(path.dirname(""), "src", "public", "js"),
    views: path.join(path.dirname(""), "src", "views"),
};

export default PATH;