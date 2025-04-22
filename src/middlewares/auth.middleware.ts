import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";

export default function ensureAuth(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}
	next(ApiError.UnauthorizedError());
}
