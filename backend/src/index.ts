import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productServices";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import { env } from "./config/env";
import cors from "cors";
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());
const mongoUri = env.mongoUri;

if (!mongoUri) {
  console.error("MONGO_URI env variable is missing");
  process.exit(1);
}

console.log("connecting to Mongo:", mongoUri);

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("connected to db");
    await seedInitialProducts(); // run only after a successful connection
    app.listen(port, () => console.log("server running ..." + port));
  })
  .catch((err) => {
    console.log("failed to connect to db", err);
    process.exit(1);
  });


// seed products after connect to db and before listen to port

app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
