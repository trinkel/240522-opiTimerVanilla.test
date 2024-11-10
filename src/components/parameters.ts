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

import { SlButton, SlDrawer } from '@shoelace-style/shoelace';
import { settingsForm } from './settingsForm';

export class Parameters {
	// Debugging flag
	dBugg: number = 6;
	// Set defaults
	// ! Changed for testing (6)
	sessionLength: number = 1; // Length of each practice session.
	sessionPause: number = 0; // Length of pause between sessions
	groupStartType: number = 0; // Manual (0) or Scheduled (1)
	groupStartTimeString: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	pm: boolean = false;
	teamMode: number = 0; // Anonymous (0), List (1)
	teamList: [string] = ['']; // CR delimited text to array elements
	numStarts: number = 3; // if teamMode=0: get input; if teamMode=1: `teamList.length`
	warp: number = 1; // Speed factor for demos (1-8)
	tick: number = 200; // Component timeout interval in milliseconds (200)
	pendingWarn: number = 5000; // Time before warning time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: number = 15000; // Time before end to display "leave the ice" badge in milliseconds (15000)

	// Set start time. Default to now
	groupStartTime: Date = new Date();

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

		if (this.teamMode && this.teamList) {
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

		// TODO: Add listener(s) for form element(s)
	} // end constructor()

	// Get formData

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

	get anonymousModeVal(): string {
		return this.formData.get('anonymous-mode') as string;
	}

	get teamListModeVal(): string {
		return this.formData.get('team-list-mode') as string;
	}

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
			: console.error(`element doesn't exist`);
	}

	openDrawer(button: SlButton, drawer: SlDrawer): void {
		button.addEventListener('click', () => {
			drawer.show();
		});
	}

	// ! 241105
	// TODO: rest of form functions go here (pass elements)
	// TODO: Update documentation on different forms of Shoelace imports: • Import JS file in main.ts (element is not called in TS, but is there for HTML elements). • Import individual elements in component file (like parameter.ts and ??.ts) where element is referenced in code. These should be added automatically.

	// TODO: Document attaching form elements within class: query in constructor. Test for existence and pass to function outside of constructor. The test is then not needed in the function. This way function doesn't call query every time the function is called.
	// TODO: VERIFY!! that this method can access all of the functions from everywhere they are needed.

	// TODO: Form drawer open at start?
}

// ToDo: [Follow up eventually-I think we're good] Figure out if this works. Does the stuff outside of the constructor work? Does the stuff inside? What's the difference?
