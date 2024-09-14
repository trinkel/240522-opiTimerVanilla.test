/**
 * Time Unit Utilities
 *
 * @export
 * @interface TimeUnits
 * @typedef {TimeUnits}
 */
export interface TimeUnits {
	/**
	 * milliseconds —
	 * Multiply by: seconds to milliseconds |
	 * Divide by: milliseconds to seconds
	 * @type {number}
	 */
	millies: number;
	/**
	 * minutes —
	 * Multiply by: minutes to seconds |
	 * Divide by: seconds to minutes
	 * @type {number}
	 */
	minutes: number;
	/**
	 * hours —
	 * Multiply by: hours to seconds |
	 * Divide by: seconds to hours
	 * @type {number}
	 */
	hours: number;
	/**
	 * days —
	 * Multiply by: days to seconds |
	 * Divide by: seconds to days
	 * @type {number}
	 */
	days: number;
	/**
	 * weeks —
	 * Multiply by: weeks to seconds |
	 * Divide by: seconds to weeks
	 * @type {number}
	 */
	weeks: number;
}

export const timeUnits: TimeUnits = {
	millies: 1000,

	/**
	 * minutes
	 * Multiply by: minutes to Seconds
	 * Divide by: seconds to minutes
	 * @type {number}
	 */
	minutes: 60,

	/**
	 * hours
	 * Multiply by: hours to Seconds
	 * Divide by: seconds to hours
	 * @type {number}
	 */
	hours: 60 * 60,

	/**
	 * days
	 * Multiply by: days to Seconds
	 * Divide by: seconds to days
	 * @type {number}
	 */
	days: 60 * 60 * 24,

	/**
	 * weeks
	 * Multiply by: weeks to Seconds
	 * Divide by: seconds to weeks
	 * @type {number}
	 */
	weeks: 60 * 60 * 24 * 7,
};

/**
 * Converts seconds to an object of hours, minutes and seconds
 *
 * @export
 * @param {number} totalSeconds
 * @returns {{ hours: number; minutes: number; seconds: number; }}
 */
export function objectifySeconds(totalSeconds: number) {
	const hours: number = Math.floor(totalSeconds / timeUnits.hours);
	totalSeconds %= timeUnits.hours;
	const minutes: number = Math.floor(totalSeconds / timeUnits.minutes);
	const seconds: number = totalSeconds % timeUnits.minutes;
	return { hours, minutes, seconds };
}

/**
 * Converts seconds to hour/minute/second string
 * Caveats: Only one format available. No days.
 *
 * @export
 * @param {number} seconds
 * @param {string} format
 * @returns {string}
 */

/**
 * Description placeholder
 *
 * @export
 * @param {number} seconds
 * @param {boolean} [plural=true]
 * @param {string} [format='text']
 * @returns {string}
 */
export function stringifySeconds(
	seconds: number,
	plural: boolean = true,
	format: string = 'text'
): string {
	let str = '';
	switch (format) {
		case '':
			console.log('empty string');
			break;
		default:
			let result = objectifySeconds(seconds);
			str += result.hours
				? `${result.hours} ${
						result.hours === 1 || plural === false ? 'hour' : 'hours'
				  }`
				: '';
			str += result.hours && (result.minutes || result.seconds) ? `, ` : '';
			str +=
				result.minutes || (result.hours && result.seconds)
					? `${result.minutes} ${
							result.minutes === 1 || plural === false ? 'minute' : 'minutes'
					  }`
					: '';
			str += (result.hours || result.minutes) && result.seconds ? `, ` : '';
			str += result.seconds
				? `${result.seconds} ${
						result.seconds === 1 || plural === false ? 'second' : 'seconds'
				  }`
				: '';
	}
	return str;
}
