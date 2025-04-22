import { Router } from "express";

import userRouter from "./user.router";
import movieRouter from "./movie.router";
import sessionRouter from "./session.router";

const router = Router();

router.use(userRouter);
router.use(movieRouter);
router.use(sessionRouter);

export default router;
