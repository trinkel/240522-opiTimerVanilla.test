// Time utilities
import {
	addMinutes,
	addSeconds,
	format,
	setHours,
	setMinutes,
	setSeconds,
} from 'date-fns';

import { groupStartTypeTypes, warpFactors } from '../components/parameters';
import { practiceTimes } from '../data/practiceTimes';
import { timeUnits } from '../utilities/timeUtilities';

interface sessionSpec {
	[specKey: string]: any; // Index Signature (Parameter): used as array index string for indicator.maxValue in componentController.ts to keep TypeScript happy

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
	[timeKey: string]: any; //Index Signature (Parameter): used as array index string for indicator.maxValue in componentController.ts to keep TypeScript happy
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
	teamStartTime: Date;

	/**
	 * Creates an instance of TimeController.
	 *
	 * @constructor
	 * @param {number} duration sessionLength
	 * @param {number} tick Loop interval
	 * @param {number} pendingWarn Time before
	 * @param {number} pendingEndSession Time before end of session to display "leave the ice"
	 * @param {warpFactors} [warp=1] Speed enhancement for demos
	 * @param {groupStartTypeTypes} groupStartType ['scheduled' | 'manual] Start by time or button
	 * @param {Date} groupStartTime Time passed from parameters (presumably group start time) or current time if nothing passed (presumably team/session start time). Passed to this.teamStartTime
	 * @param {boolean} [idle=true] Time before session starts
	 */
	constructor(
		public duration: number, // sessionLength
		public tick: number, // loop interval
		public pendingWarn: number, //Time before warning time to flash badge
		public pendingEndSession: number, // Time before end to display "leave the ice"
		public warp: warpFactors = 1,
		public groupStartType: groupStartTypeTypes,
		public groupStartTime: Date = this.current,
		public idle = true // true is waiting for start of session? Don't need any more? Or just don't remember
	) {
		/**
		 * startTime is a getter
		 * teamStartTime holds the value as a variable for places that couldn't use the getter
		 */ //! COMMENT NOT ACCURATE ANY MORE?
		this.teamStartTime = this.groupStartTime;
		// this.groupStartTime = this.teamStartTime;
		console.log(`groupStartTypex: ${this.groupStartType}`);
		console.log(`groupStartTimex: ${this.groupStartTime}`);
		// Select Session Duration object
		this.sessionSpec = practiceTimes[this.duration];

		// TODO: [240813] (turn into explainer comment) getters return an array or object of a string ([hours]:minutes:seconds) and a number (seconds) until that goal. Initial defs above should change to that.
		// TODOcont: First, we do need a date/time for each goal set on init. Then, in each loop, we need to get the array/object to set the timer. I think the getters (set times) and methods (run timers) are already set up below, they just need to be used.

		// Set timer variables
		this.setTimerTimes();
	} // end constructor

	//Getters set initial times. remainingTime() does the work during control loop.
	get current(): Date {
		// updater, used in remainingTime function
		return new Date();
	}

	get startTime(): Date {
		switch (this.groupStartType) {
			case 'manual':
				return new Date(0);
				break;
			case 'scheduled':
				return this.groupStartTime;
				break;
			default:
				return new Date();
		}
	}

	get firstMusic(): Date {
		return addMinutes(this.teamStartTime, this.sessionSpec.firstMusic);
	}

	get firstWarning(): Date {
		return addMinutes(this.firstMusic, this.sessionSpec.firstWarning * -1);
	}

	get secondMusic(): Date {
		return addMinutes(this.teamStartTime, this.sessionSpec.secondMusic);
	}

	get secondWarning(): Date {
		return addMinutes(this.secondMusic, this.sessionSpec.secondWarning * -1);
	}

	get endSession(): Date {
		return addMinutes(this.teamStartTime, this.sessionSpec.duration);
	}

	get endWarning(): Date {
		return addMinutes(this.endSession, this.sessionSpec.endWarning * -1);
	}

	set extendStartSession(pauseDifference: number) {
		this.teamStartTime = addSeconds(this.teamStartTime, pauseDifference);
	}

	set extendEndSession(endSession: Date) {
		this.endSessionTime = addSeconds(endSession, 1);
	}

	extendSession({ start, end }: { start: Date; end: Date }) {
		const pauseDifference =
			(end.getTime() - start.getTime()) / timeUnits.millies;
		this.extendStartSession = pauseDifference;
		this.setTimerTimes();
		console.dir(this);
	}

	/** Set variables for timer implementation */
	setTimerTimes() {
		this.firstWarningTime = this.firstWarning;
		this.firstMusicTime = this.firstMusic;
		this.secondWarningTime = this.secondWarning;
		this.secondMusicTime = this.secondMusic;
		this.endWarningTime = this.endWarning;
		this.endSessionTime = this.endSession;
	}

	/**
	 * Calculates the remaining time between the current time and a target time.
	 *
	 * @param {Date} target - The target date and time.
	 * @param {Date} [now=this.current] - The current date and time. Defaults to the current time if not provided.
	 * @returns {timeRemaining} An object containing the formatted display of the remaining time and the progress in seconds.
	 */
	remainingTime(target: Date, now: Date = this.current): timeRemaining {
		let interval: number;
		if (target.getTime() <= now.getTime()) {
			interval = 0;
		} else {
			interval = target.getTime() - now.getTime();
		}

		this.timeRemaining.progress = interval;
		this.timeRemaining.display =
			interval < timeUnits.hours * timeUnits.millies // 1 hour
				? format(interval, 'm:ss')
				: format(interval, 'h:mm:ss');

		return this.timeRemaining;
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

// Added a comment
