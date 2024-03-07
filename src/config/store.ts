
export const generate = () => {
	const subset = "qwertyuiopasdfghjklzxcvbnm123456789";
	const length = 6;
	let id = "";
	for (let i = 0; i < length; i++) {
		id += subset[Math.floor(Math.random() * subset.length)];
	}
	return id;
}
