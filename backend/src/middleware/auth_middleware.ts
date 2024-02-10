import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//* for Typescript types -  Extend the Request interface in the Express namespace to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Middleware function to verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  //* Retrieve the JWT token from the "auth_token" cookie
  const token = req.cookies["auth_token"];

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    //* Verify the token using the JWT_SECRET_KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    //* Extract the userId from the decoded JWT payload and attach it to the request object
    req.userId = (decoded as JwtPayload).userId;

    // Call the next middleware in the chain
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
