import { TimeController } from './timeController';

export interface Indicators {
	id: string; // element ID
	element: Element; // progressIndicator custom element
	timeProperty: string; // name of property with time for element (eg firstWarnTime)
	modeValue: number; // Count up or down //! Don't need it but leave it in for posterity or 'just in case'
	maxValue: number; // Maximum value
	progressValueInit: number; // Initialization value
	progressValue: number; // Current value
	progressComplete: boolean;
}
[];

// Create array of indicators (timers): Get the indicator elements and establish variables for their values. This only has to happen once. (this is not the init)
// Then inside of loop with class:
// Initialize
// Run timers

export class ComponentController {
	indicators: Indicators[] = [];
	sessionStatus = document.querySelector('[data-session-status'); // Temporary status label at bottom of page
	numStarts: number = 0;
	progressComplete: boolean = true;
	constructor() {
		// also declares the variable (see https://www.digitalocean.com/community/tutorials/how-to-use-classes-in-typescript#adding-class-properties)
		const indicatorIds = ['first-music', 'second-music', 'end-session'];
		indicatorIds.forEach((id) => {
			const dashIdx = id.indexOf('-');
			const indicatorElement = document.querySelector(`#${id}`);
			if (indicatorElement) {
				this.indicators.push({
					id: id,
					element: indicatorElement,
					timeProperty: `${id.substring(0, dashIdx)}${id
						.charAt(dashIdx + 1)
						.toUpperCase()}${id.substring(dashIdx + 2)}`, // used to access times from class such as firstMusicTime
					modeValue: 1, // Count up or down
					// Zero out properties to initialize then initialize in class)
					maxValue: 0, // Maximum value
					progressValueInit: 0, // Initialization value
					progressValue: 0, // Placeholder - reinitialize in first init
					progressComplete: false,
				});
			}
		});
	}

	//TODO [240812 Start integrating practice time data]
	//TODO  if teamMode=list: get duration/start-time from date else if teamMode=anonymous: get duration/start-time from parameters (all duration will be the same, start-time will be from form or from button)
	//TODO  Need to change getting duration from element to getting duration of each timer from data or parameters. Should be able to use element name ("indicator") from loop.
	//TODO  Routine to route element name to data name (first-warn to firstWarn) is above
	//TODO [DO THIS FIRST]  So, in each indicator below, we need to test for data. If it's there, setAttribute to data, otherwise set it to value-max (which we have now). Or do we eliminate the fallback on the element?

