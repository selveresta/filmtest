import { Optional } from "sequelize";

export interface ActorAttributes {
	id: number;
	name: string;
}

export interface ActorCreationAttributes extends Optional<ActorAttributes, "id"> {}
