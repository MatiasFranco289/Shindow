import { Router } from "express";
import authController from "../controllers/authController";
import authValidation from "../validations/login";

const authRouter = Router();

authRouter.post("/login", authValidation, authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
