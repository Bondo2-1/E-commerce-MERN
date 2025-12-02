import { cartModel } from "../models/cartModel";
import { productModel } from "../models/productModel";

interface createCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: createCartForUser) => {
  const cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface getActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: getActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });
  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};

interface addItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: addItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // does item exist in the cart
  const existsInCart = cart.items.find((p) => p.product === productId);

  if (existsInCart) {
    return { data: "item already exist in cart", statusCode: 400 };
  }

  //fetch the product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "product not found", statusCode: 400 };
  }

  // stock < quantity
  if (product.stock < quantity) {
    return { data: "low stock for item", statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });
  cart.totalAmount += product.price * quantity;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
