import { Op } from "sequelize";
import Movie from "../models/movie.model";
import Actor from "../models/actor.model";
import actorService from "./actor.service";
import ApiError from "../exceptions/api-error";
import { FormatType, MovieCreateDTO, MovieQueryOpts } from "@T/movie";

class MovieService {
	async create(dto: MovieCreateDTO) {
		const exists = await Movie.findOne({ where: { title: dto.title } });
		if (exists) {
			throw ApiError.BadRequest("Movie already exists");
		}

		const movie = await Movie.create({
			title: dto.title,
			year: dto.year,
			format: dto.format as any,
		});

		const actors = await Promise.all(dto.actors.map((name) => actorService.findOrCreate(name)));
		console.log(actors);
		await movie.setActors(actors);
		return this.getById(movie.id);
	}

	async getById(id: number): Promise<Movie> {
		const movie = await Movie.findByPk(id, { include: [{ model: Actor, as: "actors" }] });
		if (!movie) {
			throw ApiError.BadRequest("Movie not found");
		}
		return movie;
	}

	async list(opts: MovieQueryOpts) {
		const where: any = {};
		if (opts.title) {
			where.title = { [Op.like]: `%${opts.title}%` };
		}

		const include: any = [{ model: Actor, as: "actors" }];
		if (opts.actor) {
			include[0].where = { name: { [Op.like]: `%${opts.actor}%` } };
		}

		const { rows, count } = await Movie.findAndCountAll({
			where,
			include,
			order: [[opts.sort ?? "title", opts.order ?? "ASC"]],
			limit: opts.limit,
			offset: opts.offset,
		});
		return { data: rows, total: count };
	}

	public async update(id: number, dto: Partial<MovieCreateDTO>) {
		const movie = await this.getById(id);

		if (dto.title && dto.title !== movie.title) {
			const conflict = await Movie.findOne({
				where: { title: dto.title, id: { [Op.ne]: id } },
			});
			if (conflict) {
				throw ApiError.BadRequest("A movie with that title already exists");
			}
			movie.title = dto.title;
		}

		if (dto.year !== undefined) {
			movie.year = dto.year;
		}
		if (dto.format) {
			movie.format = dto.format as any;
		}

		await movie.save();

		if (dto.actors) {
			const actors = await Promise.all(dto.actors.map((name) => actorService.findOrCreate(name)));
			await movie.setActors(actors);
		}

		return this.getById(id);
	}

	public async delete(id: number): Promise<void> {
		const movie = await this.getById(id);

		await movie.setActors([]);

		await movie.destroy();
	}

	public async importFromFile(buffer: Buffer): Promise<Movie[]> {
		const text = buffer.toString("utf8");

		const blocks = text.split(/\r?\n\s*\r?\n/);

		const created: Movie[] = [];

		for (const block of blocks) {
			const trimmed = block.trim();
			if (!trimmed) continue;

			const titleMatch = trimmed.match(/^Title:\s*(.+)$/m);
			const yearMatch = trimmed.match(/^Release Year:\s*(\d{4})$/m);
			const formatMatch = trimmed.match(/^Format:\s*(.+)$/m);
			const starsMatch = trimmed.match(/^Stars?:\s*(.+)$/m);

			if (!titleMatch || !yearMatch || !formatMatch || !starsMatch) {
				console.warn("Skipping invalid movie block:", block);
				continue;
			}

			const title = titleMatch[1].trim();
			const year = Number(yearMatch[1]);
			const format = formatMatch[1].trim() as FormatType;
			const actors = starsMatch[1]
				.split(",")
				.map((a) => a.trim())
				.filter((a) => !!a);

			const dto: MovieCreateDTO = { title, year, format, actors };

			try {
				const movie = await this.create(dto);
				created.push(movie);
			} catch (err: any) {
				if (err instanceof ApiError && err.status === 400) {
					console.warn(`Skipping "${title}": ${err.message}`);
				} else {
					throw err;
				}
			}
		}

		return created;
	}
}

export default new MovieService();
