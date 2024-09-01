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
