import { format } from 'date-fns'; // just used for debugging for now
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
	progressComplete: boolean = false;
	before: Date = new Date();
	iterator: number = 0;

	deleteCurrent = document.getElementById('current-time') as HTMLElement;
	deleteBefore = document.getElementById('start-time') as HTMLElement;

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
		this.deleteCurrent.textContent = '';
		this.deleteBefore.textContent = '';
		this.indicators.forEach((indicator) => {
			// don't need this?:

			indicator.element.setAttribute('progress', '0');

			indicator.element.setAttribute('data-progress-count', '0:00');

			indicator.element.setAttribute(
				'value-max',
				indicator.maxValue.toString()
			);

			indicator.element.setAttribute('data-progress-state', 'pending');
		});
	}

	init(timeController: TimeController): void {
		this.iterator = 0;
		const now = timeController.current;

		this.indicators.forEach((indicator) => {
			// Uses the timeProperty as the name of the property holding the max time for the timer.

			if (timeController.duration) {
				// To satisfy TypeScript when used as object property index
				const key = `${indicator.timeProperty}Time`;

				indicator.maxValue = timeController.remainingTime(
					timeController[key],
					now
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

				// Set progress attribute of timer
				indicator.element.setAttribute(
					'progress',
					indicator.progressValue.toString()
				);

				indicator.element.setAttribute(
					'data-progress-count',
					timeController.remainingTime(timeController[key], now).display
				);

				indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?

				console.log(
					`[INIT] CURRENT TEST: ${indicator.progressValue.toString()}`
				);
			}
		});
	}

	timer(timeController: TimeController): void {
		/**
		 * @Description Get the current time. If `warp` is defined, manipulate time for debug or demo purposes.
		 * @parameters for `warpJump`: current time and previous time.
		 */

		const now =
			timeController.warp === 1
				? timeController.current
				: timeController.warpJump(this.before);

		// DELETE
		this.deleteCurrent.textContent = format(now, 'h:mm:ss');
		this.deleteBefore.textContent = format(this.before, 'h:mm:ss');

		// initialize progress complete test for each loop
		this.progressComplete = true;

		// This may be unused
		this.sessionStatus
			? (this.sessionStatus.textContent = this.numStarts.toString())
			: null; //! Display group number. Do we want it?

		// Run the logic only if the time has changed
		//! Decide if you want this to only run after full second delay as originally written or just let it go.
		// if (now > this.before) {
		if (true) {
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

				if (indicator.modeValue) {
					// Countdown timers
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
			});
		}

		// Hold value of current time for next loop
		this.before = now;
		// Reference value
		this.iterator++;
	}

	startTimer(timeController: TimeController) {
		return new Promise<void>((resolve, reject) => {
			const intervalId = setInterval(() => {
				this.timer(timeController);
				if (this.progressComplete) {
					clearInterval(intervalId);
					resolve();
				}
			}, timeController.tick);
		});
	}

	complete(): void {
		console.log(`[COMPLETE] ---Process Complete: ${this.numStarts}`);
	}
}

// Referencing Notion: On Loops, Timeouts and Promises
// function writeToLog() = timer
// function writeToLogRepeatedly() = new function
// async function logEveryTwoSecondsForOneMinute() = startTimer
