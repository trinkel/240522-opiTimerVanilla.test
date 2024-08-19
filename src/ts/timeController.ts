// Time utilities
import {
	addMinutes,
	differenceInSeconds,
	intervalToDuration,
	setHours,
	setMinutes,
	setSeconds,
} from 'date-fns';

import { practiceTimes } from '../data/practiceTimes';

interface sessionSpec {
	duration: number;
	firstMusic: number;
	firstWarning: number;
	secondMusic: number;
	secondWarning: number;
	endWarning: number;
}

/**
 * Establishes values for timer display
 * @property display string The value for the text-value attribute of the progress-indicator element
 * @property progress number The value for the progress attribute of the progress-indicator element
 */
interface timeRemaining {
	display: string; // text value
	progress: number; // progress meter
}

/**
 * Sets the time of the given Date object based on a minimal time string.
 * @param time A string representing the time in the format 'HH:MM:SS' or 'HH:MM'.
 * @returns A Date object with the time set according to the input string.
 */
// Whoever used this disappeared. It may need to go elsewhere. `ComponentController`?
//! If it is actually used, should this function be with utilities or should it be a property in the class?

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

export class TimeController {
	[key: string]: any; // used as array index string for indicator.maxValue in componentController.ts to keep TypeScript happy
	// teams: teams[];
	sessionSpec: sessionSpec = {
		duration: 0,
		firstMusic: 0,
		firstWarning: 0,
		secondMusic: 0,
		secondWarning: 0,
		endWarning: 0,
	};

	timeRemaining: timeRemaining = {
		display: '',
		progress: 0,
	};

	//TODO: Do we need anything besides startTime (loose the rest)?
	// Starting time for team. Used in init
	// ! Watch this in the case of team list. Loop works on flow of time allotted each team. It we also have scheduled times, make sure the alloted times stay in synch with the scheduled times. (Time/math sanity check)
	startTime: Date = new Date();

	//! Time remaining variable inits (don't need?)
	// firstWarnTimeRemain: timeRemaining = this.timeRemaining;
	// firstMusicTimeRemain: timeRemaining = this.timeRemaining;
	// secondWarnTimeRemain: timeRemaining = this.timeRemaining;
	// secondMusicTimeRemain: timeRemaining = this.timeRemaining;
	// endSessionTimeRemain: timeRemaining = this.timeRemaining;

	//! Time set variable inits (don't need?)
	// firstWarnTime: Date = new Date();
	// firstMusicTime: Date = new Date();
	// secondWarnTime: Date = new Date();
	// secondMusicTime: Date = new Date();
	// endSessionTime: Date = new Date();

	constructor(
		public duration: number, // sessionLength
		public idle = true // true is waiting for start of session? Don't need any more? Or just don't remember
	) {
		// this.teams = teams;
		// console.log(this.teams);

		// if (numStarts) {
		// 	// Do the thing `numStarts` times
		// } else {
		// teams.forEach((team) => {
		//	// todo: Outline the timer process here, then replicate above for anonymous start
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

		// Select Session Duration object
		this.sessionSpec = practiceTimes[this.duration];

		// Set variables: Date
		this.firstWarnTime = this.firstWarn;
		this.firstMusicTime = this.firstMusic;
		this.secondWarnTime = this.secondWarn;
		this.secondMusicTime = this.secondMusic;
		this.endWarnTime = this.endWarn;
		this.endSessionTime = this.endTime;
		// });
	}

	// reference to practice session spec
	// sessionSpec: practiceTimes[setup[0].sessionSpec],

	// getters based on ${practiceTimes}
	// Runs each loop. Basis for time math
	get current(): Date {
		// updater, used in remainingTime function
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

	get endTime(): Date {
		// return addMinutes(this.startTime, 1.5);
		return addMinutes(this.startTime, this.sessionSpec.duration);
	}

	get endWarn(): Date {
		return addMinutes(this.secondMusic, this.sessionSpec.secondWarning * -1);
	}

	//! NOW: (After commit cleanup): Remove this.current and pass it with target date. There are two real calls that need to be fixed in init plus multiple console.logs. Maybe default it to running this.current.
		let t = intervalToDuration({
			start: now,
			end: target,
		});

		// build output
		if (t.hasOwnProperty('hours')) {
			t = Object.assign({ hours: 0, minutes: 0, seconds: 0 }, t);
		} else {
			t = Object.assign({ minutes: 0, seconds: 0 }, t);
		}

		this.timeRemaining.display = Object.values(t)
			.map((unit, i) =>
				i ? unit.toString().padStart(2, '0') : unit.toString().padStart(1, '0')
			)
			.join(':');

		this.timeRemaining.progress = differenceInSeconds(target, now);

		return this.timeRemaining;
	}
}
