import express from "express";

const router = express.Router();

import {
  login,
  register,
  userDetails,
} from "../controllers/auth.controller.js";
import { tokenVerify } from "../middleware/tokenVerification.js";

router.post("/login", login);
router.post("/register", register);
router.get("/user/:id", tokenVerify, userDetails);

export default router;
