import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

//! Register the user
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    //check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    // if not create the user, but first let's encrypt the password before storing it to the database.
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await hashPassword(password);

    //create the user with hashed password.
    user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    //save the user
    await user.save();

    // creating the token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string, //secret key
      { expiresIn: "1d" }
    );

    //create the cookie to store the token. set it as httpOnly so that only server can access it.
    //secure will allow to accept cookies over only https. for prod we will set it as true. for dev set as false.
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //if node.env is production then it will set it will return true. else false.
      maxAge: 86400000,
    });

    return res.status(200).send({ message: "User Registered OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const hashPassword = async function (password: string): Promise<string> {
  return bcrypt.hash(password, 8);
};

//! Get signedIn user -

export const getLoggedInUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
