import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productServices";
import productRoute from "./routes/productRoute";

const app = express();
const port = 3001;
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://silenttwraith_db_user:PKyOg6QMEe2nqkpg@student-list.9l7zkco.mongodb.net/ecommerce"
  )
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("falied to connect to db", err));

// seed products after connect to db and before listen to port
seedInitialProducts();

app.use("/user", userRoute);
app.use("/products",productRoute)
app.listen(port, () => {
  console.log("server running ..." + port);
});
