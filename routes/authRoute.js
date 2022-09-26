import express from "express";
import { login, logout, refresh } from "../controllers/authController.js";
const router = express.Router();
import {loginLimiter} from '../middleware/loginMiddleware.js'

router.route("/").post(loginLimiter,login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

export default router;
