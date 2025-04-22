import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRouter = Router();
const userCtrl = new UserController();

userRouter.post("/users", userCtrl.registration);

export default userRouter;
