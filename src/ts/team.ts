// ToDo: Convert `teamSession` to a class

// Time utilities
import {
	addMinutes,
	intervalToDuration,
	setHours,
	setMinutes,
	setSeconds,
} from 'date-fns';

import { practiceTimes } from '../data/practiceTimes';

/**
 * Sets the time of the given Date object based on a minimal time string.
 * @param time A string representing the time in the format 'HH:MM:SS' or 'HH:MM'.
 * @returns A Date object with the time set according to the input string.
 */
function setTime(time: string): Date {
	let date = new Date();
	if (time.split(':').length === 3) {
		date = setHours(date, Number(time.split(':')[0]));
		date = setMinutes(date, Number(time.split(':')[1]));
		date = setSeconds(date, Number(time.split(':')[2]));
	} else {
		date = setHours(date, Number(time.split(':')[0]));
		date = setMinutes(date, Number(time.split(':')[1]));
		date = setSeconds(date, 0);
	}
	return date;
}

export class teamSession {

	constructor(teams) {
		this.teams = teams
	}

	this.teams.

	// Set team basics from ${setup}

	// add a team name if none provided for demo purposes
	// remove for PROD
	name: name ? name : 'Rhythm & Blades',

	startTime: setTime(startTime),

	// reference to practice session spec
	// sessionSpec: practiceTimes[setup[0].sessionSpec],
	sessionSpec: practiceTimes[sessionSpec],

	// getters based on ${practiceTimes}
	get current(): Date {
		return new Date();
	},

	get firstMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.firstMusic);
	},

	get firstWarn(): Date {
		return addMinutes(this.firstMusic, this.sessionSpec.firstWarning * -1);
	},

	get secondMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.secondMusic);
	},

	get secondWarn(): Date {
		return addMinutes(this.secondMusic, this.sessionSpec.secondWarning * -1);
	},

	get stopTime(): Date {
		// return addMinutes(this.startTime, 1.5);
		return addMinutes(this.startTime, this.sessionSpec.duration);
	},

	get remainingTime(): string {
		let t = intervalToDuration({
			start: this.current,
			end: this.stopTime,
		});

		// build output
		if (t.hasOwnProperty('hours')) {
			t = Object.assign({ hours: 0, minutes: 0, seconds: 0 }, t);
		} else {
			t = Object.assign({ minutes: 0, seconds: 0 }, t);
		}

		const result: string = Object.values(t)
			.map((unit) => unit.toString().padStart(2, '0'))
			.join(':');
		return result;
	},
};

console.dir(teamSession);

export default teamSession;
