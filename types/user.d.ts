import { Optional } from "sequelize";

export interface UserAttributes {
	id: number;
	email: string;
	name: string;
	password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
