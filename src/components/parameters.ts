import {
	SlButton,
	SlDrawer,
	SlInput,
	SlRadioGroup,
	SlTextarea,
} from '@shoelace-style/shoelace';

import { settingsForm } from '../components/settingsForm';
import { appConfig } from '../data/appConfig';
// import { ControlButtons } from '../ts/controlButtons';
import {
	ButtonKey,
	ClickedButton,
	controlBlockButtons,
	handleControlBlockClick,
} from '../ts/controlButtons';
import { elementError } from '../utilities/elementError';
import { futureDate } from '../utilities/timeUtilities';

export type operationModes = 'anonymous' | 'list';
export type practiceLengthTimes = 1 | 2 | 6 | 7 | 8 | 10 | 11 | 12;
export type warpFactors = 1 | 2 | 6 | 7 | 8;
export type groupStartTypeTypes = 'scheduled' | 'manual' | 'dbugg';
export type pauseBetweenSelectorTypes = 'yes' | 'no';

export interface FormControls {
	form: HTMLFormElement | null;
	startType: SlRadioGroup | null;
	pauseSelector: SlRadioGroup | null;
	pauseInput: SlInput | null;
	operationModeSelector: SlRadioGroup | null;
	numberInput: SlInput | null;
	teamsInput: SlTextarea | null;
}

/**
 * Parameters: Application settings.
 * Application defaults are defined at the top of the class definition
 *
 * @export
 * @class Parameters
 * @typedef {Parameters}
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
 * @prop {boolean} clocksSet True when start and end clocks set by setClocks()
 * @prop {boolean} scheduleSet True when schedule defined or manual button clicked
 * @prop {number} pendingWarn Time before warning-time to flash badge "pending" in milliseconds
 * @prop {number} pendingEndSession Time before end-session to display "leave the ice" badge in milliseconds
 */
export class Parameters {
	/*
	 * ---------------------------
	 * Set application defaults here
	 * ---------------------------
	 * User editable settings
	 */
	practiceLength = appConfig.practiceLength; // Length of each practice session
	pauseBetweenSelector = appConfig.pauseBetweenSelector;
	pauseLength = appConfig.pauseLength; // Length of pause between sessions
	groupStartType = appConfig.groupStartType;
	groupStartTime = appConfig.groupStartTime;

	// Create string from `groupStartTime: Date`
	groupStartTimeStr = appConfig.groupStartTimeStr();

	operationMode = appConfig.operationMode; // anonymous | list
	teamList = appConfig.teamList;
	numberTeams = appConfig.numberTeams;

	/*
	 * Application passthrough settings  */
	dBugg = appConfig.dBugg;
	demo = appConfig.demo; // Allows for some demo parameters. Mostly to speed things up
	warp = appConfig.warp; // Speed factor for demos (1-8)
	tick = appConfig.tick; // Component timeout interval in milliseconds (200)
	idle = appConfig.idle; // True when session is not running
	clocksSet = appConfig.clocksSet; // True when start and end clocks set by setClocks()
	scheduleSet = appConfig.scheduleSet; // True when schedule defined or manual button clicked
	pendingWarn = appConfig.pendingWarn; // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession = appConfig.pendingEndSession; // Time before end-session to display "leave the ice" badge in milliseconds (15000)
	/*
	 * ---------------------------
	 * End application defaults
	 * ---------------------------
	 */

	// Declare formControls object
	formControls: FormControls;

	// Reserve FormData object
	formData: FormData = new FormData();

