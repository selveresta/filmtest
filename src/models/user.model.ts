import { UserAttributes, UserCreationAttributes } from "@T/user";
import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number;
	public email!: string;
	public name!: string;
	public password!: string;

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
	}
);
