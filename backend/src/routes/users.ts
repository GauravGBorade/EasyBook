import express from "express";
import { getLoggedInUser, register } from "../controllers/user_controller";
import { check } from "express-validator";
import verifyToken from "../middleware/auth_middleware";
const router = express.Router();

/* We are using express validator which will validate the requests for us.
if we get any erros then we can handle them in register controller at the start. */

router.get("/me", verifyToken, getLoggedInUser);

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({ min: 6 }),
  ],
  register
);

export default router;