	constructor() {
		console.log(`appD GST: ${this.groupStartTime}`); //! Correct

		// const appSettings = new SettingsForm(
		// 	this.groupStartType,
		// 	this.groupStartTimeStr,
		// 	this.practiceLength,
		// 	this.pauseBetweenSelector,
		// 	this.pauseLength,
		// 	this.operationMode,
		// 	this.numberTeams,
		// 	this.teamList,
		// 	this.demo
		// );

		// Build settings form
		settingsForm(
			this.groupStartType,
			this.groupStartTimeStr,
			this.practiceLength,
			this.pauseBetweenSelector,
			this.pauseLength,
			this.operationMode,
			this.numberTeams,
			this.teamList,
			this.demo
		);

		// Connect settings drawer controls
		const openButton = document.querySelector<SlButton>('#settings-btn');
		const drawer = document.querySelector<SlDrawer>('#settings');

		/*
		 * ---------------------------
		 * Form elements
		 * ---------------------------
		 */

		// Connect form controls
		this.formControls = {
			form: document.querySelector<HTMLFormElement>('form'),
			startType: document.querySelector<SlRadioGroup>('#start-type'),
			pauseSelector: document.querySelector<SlRadioGroup>(
				'#pause-between-selector'
			),
			pauseInput: document.querySelector<SlInput>('#pause-length'),
			operationModeSelector: document.querySelector<SlRadioGroup>(
				'#operation-mode-selector'
			),
			numberInput: document.querySelector<SlInput>('#number-teams'),
			teamsInput: document.querySelector<SlTextarea>('#team-list'),
		};

		//TODO: Does the really need to call a function? Move the event here?
		openButton && drawer
			? this.openDrawer(openButton, drawer)
			: console.error('Error function here');

		// form
		// 	? (this.formData = new FormData(form))
		// 	: elementError('form', 'new FormData');
		//! setParameters(form) was here

		// Connect Settings Form
		// get parameters back from form
		if (this.formControls.form && drawer) {
			//// this.setParameters(this.formControls.form);
			this.formSubmitAction(this.formControls.form, drawer);
		} else {
			!this.formControls.form ? elementError('form', 'eventBuilder') : null;
			!drawer ? elementError('drawer', 'eventBuilder') : null;
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

		//! Do I need this if section
		// Set group start time
		// if (this.groupStartType && this.groupStartTimeStr) {
		// 	let timeString = this.groupStartTimeStr.split(':');
		// 	if (timeString.length === 2) {
		// 		timeString.push('00');
		// 	}
		// 	if (this.pm && Number(timeString[0]) <= 12) {
		// 		timeString[0] = Number((timeString[0] += 12)).toString();
		// 	}
		// 	this.groupStartTime.setHours(Number(timeString[0]));
		// 	this.groupStartTime.setMinutes(Number(timeString[1]));
		// 	this.groupStartTime.setSeconds(Number(timeString[2]));
		// }
		//! --------------------------

		if (this.operationMode === 'list' && this.teamList) {
			this.numberTeams = this.teamList.length;
		}

		// Initialize control buttons
		// controlBlockButtons defined in controlButtons.ts;
		// Add eventListener to controlBlock
		// Callback is sessionState()
		//   argument is the return of controlButtons.handleControlBlockClick()
		//     which determines button clicked and handles visual changes
		//     and returns the button clicked
		//   button clicked it passed to sessionState() which controls
		//     running state of timers

		if (controlBlockButtons.controlBlock.element) {
			controlBlockButtons.controlBlock.element.addEventListener(
				'click',
				(event: Event) => {
					this.sessionState(handleControlBlockClick(event));
				}
			);
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
	openDrawer(button: SlButton, drawer: SlDrawer): void {
		button.addEventListener('click', () => {
			drawer.show();
		});
	}

	setParameters(form: HTMLFormElement): void {
		console.dir(`[FORM]: `);
		console.dir(form);
		form
			? (this.formData = new FormData(form))
			: elementError('form', 'new FormData');

		// Get user defaults from settings form
		this.practiceLength = Number(this.practiceLengthVal) as practiceLengthTimes; // Length of each practice session.
		this.pauseLength = Number(this.pauseLengthVal); // Length of pause between sessions

		this.groupStartType = this.startTypeVal as groupStartTypeTypes; // Manual or Scheduled
		// Time group starts if StartTime:Scheduled is selected. Text converted to `Date` for object later
		if (this.groupStartType == 'scheduled') {
			const time = this.startTimeVal.split(':').map((x) => Number(x));
			if (time.length === 3) {
				this.groupStartTime = new Date(
					new Date().setHours(time[0], time[1], time[2])
				);
			} else {
				this.groupStartTime = new Date(
					new Date().setHours(time[0], time[1], 0)
				);
			}
			// If time (date) is before current time add one day
			this.groupStartTime = futureDate(this.groupStartTime);
		} else {
			this.groupStartTime = new Date(0);
		}

		// this.groupStartTime = new Date(0);

		console.log(
			`----params setParameters StartType: ${this.groupStartType} | StartTime: ${this.groupStartTime}` //! manual ok
		);
		console.dir(
			`----then again, getStartTypeVal ${
				this.startTypeVal
			} | getStartTimeVal: ${this.formData.get('start-time')}`
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
	}

	formSubmitAction(form: HTMLFormElement, drawer: SlDrawer) {
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
					this.setParameters(form);
					this.scheduleSet = true;
					console.log(`[then] practiceLength: ${this.practiceLength}`);
					console.log(`[then] groupStartTime: ${this.groupStartTime}`);
					console.log(`[then] numberTeams: ${this.numberTeams}`);
					if (drawer) {
						drawer.hide();
					} else {
						elementError('drawer', 'form addEventListener');
					}
				});
			})
			.catch((error) => {
				console.error(`Promise.all Error: ${error.message}`);
			});
	}

	// State actions from controlButtons

	//ToDo: Make types limit values or currentButton.state correctly and show list in tooltip
	sessionState<T extends ButtonKey>(clickedButton: ClickedButton<T>): void {
		switch (clickedButton.target) {
			case 'current-start':
				if (clickedButton.state === 'paused') {
					this.groupStartType = 'manual';
					this.formControls.startType
						? this.formControls.startType.setAttribute('value', 'manual')
						: elementError('startType', 'controlButtons: currentStart');
					this.groupStartTime = new Date();
					this.scheduleSet = true;
					this.idle = false;
				} else {
					console.log(`[parameters.ts] Pause button clicked`);
					this.groupStartType = 'manual';
					this.formControls.startType
						? this.formControls.startType.setAttribute('value', 'manual')
						: elementError('startType', 'controlButtons: currentStart');
					// this.groupStartTime = new Date(); // move to nullDate?
					this.scheduleSet = false; // move to nullDate?
					this.idle = true;
				}
		}
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
