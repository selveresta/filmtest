import { Request, Response, NextFunction } from "express";
import { validationResult, body, param, query } from "express-validator";
import multer from "multer";
import MovieService from "../services/movie.service";
import ApiError from "../exceptions/api-error";
import { FormatType, MovieCreateDTO } from "@T/movie";

const upload = multer({ storage: multer.memoryStorage() });

class MovieController {
	public create = [
		body("title").isString().notEmpty(),
		body("year").isInt({ min: 1800 }),
		body("format").isIn(["VHS", "DVD", "Blu-ray"]),
		body("actors").isArray({ min: 1 }),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return next(ApiError.BadRequest("Validation error", errors.array()));
				}
				const dto: MovieCreateDTO = {
					title: req.body.title,
					year: Number(req.body.year),
					format: req.body.format as FormatType,
					actors: req.body.actors,
				};
				const movie = await MovieService.create(dto);
				res.status(201).json({ status: 1, data: movie });
			} catch (err) {
				next(err);
			}
		},
	];

	public list = [
		query("title").optional().isString(),
		query("actor").optional().isString(),
		query("sort").optional().isIn(["id", "title", "year"]),
		query("order").optional().isIn(["ASC", "DESC"]),
		query("limit").optional().isInt({ min: 1 }),
		query("offset").optional().isInt({ min: 0 }),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const opts = {
					title: req.query.title as string,
					actor: req.query.actor as string,
					sort: (req.query.sort as any) || "title",
					order: (req.query.order as any) || "ASC",
					limit: req.query.limit ? Number(req.query.limit) : undefined,
					offset: req.query.offset ? Number(req.query.offset) : undefined,
				};
				const result = await MovieService.list(opts);
				res.json({ status: 1, ...result });
			} catch (err) {
				next(err);
			}
		},
	];

	public getOne = [
		param("id").isInt({ min: 1 }),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const id = Number(req.params.id);
				const movie = await MovieService.getById(id);
				res.json({ status: 1, data: movie });
			} catch (err) {
				next(err);
			}
		},
	];

	public update = [
		param("id").isInt({ min: 1 }),
		body("title").optional().isString(),
		body("year").optional().isInt({ min: 1800 }),
		body("format").optional().isIn(["VHS", "DVD", "Blu-ray"]),
		body("actors").optional().isArray(),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const errors = validationResult(req);
				console.log(errors);
				if (!errors.isEmpty()) {
					return next(ApiError.BadRequest("Validation error", errors.array()));
				}
				const id = Number(req.params.id);
				const updated = await MovieService.update(id, req.body);
				res.json({ status: 1, data: updated });
			} catch (err) {
				next(err);
			}
		},
	];

	public delete = [
		param("id").isInt({ min: 1 }),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const id = Number(req.params.id);
				await MovieService.delete(id);
				res.json({ status: 1 });
			} catch (err) {
				next(err);
			}
		},
	];

	public import = [
		upload.single("movies"),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				if (!req.file) {
					return next(ApiError.BadRequest("No file uploaded"));
				}
				const imported = await MovieService.importFromFile(req.file.buffer);
				res.json({ status: 1, data: imported });
			} catch (err) {
				next(err);
			}
		},
	];
}

export default new MovieController();
