export const elementError = (element: string, location?: string) => {
	console.error(
		`[ELEMENT ERROR] Element does not exist: ${element}${
			location ? ` at ${location}` : ``
		}`
	);
};
