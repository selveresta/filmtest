import { Request, Response, NextFunction } from "express";
import passport from "passport";
import ApiError from "../exceptions/api-error";

class SessionController {
	public login(req: Request, res: Response, next: NextFunction): void {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				return next(ApiError.BadRequest(info?.message || "Login failed"));
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				res.json({ status: 1, user: { id: user.id, email: user.email } });
			});
		})(req, res, next);
	}

	public logout(req: Request, res: Response): void {
		req.logout(() => {
			req.session.destroy((err) => {
				res.clearCookie("connect.sid");
				res.json({ status: 1 });
			});
		});
	}
}

export default new SessionController();
