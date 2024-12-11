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
 * Format 'text': 1 minute 15 seconds
 * Format 'colon: 01:20
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
 * @param {string} [format='text']
 * @param {boolean} [plural=true]
 * @returns {string}
 */
export function stringifySeconds(
	seconds: number,
	plural: boolean = true,
	format: string = 'text'
): string {
	let str = '';
	let result = objectifySeconds(seconds);
	switch (format) {
		case '':
			console.log('empty string');
			break;
		case 'colon':
			console.dir(result);
			str += result.hours ? `${result.hours.toString().padStart(2, '0')}:` : ``;
			str += result.minutes
				? `${result.minutes.toString().padStart(2, '0')}:`
				: `00:`;
			str += result.seconds
				? `${result.seconds.toString().padStart(2, '0')}`
				: `00`;
			break;
		case 'text':
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

/**
 * formatTime: converts timestamp to hours: seconds:minutes time string format 00:00:00 (hours optional)
 *
 * @export
 * @param {number} timeStamp
 * @returns {string}
 */
export function formatTime(timeStamp: number): string {
	let totalSeconds = Math.round(timeStamp / timeUnits.millies);
	const hours = Math.floor(totalSeconds / timeUnits.hours);
	totalSeconds %= timeUnits.hours;
	const minutes = Math.floor(totalSeconds / timeUnits.minutes);
	const seconds = totalSeconds % timeUnits.minutes;

	if (hours) {
		return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	} else {
		return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`;
	}
}

/**
 * If date/time is in the past, sets it in the future
 * Default is 1 day
 *
 * @export
 * @param {Date} date
 * @param {number} [days=1]
 * @returns {Date}
 */
export function futureDate(date: Date, days: number = 1): Date {
	date < new Date() ? date.setUTCDate(date.getUTCDate() + days) : date;
	return date;
}
