import { cartModel } from "../models/cartModel";
import { productModel } from "../models/productModel";
import { IOrderItem, orderModel } from "../models/orderModel";

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
interface updateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}
export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: updateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existsInCart = cart.items.find((p) => p.product === productId);
  if (!existsInCart) {
    return { data: "item does not exist in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "low stock for item", statusCode: 400 };
  }
  existsInCart.quantity = quantity;

  //calculate total amount
  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  total += existsInCart.quantity * existsInCart.unitPrice;
  cart.totalAmount = total;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
interface deleteItemFromCart {
  productId: any;
  userId: string;
}
export const deleteItemFromCart = async ({
  userId,
  productId,
}: deleteItemFromCart) => {
  const cart = await getActiveCartForUser({ userId });
  // does item exist in the cart
  const existsInCart = cart.items.find((p) => p.product === productId);

  if (existsInCart) {
    return { data: "item already exist in cart", statusCode: 400 };
  }
  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  cart.items = otherCartItems;
  cart.totalAmount = total;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface CheckoutCart {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: CheckoutCart) => {
  if (!address) {
    return { data: "address is required", statusCode: 400 };
  }

  const cart = await cartModel.findOne({ userId, status: "active" });
  if (!cart) {
    return { data: "cart not found", statusCode: 404 };
  }

  if (cart.items.length === 0) {
    return { data: "cart is empty", statusCode: 400 };
  }

  const productIds = cart.items.map((item) => item.product.toString());
  const products = await productModel.find({ _id: { $in: productIds } });

  const productMap = new Map<string, (typeof products)[number]>();
  products.forEach((product) => productMap.set(product._id.toString(), product));

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());
    if (!product) {
      return { data: "product not found", statusCode: 400 };
    }

    if (product.stock < item.quantity) {
      return {
        data: `low stock for ${product.title}`,
        statusCode: 400,
      };
    }
  }

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString())!;
    product.stock -= item.quantity;
    await product.save();
  }

  const orderItems: IOrderItem[] = cart.items.map((item) => {
    const product = productMap.get(item.product.toString())!;
    return {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };
  });

  const order = new orderModel({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  await order.save();

  cart.status = "completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};
