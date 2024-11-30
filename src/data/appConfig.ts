import { format } from 'date-fns';

export type operationModes = 'anonymous' | 'list';
export type practiceLengthTimes = 1 | 2 | 6 | 7 | 8 | 10 | 11 | 12;
export type warpFactors = 1 | 2 | 6 | 7 | 8;
export type groupStartTypeTypes = 'scheduled' | 'manual' | 'dbugg';
export type pauseBetweenSelectorTypes = 'yes' | 'no';

/**
 * Config: Application settings.
 * Application defaults are defined at the top of the class definition
 *
 * @export
 * @interface AppConfig
 * @typedef { AppConfig }
 *
 * @prop {practiceLengthTimes} practiceLength
 * @prop {'yes' | 'no'} pauseBetweenSelector Pause between teams
 * @prop {number} pauseLength Length of pause between sessions in seconds
 * @prop {groupStartTypeTypes} groupStartType
 * @prop {Date} groupStartTime
 * @prop {string} groupStartTimeStr
 * @prop {operationModes} operationMode anonymous | list
 * @prop {string[]} teamList List of team names (Separated by CR from form)
 * @prop {number} numberTeams Number of teams
 * @prop {number} dBugg
 * @prop {boolean} demo Allows for some demo parameters. Mostly to speed things up
 * @prop {warpFactors} warp Speed factor for demos (1-8 typical)
 * @prop {number} tick Component sleep interval in milliseconds
 * @prop {boolean} idle True when session is not running
 * @prop {boolean} clocksSet True when clocks have been set after schedule has been set
 * @prop {boolean} scheduleSet True when schedule defined or manual button clicked
 * @prop {number} pendingWarn Time before warning-time to flash badge "pending" in milliseconds
 * @prop {number} pendingEndSession Time before end-session to display "leave the ice" badge in milliseconds
 */

export interface AppConfig {
	practiceLength: practiceLengthTimes; // Length of each practice session
	pauseBetweenSelector: pauseBetweenSelectorTypes;
	pauseLength: number; // Length of pause between sessions
	groupStartType: groupStartTypeTypes;
	groupStartTime: Date;

	// Create string from `groupStartTime: Date`
	groupStartTimeStr(): string;

	operationMode: operationModes; // anonymous | list
	teamList: string[];
	numberTeams: number;

	/*
	 * Application passthrough settings  */
	dBugg: number;
	demo: boolean; // Allows for some demo parameters. Mostly to speed things up
	warp: warpFactors; // Speed factor for demos (1-8)
	tick: number; // Component timeout interval in milliseconds (200)
	idle: boolean; // True when session is not running
	clocksSet: boolean; //
	scheduleSet: boolean;
	pendingWarn: number; // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: number; // Time before end-session to display "leave the ice" badge in milliseconds (15000)
}

export const appConfig: AppConfig = {
	/*
	 * ---------------------------
	 * Set application defaults here
	 * ---------------------------
	 * User editable settings   */
	practiceLength: 2, // Length of each practice session
	pauseBetweenSelector: 'no',
	pauseLength: 0, // Length of pause between sessions
	groupStartType: 'scheduled',
	groupStartTime: new Date(new Date().setHours(0, 0, 0)),

	// Create string from `groupStartTime: Date`
	groupStartTimeStr() {
		return format(this.groupStartTime, 'HH:mm');
	},

	operationMode: 'anonymous', // anonymous | list
	teamList: [''],
	numberTeams: 6,

	/*
	 * Application passthrough settings  */
	dBugg: 0,
	demo: true, // Allows for some demo parameters. Mostly to speed things up
	warp: 1, // Speed factor for demos (1-8)
	tick: 200, // Component timeout interval in milliseconds (200)
	idle: true, // True when session is not running
	clocksSet: false, //
	scheduleSet: false,
	pendingWarn: 5000, // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: 15000, // Time before end-session to display "leave the ice" badge in milliseconds (15000)
};
/*
 * ---------------------------
 * End application defaults
 * ---------------------------
 */
