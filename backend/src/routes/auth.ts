import express from "express";
import { check } from "express-validator";
import {
  login,
  logout,
  verifyTokenReturn,
} from "../controllers/auth_controller";
import verifyToken from "../middleware/auth_middleware";

const router = express.Router();
/* We are using express validator which will validate the requests for us.
if we get any erros then we can handle them in register controller at the start. */

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({
      min: 6,
    }),
  ],
  login
);

router.get("/validate-token", verifyToken, verifyTokenReturn);

router.post("/logout", logout);

export default router;
