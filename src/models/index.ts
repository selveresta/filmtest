// src/models/index.ts
import Movie from "./movie.model";
import Actor from "./actor.model";
import sequelize from "../db";

const MovieActors = sequelize.define("MovieActors", {}, { timestamps: false });

Movie.belongsToMany(Actor, {
	through: MovieActors,
	as: "actors",
	foreignKey: "movieId",
});
Actor.belongsToMany(Movie, {
	through: MovieActors,
	as: "movies",
	foreignKey: "actorId",
});

export { Movie, Actor };
