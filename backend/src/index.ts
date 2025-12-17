import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productServices";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import { env } from "./config/env";

const app = express();
const port = 3001;
app.use(express.json());

const mongoUri = env.mongoUri;

if (!mongoUri) {
  console.error("MONGO_URI env variable is missing");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("falied to connect to db", err));

// seed products after connect to db and before listen to port
seedInitialProducts();

app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.listen(port, () => {
  console.log("server running ..." + port);
});
