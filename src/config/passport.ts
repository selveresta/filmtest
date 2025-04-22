import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

passport.use(
	new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
		try {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return done(null, false, { message: "Incorrect email." });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user || false);
	} catch (err) {
		done(err);
	}
});

export default passport;
