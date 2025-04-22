import { Router } from "express";
import sessionController from "../controllers/session.controller";
import ensureAuth from "../middlewares/auth.middleware";

const sessionRouter = Router();

sessionRouter.post("/sessions", sessionController.login.bind(sessionController));
sessionRouter.delete("/sessions", ensureAuth, sessionController.logout.bind(sessionController));

export default sessionRouter;
