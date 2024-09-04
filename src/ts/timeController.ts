// Time utilities
import {
	addMinutes,
	addSeconds,
	setHours,
	setMinutes,
	setSeconds,
} from 'date-fns';

import { practiceTimes } from '../data/practiceTimes';
import { timeUnits } from './timeUnits';

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
export interface timeRemaining {
	display: string; // text value
	progress: number; // progress meter
}

/**
 * Sets the time of the given Date object based on a minimal time string. Used to manipulate string input from Parameters form.
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

	// Starting time for team. Used in init
	// ! Watch this in the case of team list. Loop works on flow of time allotted each team. It we also have scheduled times, make sure the alloted times stay in synch with the scheduled times. (Time/math sanity check)
	startTime: Date = new Date();

	constructor(
		public duration: number, // sessionLength
		public tick: number, // loop interval
		public warp: number = 1,
		public idle = true // true is waiting for start of session? Don't need any more? Or just don't remember
	) {
		// Select Session Duration object
		this.sessionSpec = practiceTimes[this.duration];

		// TODO: [240813] (turn into explainer comment) getters return an array or object of a string ([hours]:minutes:seconds) and a number (seconds) until that goal. Initial defs above should change to that.
		// TODOcont: First, we do need a date/time for each goal set on init. Then, in each loop, we need to get the array/object to set the timer. I think the getters (set times) and methods (run timers) are already set up below, they just need to be used.
		// Set variables: Date
		this.firstWarnTime = this.firstWarn;
		this.firstMusicTime = this.firstMusic;
		this.secondWarnTime = this.secondWarn;
		this.secondMusicTime = this.secondMusic;
		this.endWarnTime = this.endWarn;
		this.endSessionTime = this.endTime;
	}

	//Getters set initial times. remainingTime() does the work during control loop.
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
		return addMinutes(this.startTime, this.sessionSpec.duration);
	}

	get endWarn(): Date {
		return addMinutes(this.endTime, this.sessionSpec.endWarning * -1);
	}

	/**
	 * Calculates the remaining time between the current time and a target time.
	 *
	 * @param {Date} target - The target date and time.
	 * @param {Date} [now=this.current] - The current date and time. Defaults to the current time if not provided.
	 * @returns {timeRemaining} An object containing the formatted display of the remaining time and the progress in seconds.
	 */
	remainingTime(target: Date, now: Date = this.current): timeRemaining {
		const interval: number = target.getTime() - now.getTime();
		this.timeRemaining.progress = interval;
		this.timeRemaining.display = this.formatTime(interval);

		return this.timeRemaining;
	}

	formatTime(timeStamp: number): string {
		let totalSeconds = Math.round(timeStamp / timeUnits.millies);
		const hours = Math.floor(totalSeconds / timeUnits.hours);
		totalSeconds %= timeUnits.hours;
		const minutes = Math.floor(totalSeconds / timeUnits.minutes);
		const seconds = totalSeconds % timeUnits.minutes;

		if (hours) {
			return `${hours.toString()}:${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		} else {
			return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`;
		}
	}

	/**
	 * Performs a warp jump by calculating the time difference between two dates and then applying a warp factor to that difference. Used to speed up timers for testing and demos.
	 *
	 * @param {Date} now - The current date and time.
	 * @param {Date} before - The date and time before the warp jump.
	 * @returns {Date} - The new date and time after the warp jump.
	 */
	warpJump(before: Date): Date {
		const diff = (this.tick / timeUnits.millies) * this.warp;
		return addSeconds(before, diff);
	}
}
