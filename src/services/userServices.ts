import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
interface registerparams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: registerparams) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "user already found with this email", statusCode: 400 };
  }

  //hashing password
  const hashedPassword = await bcrypt.hash(password,10)
  const newUser = new userModel({ firstName, lastName, email, password:hashedPassword });
  await newUser.save();
  return { data: generateJWT({firstName,lastName,email}), statusCode: 200 };
};

interface paramslogin {
  email: string;
  password: string;
}
export const login = async ({ email, password }: paramslogin) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "email not found", statusCode: 400 };
  }
  const passwordMatch = await bcrypt.compare(password,findUser.password)
  if (passwordMatch) {
    return { data: generateJWT({email, firstName:findUser.firstName, lastName:findUser.lastName}), statusCode: 200 };
  }
  return { data: "password incorrect!", statusCode: 400 };
};

const generateJWT = (data: any) => {
    //const payload = { id: data._id, email: data.email };
    //return jwt.sign(payload, '&`d5bWp9o5ZXc+p', { expiresIn: "24h" });
    return jwt.sign(data,"&`d5bWp9o5ZXc+p",{expiresIn: "24h"})
}
