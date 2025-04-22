// src/middlewares/error-middleware.ts
import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
	console.error(err);
	if (err instanceof ApiError) {
		return res.status(err.status).json({
			status: 0,
			message: err.message,
			errors: err.errors,
		});
	}

	return res.status(500).json({
		status: 0,
		message: err.message || "Unexpected error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
}
