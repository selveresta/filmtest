// src/services/user.service.ts

import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import ApiError from "../exceptions/api-error";

export interface RegisterDTO {
	email: string;
	name: string;
	password: string;
}

export default class UserService {
	public async register(dto: RegisterDTO): Promise<{ id: number; email: string; name: string }> {
		const { email, name, password } = dto;

		const exists = await User.findOne({ where: { email } });
		if (exists) {
			throw ApiError.BadRequest(`User with email ${email} already exists`);
		}

		const hash = await bcrypt.hash(password, 10);

		const user = await User.create({ email, name, password: hash });

		return { id: user.id, email: user.email, name: user.name };
	}
}
