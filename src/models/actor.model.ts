import {
	Model,
	DataTypes,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManySetAssociationsMixin,
} from "sequelize";
import sequelize from "../db";
import Movie from "./movie.model";
import { ActorAttributes, ActorCreationAttributes } from "@T/actor";

export class Actor extends Model<ActorAttributes, ActorCreationAttributes> implements ActorAttributes {
	public id!: number;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public getMovies!: BelongsToManyGetAssociationsMixin<Movie>;
	public addMovie!: BelongsToManyAddAssociationMixin<Movie, number>;
	public setMovies!: BelongsToManySetAssociationsMixin<Movie, number>;
}

Actor.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "actors",
		timestamps: true,
	}
);

export default Actor;
