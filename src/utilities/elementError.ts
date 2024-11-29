export const elementError = (element: string, location?: string) => {
	console.log(
		`Element does not exist: ${element}${location ? ` at ${location}` : ``}`
	);
};
