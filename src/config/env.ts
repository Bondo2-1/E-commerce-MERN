import dotenv from "dotenv";

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
