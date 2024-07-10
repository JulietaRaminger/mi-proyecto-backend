import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
});

const MessageModel = model("message", messageSchema);
export default MessageModel;