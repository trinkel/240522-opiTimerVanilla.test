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

// sample data: remove or add a demo switch
import { teams } from '../data/sampleData';

interface sessionSpec {
	duration: number;
	firstMusic: number;
	firstWarning: number;
	secondMusic: number;
	secondWarning: number;
	endWarning: number;
}

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

export class TeamSession {
	teams: teams[];
	sessionSpec: sessionSpec = {
		duration: 0,
		firstMusic: 0,
		firstWarning: 0,
		secondMusic: 0,
		secondWarning: 0,
		endWarning: 0,
	};

	startTime: Date = new Date();
	firstWarnTime: Date = new Date();
	firstMusicTime: Date = new Date();
	secondWarnTime: Date = new Date();
	secondMusicTime: Date = new Date();
	endTime: Date = new Date();
	timeRemaining: string = ''; // <- Not used?

	constructor(teams: teams[], numStarts?: number) {
		this.teams = teams;
		console.log(this.teams);

		if (numStarts) {
			// Do the thing `numStarts` times
		} else {
			teams.forEach((team) => {
				// todo: Outline the timer process here, then replicate above for anonymous start
				// Can we run the two setups then merge into a single run?

				/** incoming: Team objects (from an array) includes
				 * 	- teamName: string
				 * 	- level: string
				 * 	- startTime: string
				 * 	- endTime: string
				 * 	- duration: number
				 *
				 * imported: practiceTimes array of objects includes
				 * 	- duration: number
				 * 	- firstMusic: number
				 *  - firstWarning: number
				 *  - secondMusic: number
				 *  - secondWarning: number
				 *  - endWarning: number
				 */

				// Initialize Session Duration
				this.sessionSpec = practiceTimes[team.duration];

				// Set variables: Date
				this.startTime = setTime(team.startTime);
				this.firstWarnTime = this.firstWarn;
				this.firstMusicTime = this.firstMusic;
				this.secondWarnTime = this.secondWarn;
				this.secondMusicTime = this.secondMusic;
				this.endTime = this.stopTime;
			});
		}
	}

	// reference to practice session spec
	// sessionSpec: practiceTimes[setup[0].sessionSpec],

	// getters based on ${practiceTimes}
	// Runs each loop. Basis for time math
	get current(): Date {
		return new Date();
	}

	get firstMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.firstMusic);
	}

	get firstWarn(): Date {
		return addMinutes(this.firstMusic, this.sessionSpec.firstWarning * -1);
	}

	get secondMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.secondMusic);
	}

	get secondWarn(): Date {
		return addMinutes(this.secondMusic, this.sessionSpec.secondWarning * -1);
	}

	get stopTime(): Date {
		// return addMinutes(this.startTime, 1.5);
		return addMinutes(this.startTime, this.sessionSpec.duration);
	}

	remainingTime(target: Date): string {
		let t = intervalToDuration({
			start: this.current,
			end: target,
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
	}
}

console.dir(TeamSession);

export default TeamSession;