	init(timeController: TimeController, run: boolean = true): void {
		//! Was a numStarts routine which is moving to main.ts
		// this.numStarts = numStarts;
		// if (this.numStarts <= 0) {
		// 	this.sessionStatus
		// 		? (this.sessionStatus.textContent = 'Group completed')
		// 		: null;
		// 	return;
		// }
		this.indicators.forEach((indicator) => {
			indicator.progressComplete = false; // Indicates progress complete (starts as false)
			// This will use the timeProperty as the name of the property holding the max time for the timer.
			// Set timer start value:
			//  Countdown = max value
			//  Count-up = 0

			// HERE: [240812] Replace console.log with time string for timer the keep filling this component with input from timeController. Remove outer loop (numStarts)  and move to init call in main.ts. See note at bottom of main.ts file
			// TODO: [240813] See note in timeController for getters. (Afternoon:) The function seems to work for the console.log now. Apply to the element.
			// TODO: [240813] NEXT: Assign times to timers and compare to console.logs
			// TODO: [240813] THINK: Maybe we just need to add one second for the init round instead of futzing in timeRemaining method to hack the way the date function is rounding down one second to at the start?
			if (timeController.duration) {
				// To satisfy TypeScript when used as object property index
				const key = `${indicator.timeProperty}Time`;

				// now (Not used in init)
				console.log(`Team Start Time: ${timeController.startTime}`);

				// Timer target date/time
				console.log(
					`Element ${indicator.element.id} target date/time: ${timeController[key]}`
				);

				// Timer timeRemaining (display)
				console.log(
					`Element ${indicator.element.id} timeRemaining (display): ${
						timeController.remainingTime(timeController[key]).display
					}`
				);
				// timer timeRemaining (progress)
				console.log(
					`Element ${indicator.element.id} timeRemaining (progress): ${
						timeController.remainingTime(timeController[key]).progress
					}`
				);

				// end
				console.log(`Team Stop Time: ${timeController.stopTime}`);

				/* 	 				`${indicator.element.id} | ${timeController.duration} | ${
						indicator.timeProperty
					} | ${timeController[key]} | ${
						timeController.remainingTime(timeController[key]).display
					} | ${timeController.remainingTime(timeController[key]).progress}`
 */
				indicator.maxValue = timeController.remainingTime(
					timeController[key]
				).progress;

				// Pick initial progressValue based on timer mode (count up or down)
				indicator.progressValueInit = indicator.modeValue
					? indicator.maxValue
					: 0;

				// Set initial progress value as current progress value (for start)
				indicator.progressValue = indicator.progressValueInit;
				//! need an indicator.someThing (indicator.textValue) here for time text

				// Set progress attribute of timer
				//HERE [240814] Fix this to set timeRemaining text. (I think the timers are working right, but the visuals aren't reflecting the status. Be sure ARIA is updated too.)
				//! [240814 Last thing] When this attribute changes, progressIndicator component sets bar and text. We will need to split this into two elements
				//! [FUTURE REFERENCE] The clock can work the same way assigning the same attribute. (Clock change: newTime > oldTime ? update : don't; so it doesn't flash with same number)
				indicator.element.setAttribute(
					'progress',
					indicator.progressValue.toString()
				);

				indicator.element.setAttribute(
					'data-progress-count',
					timeController.remainingTime(timeController[key]).display
				);

				indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?

				console.log(`CURRENT TEST: ${indicator.maxValue}`);

				//! We may not need this. Control passed to timeController
				/* 				indicator.progressValueInit = indicator.modeValue
					? indicator.maxValue
					: 0;
				indicator.maxValue = Number(
					indicator.element.getAttribute('value-max')
				);

				indicator.progressValueInit = indicator.modeValue
					? indicator.maxValue
					: 0;

				indicator.progressValue = indicator.progressValueInit;

				indicator.element.setAttribute(
					'progress',
					indicator.progressValue.toString()
				);
				indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?
 */
			}
		});

		run ? this.timer() : null;
	}

	timer(): void {
		this.progressComplete = true; // initialize progress complete test for each loop
		this.sessionStatus
			? (this.sessionStatus.textContent = this.numStarts.toString())
			: null; //! Display group number. Do we want it?
		this.indicators.forEach((indicator) => {
			if (indicator.modeValue) {
				if (indicator.progressValue > 0) {
					indicator.progressValue -= 1; //todo: Figure out what this needs to be for percent, seconds or whatever we're using
					if (indicator.progressValue > 0) {
						this.progressComplete = false;
					} else {
						indicator.progressValue = 0;
						indicator.progressComplete = true;
					}

					indicator.element.setAttribute(
						'progress',
						indicator.progressValue.toString()
					);
				}
			} else {
				if (indicator.progressValue < Number(indicator.maxValue)) {
					indicator.progressValue += 1;
					if (indicator.progressValue < Number(indicator.maxValue)) {
						this.progressComplete = false;
					} else {
						indicator.progressValue = Number(indicator.maxValue);
						indicator.progressComplete = true;
					}

					indicator.element.setAttribute(
						'progress',
						indicator.progressValue.toString()
					);
				}
			}
		});

		if (!this.progressComplete) {
			if (this.numStarts > 0) {
				setTimeout(() => this.timer(), 200);
			}
		} else {
			this.numStarts--;
			if (this.numStarts > 0) {
				this.init(this.numStarts);
			} else {
				console.log(`---Process Complete: ${this.numStarts}`);
				this.sessionStatus
					? (this.sessionStatus.textContent = 'Group completed')
					: null;
			}
		}
	}

	complete(): void {
		console.log(`---Process Complete: ${this.numStarts}`);
	}

}
