import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    _id: false,
});

const cartSchema = new Schema({
    products: [cartItemSchema],
});

cartSchema.pre(/^find/, function(next) {
    this.populate("products");
    next();
});

const CartModel = model("carts", cartSchema);
export default CartModel;