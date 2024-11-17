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

import {
	SlButton,
	SlDrawer,
	SlInput,
	SlRadioGroup,
	SlTextarea,
} from '@shoelace-style/shoelace';

import { format } from 'date-fns';

import { SettingsForm } from '../components/settingsForm';

export type operationModes = 'anonymous' | 'list';
export type practiceLengthTimes = 1 | 6 | 7 | 8 | 10 | 11 | 12;
export type groupStartTypeTypes = 'scheduled' | 'manual' | 'dbugg';
export type pauseBetweenSelectorTypes = 'yes' | 'no';
export class Parameters {
	/*
	 * ---------------------------
	 * Set application defaults here
	 * ---------------------------
	 * User editable settings   */
	practiceLength: practiceLengthTimes = 10; // Length of each practice session
	pauseBetweenSelector: pauseBetweenSelectorTypes = 'no';
	pauseLength: number = 0; // Length of pause between sessions
	groupStartType: groupStartTypeTypes = 'scheduled';
	groupStartTime: Date = new Date(new Date().setHours(0, 0, 0));

	// Create string from `groupStartTime: Date`
	groupStartTimeStr: string = format(this.groupStartTime, 'HH:mm:ss');

	operationMode: operationModes = 'anonymous'; // anonymous | list
	teamList: string[] = [''];
	numberTeams: number = 3;

	/*
	 * Application passthrough settings  */
	dBugg: number = 0;
	warp: number = 0; // Speed factor for demos (1-8)
	tick: number = 0; // Component timeout interval in milliseconds (200)
	idle: boolean = true; // True when session is not running
	pendingWarn: number = 0; // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: number = 0; // Time before end-session to display "leave the ice" badge in milliseconds (15000)
	/*
	 * ---------------------------
	 * End application defaults
	 * ---------------------------
	 */

	// Set start time. Default to now
	//! groupStartTime: Date = new Date();
	//! groupStartTimeString: string = ''; // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
	//! pm: boolean = false;

	// Reserve FormData object
	formData: FormData = new FormData();

	constructor() {
		console.log(`appD GST: ${this.groupStartTime}`); //! Correct

		const appSettings = new AppSettings(
			this.groupStartType,
			this.groupStartTimeStr,
			this.practiceLength,
			this.pauseBetweenSelector,
			this.pauseLength,
			this.operationMode,
			this.numberTeams,
			this.teamList
		);

		// Connect settings drawer controls
		const openButton = document.querySelector<SlButton>('#settings-btn');
		const drawer = document.querySelector<SlDrawer>('#settings');

		// Connect form controls
		const form = document.querySelector<HTMLFormElement>('form');
		const pauseSelector = document.querySelector<SlRadioGroup>(
			'#pause-between-selector'
		);
		const pauseInput = document.querySelector<SlInput>('#pause-length');
		const modeSelector = document.querySelector<SlRadioGroup>(
			'#operation-mode-selector'
		);
		const numberInput = document.querySelector<SlInput>('#number-teams');
		const teamsInput = document.querySelector<SlTextarea>('#team-list');

		// Add event listeners for drawer controls
		//TODO: Does the really need to call a function? Move the event here?
		openButton && drawer
			? this.openDrawer(openButton, drawer)
			: console.error('Error function here');

		form
			? (this.formData = new FormData(form))
			: this.elementError('form', 'new FormData');

		// get parameters back from form
		this.setParameters();

		// Event Builder
		if (form && drawer) {
			this.submitForm(form, drawer);
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
		if (this.groupStartType && this.groupStartTimeStr) {
			let timeString = this.groupStartTimeStr.split(':');
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
			this.numberStarts = this.teamList.length;
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

	openDrawer(button: SlButton, drawer: SlDrawer): void {
		button.addEventListener('click', () => {
			drawer.show();
		});
	}

	setParameters(): void {
		// Get user defaults from settings form
		this.practiceLength = Number(this.practiceLengthVal) as practiceLengthTimes; // Length of each practice session.
		this.pauseLength = Number(this.pauseLengthVal); // Length of pause between sessions

		this.groupStartType = this.startTypeVal as groupStartTypeTypes; // Manual or Scheduled
		if (this.groupStartType == 'scheduled') {
			this.groupStartTime = new Date(this.startTimeVal); // Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
		} else {
			this.groupStartTime = new Date(0);
		}

		console.log(
			`----params setParameters StartType | StartTime: ${this.groupStartType} | ${this.groupStartTime}` //! manual ok
		);
		console.dir(
			`--------then again, getStartTypeVal &amp; getStartTimeVal: ${
				this.startTypeVal
			} & ${this.formData.get('start-time')}`
		); //! ok

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
		//ToDo Should this only run once?
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
					this.setParameters(); //! I think this is right track, but needs to restart timers
					//! Nope, not working
					console.log(this.practiceLength);
					console.log(this.groupStartTime);
					console.log(this.numberTeams);
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
