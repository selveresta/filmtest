import { Op, Transaction } from "sequelize";
import Actor from "../models/actor.model";
import ApiError from "../exceptions/api-error";

class ActorService {
	async findOrCreate(name: string, transaction?: Transaction): Promise<Actor> {
		const [actor] = await Actor.findOrCreate({
			where: { name },
			defaults: { name },
			transaction,
		});
		return actor;
	}

	async searchByName(name: string): Promise<Actor[]> {
		return Actor.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
	}

	async getMovies(actorId: number) {
		const actor = await Actor.findByPk(actorId);
		if (!actor) {
			throw ApiError.BadRequest("Actor not found");
		}
		const movies = await actor.getMovies();
		return movies;
	}
}

export default new ActorService();
