import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, userModel } from "../models/userModel";

export interface ExtendRequest extends Request {
  user?: any;
}

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    res.status(403).send("authorization header not correct");
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, "&`d5bWp9o5ZXc+p", async (err, decoded) => {
    if (err) {
      res.status(403).send("invalid token");
      return;
    }
    type JWTPayload = {
      firstName: string;
      lastName: string;
      email: string;
    };
    const payload = decoded as JWTPayload;
    const user = await userModel.findOne({ email: payload.email });
    req.user = user;
    next();
  });
};

export default validateJWT;
