import { Optional } from "sequelize";

export type  FormatType = "VHS" | "DVD" | "Blu-ray";

export interface MovieAttributes {
	id: number;
	title: string;
	year: number;
	format: FormatType;
}

export interface MovieCreationAttributes extends Optional<MovieAttributes, "id"> {}

export interface MovieCreateDTO {
	title: string;
	year: number;
	format: string;
	actors: string[];
}
