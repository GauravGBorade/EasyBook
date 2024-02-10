import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req); //validating the req using express-validator
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { email, password } = req.body; //get email pass from request's body
  try {
    const user = await User.findOne({ email }); //find user with that email

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //if found user then using bcrypt match the passwords.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //if reach here means we've found the user. So just create the token as we created in register and it to cookie.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    /* as browser wont be able to access token and if wa e want to do something with user's id we dont have it. thats why we will return userId as res */

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyTokenReturn = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
};
