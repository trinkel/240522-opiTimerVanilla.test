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
import {
	appDefaults,
	operationModes,
	practiceLengthTimes,
} from '../data/appDefaults';
import { settingsForm } from './settingsForm';

export class Parameters {
	// Map appDefaults to Parameters
	practiceLength = appDefaults.practiceLength;
	pauseBetweenSelector = appDefaults.pauseBetweenSelector;
	pauseLength = appDefaults.pauseLength;
	groupStartType = appDefaults.groupStartType;
	groupStartTime = appDefaults.groupStartTime;
	operationMode = appDefaults.operationMode;
	teamList = appDefaults.teamList;
	numberTeams = appDefaults.numberTeams;

	// App passthrough settings
	dBugg = appDefaults.dBugg;
	warp = appDefaults.warp;
	tick = appDefaults.tick;
	pendingWarn = appDefaults.pendingWarn;
	pendingEndSession = appDefaults.pendingEndSession;

	// Set start time. Default to now
	//! groupStartTime: Date = new Date();
	//! groupStartTimeString: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	//! pm: boolean = false;

	// Reserve FormData object
	formData: FormData = new FormData();

	constructor() {
		// Deploy settings form
		this.setContainer();

		// Connect settings drawer controls
		const openButton = document.querySelector<SlButton>('#settings-btn');
		const drawer = document.querySelector<SlDrawer>('#settings');

		// Add event listeners for drawer controls
		//TODO: Does the really need to call a function? Move the event here?
		openButton && drawer
			? this.openDrawer(openButton, drawer)
			: console.error('Error function here');

		const form = document.querySelector<HTMLFormElement>('form');
		form
			? (this.formData = new FormData(form))
			: this.elementError('form', 'new FormData');

		// get parameters back from form
		this.setParameters();

		// Event Builder
		if (form && drawer) {
			// this.submitForm(form, drawer);
		} else {
			!form ? this.elementError('form', 'eventBuilder') : null;
			!drawer ? this.elementError('drawer', 'eventBuilder') : null;
		}

		// ----- Above: New deploy form
		// ----- Below: Old parameter setup, figure it out

		//! Pseudo
		/* [Should some of this be in settingsForm.ts?]
		Build form functionality (see opiTimer-form.stack)
		Form has event. Let it bubble and use .closest() (see tutorial)
		Need function for save button
			validation (see opiTimer-form.stack)
			run setParameters()
		*/
		//!

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

	get teamListVal(): string[] {
		const value = this.formData.get('team-list') as string;
		return value.split('\n');
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
		this.practiceLength = Number(this.practiceLengthVal) as practiceLengthTimes; // Length of each practice session.
		this.pauseLength = Number(this.pauseLengthVal); // Length of pause between sessions

		this.groupStartType = Number(this.startTypeVal); // Manual (0) or Scheduled (1)
		if (this.groupStartType) {
			this.groupStartTime = new Date(this.startTimeVal); // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
		} else {
			this.groupStartTime = new Date(0);
		}

		this.pm = false; //! <--

		this.operationMode = this.operationModeSelectorVal as operationModes; // anonymous, list
		switch (this.operationMode) {
			case 'anonymous':
				this.numberTeams = Number(this.numberTeamsVal);
				this.teamList = [''];
				break;
			case 'list':
				this.teamList = this.teamListVal;
				this.numberTeams = this.teamList.length;
		}

		// Get application defaults from appDefaults
		this.warp = 1; // Speed factor for demos (1-8)
		this.tick = 200; // Component timeout interval in milliseconds (200)
		this.pendingWarn = 5000; // Time before warning time to flash badge "pending" in milliseconds (3000)
		this.pendingEndSession = 15000; // Time before end to display "leave the ice" in milliseconds (1500// Set start time. Default to now
	}

	submitForm(form: HTMLFormElement, drawer: SlDrawer) {
		Promise.all([
			customElements.whenDefined('sl-input'),
			customElements.whenDefined('sl-select'),
			customElements.whenDefined('sl-option'),
			customElements.whenDefined('sl-radio-group'),
			customElements.whenDefined('sl-radio-button'),
			customElements.whenDefined('sl-textarea'),
		])
			.then(() => {
				form.addEventListener('submit', (event) => {
					event.preventDefault();
					if (drawer) {
						drawer.hide();
						// alert('All fields are valid!');
					} else {
						this.elementError('drawer', 'form addEventListener');
					}
				});
			})
			.catch((error) => {
				console.error(`Promise.all Error: ${error.message}`);
			});
	}

	// ! 241105
	// TODO: rest of form functions go here (pass elements)
	// TODO: Update documentation on different forms of Shoelace imports: • Import JS file in main.ts (element is not called in TS, but is there for HTML elements). • Import individual elements in component file (like parameter.ts and ??.ts) where element is referenced in code. These should be added automatically.

	// TODO: Document attaching form elements within class: query in constructor. Test for existence and pass to function outside of constructor. The test is then not needed in the function. This way function doesn't call query every time the function is called.

	// TODO: Document TypeScript literal types (eg '1 | 6 | 7 | 8 | 10 | 11 | 12') as they are used here. Should work as advertised but I think there were issue going through the formData API. When they were converted back to string or number they got an error —Type 'number' is not assignable to type <type> ts(2322)— when to all appearances, the types matched. The solution was to create an alias of the type and use it in place of the type. Then where I was cast the variable as the alias —See `setParameters(): this.practiceLength() (number) and this.operationMode() (string)

	// TODO: VERIFY!! that this method can access all of the functions from everywhere they are needed.

	// TODO: Form drawer open at start?
}

// ToDo: [Follow up eventually-I think we're good] Figure out if this works. Does the stuff outside of the constructor work? Does the stuff inside? What's the difference?
