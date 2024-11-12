/**
 * @description setup parameters
 *
 * Application defaults are set in ../data/appDefaults.ts
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

import { SlButton, SlDrawer } from '@shoelace-style/shoelace';
import { settingsForm } from './settingsForm';

// HERE 241110: `export defaults {}` to settingsForm then get from form for variables below. Or something like that.

export class Parameters {
	// Initialize parameter/settings variables
	practiceLength: number = 0; // Length of each practice session.
	pauseBetweenSelector: string = ''; // Pause between teams
	pauseLength: number = 0; // Length of pause between sessions
	groupStartType: number = 0; // Manual (0) or Scheduled (1)
	groupStartTime: Date = new Date(0);
	operationMode: number = 0; // Anonymous (0), List (1)
	teamList: string[] = ['']; // List of team names (Separated by CR from form)
	numberTeams: number = 0; // if teamMode=0: get input; if teamMode=1: `teamList.length`

	// Initialize App passthrough settings
	warp: number = 0; // Speed factor for demos (1-8)
	tick: number = 0; // Component timeout interval in milliseconds (200)
	pendingWarn: number = 0; // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: number = 0; // Time before end-session to display "leave the ice" badge in milliseconds (15000)

	// Set start time. Default to now
	//! groupStartTime: Date = new Date();
	//! groupStartTimeString: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	//! pm: boolean = false;

	// Reserve FormData object
	formData: FormData = new FormData();

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

		if (this.operationMode && this.teamList) {
			this.numStarts = this.teamList.length;
		}

		// Deploy settings form
		this.setContainer();

		// Connect settings drawer controls
		const openButton = document.querySelector<SlButton>('#settings-btn');
		const drawer = document.querySelector<SlDrawer>('#settings');

		// Add event listeners for drawer contols
		openButton && drawer
			? this.openDrawer(openButton, drawer)
			: console.error('Error function here');

		const form = document.querySelector<HTMLFormElement>('form');
		form
			? (this.formData = new FormData(form))
			: this.elementError('form', 'new FormData');

		this.setParameters();
	} // end constructor()

	// Get User Defaults formData object

	get startTypeVal(): string {
		return this.formData.get('start-type') as string;
	}

	get startTimeVal(): string {
		return this.formData.get('start-time') as string;
	}

	get practiceLengthVal(): string {
		return this.formData.get('practice-length') as string;
	}

	get pauseBetweenSelectorVal(): string {
		return this.formData.get('pause-between-selector') as string;
	}

	get pauseLengthVal(): string {
		return this.formData.get('pause-length') as string;
	}

	get operationModeSelectorVal(): string {
		return this.formData.get('operation-mode-selector') as string;
	}

	get teamListVal(): string {
		return this.formData.get('team-list') as string;
	}

	get numberTeamsVal(): string {
		return this.formData.get('number-teams') as string;
	}

	get teamListModeVal(): string {
		return this.formData.get('team-list-mode') as string;
	}

	// Get App Defaults formData object (hidden fields)

	get warpVal(): string {
		return this.formData.get('warp-param') as string;
	}

	get tickVal(): string {
		return this.formData.get('tick-param') as string;
	}

	get pendingWarnVal(): string {
		return this.formData.get('pending-warn-param') as string;
	}

	get pendingEndSessionVal(): string {
		return this.formData.get('pending-end-session-param') as string;
	}

	// Methods

	elementError = (element: string, location?: string) => {
		console.log(
			`Element does not exist: ${element}${location ? ` at ${location}` : ``}`
		);
	};

	setContainer(): void {
		const settingsContainer = document.querySelector<HTMLBaseElement>(
			'#settings-container'
		);
		settingsContainer
			? (settingsContainer.innerHTML = settingsForm)
			: console.error(`element doesn't exist`); // Set elementError
	}

	openDrawer(button: SlButton, drawer: SlDrawer): void {
		button.addEventListener('click', () => {
			drawer.show();
		});
	}

	setParameters(): void {
		// Get user defaults from settings form
		this.practiceLength = Number(this.practiceLengthVal); // Length of each practice session.
		this.pauseLength = Number(this.pauseLengthVal); // Length of pause between sessions

		this.groupStartType = Number(this.startTypeVal); // Manual (0) or Scheduled (1)
		if (this.groupStartType) {
			this.groupStartTime = new Date(this.startTimeVal); // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
		} else {
			this.groupStartTime = new Date(0);
		}

		this.pm = false;

		this.operationMode = Number(this.operationModeSelectorVal); // Anonymous (0), List (1)
		if (this.operationMode) {
			this.teamList = this.operationModeSelectorVal.split('\n'); // CR delimited text to array elements
			this.numStarts = 0;
		} else {
			this.teamList = [];
			this.numStarts = 3; // if teamMode=0: get input; if teamMode=1: `teamList.length`
		}

		// Get application defaults from appDefaults
		this.warp = 1; // Speed factor for demos (1-8)
		this.tick = 200; // Component timeout interval in milliseconds (200)
		this.pendingWarn = 5000; // Time before warning time to flash badge "pending" in milliseconds (3000)
		this.pendingEndSession = 15000; // Time before end to display "leave the ice" in milliseconds (1500// Set start time. Default to now
	}

	// ! 241105
	// TODO: rest of form functions go here (pass elements)
	// TODO: Update documentation on different forms of Shoelace imports: • Import JS file in main.ts (element is not called in TS, but is there for HTML elements). • Import individual elements in component file (like parameter.ts and ??.ts) where element is referenced in code. These should be added automatically.

	// TODO: Document attaching form elements within class: query in constructor. Test for existence and pass to function outside of constructor. The test is then not needed in the function. This way function doesn't call query every time the function is called.
	// TODO: VERIFY!! that this method can access all of the functions from everywhere they are needed.

	// TODO: Form drawer open at start?
}

// ToDo: [Follow up eventually-I think we're good] Figure out if this works. Does the stuff outside of the constructor work? Does the stuff inside? What's the difference?
