// src/db.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./db/database.sqlite",
	logging: console.log,
});

export default sequelize;
