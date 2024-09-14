/**
 * @description setup parameters
 * Form:
 *
 * - Switch: Anonymous vs list of teams
 * - Session data comes from one of the following
 * 	1. List of teams: Text area to paste team info from competition schedule
 * 		- Returns array of `teams` objects.
 * 		- String properties may be empty. Be sure to test and replace in class
 * 	2. Anonymous: Select options
 * 		- Select box: practice session duration
 * 		- Number of teams
 * 		- Start time (if empty, start time is controlled by > button)
 * */

// export interface parameters {
// 	numStarts: number;
// }

// export const parameters = {
// 	numStarts: -1,
// };

export class Parameters {
	// Debugging flag
	dBugg: number = 1;
	// Set defaults
	sessionLength: number = 6; // Length of each practice session.
	sessionPause: number = 0; // Length of pause between sessions
	groupStartType: number = 0; // Manual (0) or Scheduled (1)
	groupStartTimeString: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	pm: boolean = false;
	teamMode: number = 0; // Anonymous (0), List (1)
	teamList: [string] = ['']; // CR delimited text to array elements
	pendingWarn: number = 3000; // Time before warning time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: number = 15000; // Time before end to display "leave the ice" badge in milliseconds (15000)

	// Set start time. Default to now
	groupStartTime: Date = new Date();
	// Set start time now plus 1 minute (Testing Mode)
	constructor() {
		if (this.dBugg === 1) {
			// force delay of starting timer run
			this.groupStartTime.setSeconds(this.groupStartTime.getSeconds() + 30);
		}
		// get input from form (future)

		// sessionLength: future enhancement option to set different lengths in `teamList`

		// Set group start time
		if (this.groupStartType && this.groupStartTimeString) {
			let timeString = this.groupStartTimeString.split(':');
			if (timeString.length === 2) {
				timeString.push('00');
			}
			if (this.pm && Number(timeString[0]) <= 12) {
				timeString[0] = Number((timeString[0] += 12)).toString();
			}
			this.groupStartTime.setHours(Number(timeString[0]));
			this.groupStartTime.setMinutes(Number(timeString[1]));
			this.groupStartTime.setSeconds(Number(timeString[2]));
		}

		if (this.teamMode && this.teamList) {
			this.numStarts = this.teamList.length;
		}
	}
}

// ToDo: [Follow up eventually-I think we're good] Figure out if this works. Does the stuff outside of the constructor work? Does the stuff inside? What's the difference?
