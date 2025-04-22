import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import UserService from "../services/user.service";
import ApiError from "../exceptions/api-error";

const userService = new UserService();

export default class UserController {
	public registration = [
		body("email").isEmail(),
		body("name").isString().notEmpty(),
		body("password").isLength({ min: 6 }),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return next(ApiError.BadRequest("Validation error", errors.array()));
				}

				const { email, name, password } = req.body;
				const result = await userService.register({ email, name, password });

				res.status(201).json({ status: 1, user: result });
			} catch (err) {
				next(err);
			}
		},
	];
}
