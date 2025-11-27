import express from "express";
import { getActiveCartForUser } from "../services/cartService";
import validateJWT, { ExtendRequest } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  // TO DO: get the User Id from jwt after validate from middleware
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

export default router;
