import * as dotenv from 'dotenv';
dotenv.config();

export const generate = () => {
	const subset = process.env.ID_GENERATING_SECRET || "";
	const length = 6;
	let id = "";
	for (let i = 0; i < length; i++) {
		id += subset[Math.floor(Math.random() * subset.length)];
	}
	return id;
}
