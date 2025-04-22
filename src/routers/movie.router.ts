import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import MovieController from "../controllers/movie.controller";

const router = Router();
const ctrl = MovieController;

router.post("/movies", authMiddleware, ctrl.create);
router.get("/movies", authMiddleware, ctrl.list);
router.get("/movies/:id", authMiddleware, ctrl.getOne);
router.patch("/movies/:id", authMiddleware, ctrl.update);
router.delete("/movies/:id", authMiddleware, ctrl.delete);
router.post("/movies/import", authMiddleware, ctrl.import);

export default router;
