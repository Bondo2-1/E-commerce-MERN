import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IProduct } from "./productModel";

const CartStatusEnum = ["active","completed"]

export interface ICartItem extends Document {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: string | ObjectId;
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
    userId: {type: Schema.Types.ObjectId, ref: "user",required:true},
    items: [cartItemSchema],
    totalAmount: {type:Number,required:true, default:0},
    status: {type:String, enum:CartStatusEnum, default:"active"}
})

export const cartModel = mongoose.model<ICart>("cart", cartSchema);
