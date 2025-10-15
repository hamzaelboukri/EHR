import express from "express";
import UserController from "../Controllers/User.controller.js";
// import AuthController from "../Controllers/Auth.controller";
import AuthController from "../Controllers/auth.controller.js";

const router = express.Router();


router.post("/register", UserController.register);
router.post("/login", UserController.login);


router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;