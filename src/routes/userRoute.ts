import express from "express";
import { login, register } from "../services/userServices";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    res.status(200).send("users service");
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(statusCode).send(data);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });
    res.status(statusCode).send(data);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

export default router;
