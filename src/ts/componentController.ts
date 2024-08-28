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

/**
 * @Description Create array of indicators (timers): Get the indicator elements and establish variables for their values. This only has to happen once. (this is not the init)Then inside of loop with class: - Initialize - Run timers
 */
export class ComponentController {
	indicators: Indicators[] = [];
	sessionStatus = document.querySelector('[data-session-status'); // Temporary status label at bottom of page
	numStarts: number = 0;
	progressComplete: boolean = true;
	before: Date = new Date();
	iterator: number = 0;

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
					maxValue: 100, // Maximum value
					progressValueInit: 0, // Initialization value
					progressValue: 0, // Placeholder - reinitialize in first init
					progressComplete: false,
				});
			}
		});

		this.flatline();
	}

	/**
	 * Draws all indicators in their initial state (zeroed out).
	 */
	flatline(): void {
		this.indicators.forEach((indicator) => {
			// don't need this?:

			indicator.element.setAttribute('progress', '0');

			indicator.element.setAttribute('data-progress-count', '0:00');

			indicator.element.setAttribute(
				'value-max',
				indicator.maxValue.toString()
			);

			indicator.element.setAttribute('data-progress-state', 'pending');

			console.log(`ZERO: ${indicator.element.getAttribute('progress')}`);
		});
	}

	//TODO [240812 Start integrating practice time data]
	//TODO  if teamMode=list: get duration/start-time from date else if teamMode=anonymous: get duration/start-time from parameters (all duration will be the same, start-time will be from form or from button)
	//TODO  Need to change getting duration from element to getting duration of each timer from data or parameters. Should be able to use element name ("indicator") from loop.
	//TODO  Routine to route element name to data name (first-warn to firstWarn) is above
	//TODO [DO THIS FIRST]  So, in each indicator below, we need to test for data. If it's there, setAttribute to data, otherwise set it to value-max (which we have now). Or do we eliminate the fallback on the element?

	init(timeController: TimeController): void {
		this.iterator = 0;

		//! Was a numStarts routine which is moving to main.ts
		// this.numStarts = numStarts;
		// if (this.numStarts <= 0) {
		// 	this.sessionStatus
		// 		? (this.sessionStatus.textContent = 'Group completed')
		// 		: null;
		// 	return;
		// }
		this.indicators.forEach((indicator) => {
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
				console.log(`Team End Time: ${timeController.endTime}`);

				/* 	 				`${indicator.element.id} | ${timeController.duration} | ${
						indicator.timeProperty
					} | ${timeController[key]} | ${
						timeController.remainingTime(timeController[key]).display
					} | ${timeController.remainingTime(timeController[key]).progress}`
 */
				indicator.maxValue = timeController.remainingTime(
					timeController[key]
				).progress;

				// Set the value-max attribute
				indicator.element.setAttribute(
					'value-max',
					indicator.maxValue.toString()
				);

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

				console.log(`CURRENT TEST: ${indicator.progressValue.toString()}`);

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
	}

	timer(timeController: TimeController): void {
		// Get the current
		const now = timeController.current;

		// initialize progress complete test for each loop
		//! Use the status attribute?
		this.progressComplete = true;

		// This may be unused
		this.sessionStatus
			? (this.sessionStatus.textContent = this.numStarts.toString())
			: null; //! Display group number. Do we want it?

		// Run the logic only if the time has changed
		if (now > this.before) {
			console.log(`${now}---RUN TIMER LOOP ${this.iterator}---${this.before}`);

			this.indicators.forEach((indicator) => {
				// Manage timer--not using decrement that was developed with the component. We check the time every loop.

				/**
				 * @var target
				 * @description To satisfy TypeScript when used as object property index.
				 * @example #first-music becomes firstMusicTime
				 * @use timeController[target]
				 *      points at timeController->get firstMusic(): Date
				 */
				const target = `${indicator.timeProperty}Time`;

				/**
				 * @var warn
				 * @description To satisfy TypeScript when used as object property index. Gets the warning time for the current indicator.
				 * @example #first-music becomes firstWarnTime
				 * @use timeController[warn]
				 *      points at timeController->get firstWarn(): Date
				 */
				const warn = `${indicator.timeProperty.replace(
					/Music|Session/,
					'Warn'
				)}Time`;

				/**
				 * @var currentTarget
				 * @description Find time remaining to target for each timer. Returns an object of {progressValue:, displayValue:}
				 */
				const currentTarget = timeController.remainingTime(
					timeController[target],
					now
				);
				console.log(
					`--RUNNING Target [1] ${indicator.timeProperty}[${target}]:`
				);
				console.dir(currentTarget);

				/**
				 * @var currentWarn
				 * @description Find time remaining to warning for each timer. Returns and object of {progressValue:, displayValue:}
				 */
				const currentWarn = timeController.remainingTime(
					timeController[warn],
					now
				);

				//TODO.future: May be able to refactor progressValue and currentTarget.progress together?
				indicator.progressValue = currentTarget.progress;

				// Debugging
				console.log(`--RUNNING Warn ${indicator.timeProperty}:[${warn}]`);
				console.dir(currentWarn);

				console.log(`--RUNNING Target ${indicator.timeProperty}:[${target}]`);
				console.dir(currentTarget);
				// End Debugging

				if (indicator.modeValue) {
					// Countdown timers
					console.log(
						`[278] progressValue [${target}]: ${indicator.progressValue.toString()}`
					);
					indicator.element.setAttribute(
						'progress',
						indicator.progressValue.toString()
					);
					indicator.element.setAttribute(
						'data-progress-count',
						currentTarget.display
					);
				} else {
					// Count-up timers (future use)
				}

				if (
					(indicator.element.getAttribute('data-progress-state') as string) !==
					'complete'
				) {
					this.progressComplete = false;
				}

				console.log(
					`[294] data-progress-state [${target}]: ${indicator.element.getAttribute(
						'data-progress-state'
					)}`
				);
			});
		}

		// Hold value of current time for next loop
		this.before = now;
		// Reference value
		this.iterator++;

	startTimer(timeController: TimeController) {
		return new Promise<void>((resolve, reject) => {
			this.progressComplete = true;
			const intervalId = setInterval(() => {
				this.timer(timeController);
				if (this.progressComplete) {
					clearInterval(intervalId);
					resolve();
				}
			}, 2000);
		});
	}

	complete(): void {
		console.log(`---Process Complete: ${this.numStarts}`);
	}

}
