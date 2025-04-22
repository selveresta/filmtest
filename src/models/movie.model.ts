import { MovieAttributes, MovieCreationAttributes, FormatType } from "@T/movie";
import sequelize from "../db";
import {
	Model,
	DataTypes,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManySetAssociationsMixin,
} from "sequelize";
import { Actor } from "./actor.model";

export class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
	public id!: number;
	public title!: string;
	public year!: number;
	public format!: FormatType;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// Association mixins
	public getActors!: BelongsToManyGetAssociationsMixin<Actor>;
	public addActor!: BelongsToManyAddAssociationMixin<Actor, number>;
	public setActors!: BelongsToManySetAssociationsMixin<Actor, number>;
}

Movie.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		year: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		format: {
			type: DataTypes.ENUM("VHS", "DVD", "Blu-ray"),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "movies",
		timestamps: true,
	}
);

export default Movie;
