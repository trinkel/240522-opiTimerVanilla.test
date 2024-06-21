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

export class parameters {
	// Set defaults
	sessionLength: number = 6; // Length of each practice session.
	sessionPause: number = 0; // Length of pause between sessions
	groupStartType: number = 0; // Automatic (0) or Scheduled (1)
	groupStartTimeIn: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	pm: boolean = false;
	teamMode: number = 0; // Anonymous (0), List (1)
	teamList: [string] = ['']; // CR delimited text to array elements
	numStarts: number = 8; // if teamMode=0: get input; if teamMode=1: `teamList.length`
	warp: number = 1; // Speed factor for demos (1-8)

	// Set start time
	groupStartTime: Date = new Date();

	constructor() {
		// get input from form (future)

		// sessionLength: future enhancement option to set different lengths in `teamList`

		// Set group start time
		if (this.groupStartTimeIn) {
			let timeString = this.groupStartTimeIn.split(':');
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
	}
}
