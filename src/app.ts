import { config } from "dotenv";
import express from "express";
import session from "express-session";
import passport from "./config/passport";
import router from "./routers/index";
import sequelize from "./db";
import "./models/index";

config();
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = parseInt(process.env.PORT ?? "8000", 10);

app.use(express.json());

app.use(
	session({
		secret: (process.env.SESSION_SECRET as string) || "my_secret",
		store: new SequelizeStore({ db: sequelize }),
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", router);

(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		await sequelize.sync({ alter: true });
		app.listen(PORT, () => console.log(`Listening on ${PORT}`));
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		void sequelize.close();
	}
})();
