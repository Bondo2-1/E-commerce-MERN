import express from "express";
import { addItemToCart, getActiveCartForUser } from "../services/cartService";
import validateJWT, { ExtendRequest } from "../middlewares/validateJWT";
import { ICartItem } from "../models/cartModel";
const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  // TO DO: get the User Id from jwt after validate from middleware
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

export default router;
