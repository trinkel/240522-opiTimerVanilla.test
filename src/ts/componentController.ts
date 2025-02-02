import { TimeController } from './timeController';

import { timeUnits } from '../utilities/timeUtilities';
import { timeRemaining } from './timeController';

/**
 * Indicators - array of indicator element objects
 *
 * @export
 * @interface Indicators
 * @typedef {Indicators}
 */
export interface Indicators {
	id: 'first-music' | 'second-music' | 'end-session'; // element ID
	element: Element; // progressIndicator custom element
	timeProperty: string; // name of property with time for element (eg firstWarnTime)
	targetKey: string; // key for use with timeController for target time reference
	warnKey: string; // key for use with timeController for warning time reference
	warnSpecKey: string; // key for use with timeController for warning time length
	modeValue: number; // Count up or down //! Don't need it but leave it in for posterity or 'just in case'
	maxValue: number; // Maximum value
	progressValueInit: number; // Initialization value
	progressValue: number; // Current value
	progressComplete: boolean;
	warnState: 'false' | 'pending' | 'true' | 'ending' | 'end';
	warnTime: string;
}
[];

/**
 * @Description Create array of indicators (timers): Get the indicator elements and establish variables for their values. This only has to happen once. (this is not the init)Then inside of loop with class: - Initialize - Run timers
 */
export class ComponentController {
	indicators: Indicators[] = [];

	numberTeams: number = 0;
	progressComplete: boolean = false;
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
					targetKey: '', // key for use with timeController for target time reference
					warnKey: '', // key for use with timeController for warning time reference
					warnSpecKey: '', // key for use with timeController for warning time length
					modeValue: 1, // Count up or down
					// Zero out properties to initialize then initialize in class)
					maxValue: 100, // Maximum value
					progressValueInit: 0, // Initialization value
					progressValue: 0, // Placeholder - reinitialize in first init
					progressComplete: false,
					warnState: 'false',
					warnTime: '0',
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
			// To satisfy TypeScript when used as object property index
			indicator.element.setAttribute('progress', '0');

			indicator.element.setAttribute('data-progress-count', '0:00');

			indicator.element.setAttribute(
				'value-max',
				indicator.maxValue.toString()
			);

			indicator.element.setAttribute('data-progress-state', 'pending');
		});
	}

	setWarnState(indicator: Indicators, state: string, force?: 'force') {
		switch (state) {
			case 'false':
				if (indicator.warnState !== 'false' || force) {
					indicator.element.setAttribute('data-progress-warn-state', 'false');
					indicator.warnState = 'false';
				}
				break;
			//HERE: Pending not right 2nd loop?
			case 'pending':
				if (indicator.warnState !== 'pending') {
					indicator.element.setAttribute('data-progress-warn-state', 'pending');
					indicator.warnState = 'pending';
				}
				break;
			case 'true':
				if (indicator.warnState !== 'true') {
					indicator.element.setAttribute('data-progress-warn-state', 'true');
					indicator.warnState = 'true';
				}
				break;
			case 'ending':
				if (indicator.warnState !== 'ending') {
					indicator.element.setAttribute('data-progress-warn-state', 'ending');
					indicator.warnState = 'ending';
				}
				break;
			case 'end':
				if (indicator.warnState !== 'end') {
					indicator.element.setAttribute('data-progress-warn-state', 'end');
					indicator.warnState = 'end';
				}
				break;
		}
	}

	init(timeController: TimeController): void {
		this.iterator = 0;
		// console.log(`[init] Iteration: ${this.iterator}`);
		const now = timeController.current;

		this.indicators.forEach((indicator) => {
			// Uses the timeProperty as the name of the property holding the max time for the timer.

			if (timeController.duration) {
				// key for use with timeController for target time reference
				indicator.targetKey = `${indicator.timeProperty}Time`;

				// key for use with timeController for warning time reference
				indicator.warnKey = `${indicator.timeProperty.replace(
					/Music|Session/,
					'Warning'
				)}Time`;

				// key for use with timeController for warning time length
				indicator.warnSpecKey = `${indicator.timeProperty.replace(
					/Music|Session/,
					'Warning'
				)}`;

				// String of warning time for the timer in seconds
				indicator.warnTime = `${
					timeController.sessionSpec[`${indicator.warnSpecKey}`] *
					timeUnits.minutes
				}`;

				indicator.maxValue = timeController.remainingTime(
					timeController[indicator.targetKey],
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
					timeController.remainingTime(timeController[indicator.targetKey], now)
						.display
				);

				// set warning badge
				indicator.element.setAttribute(
					'data-progress-warn',
					`${indicator.warnTime}`
				);

				this.setWarnState(indicator, 'false', 'force');

				indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?
			}

			this.before = timeController.current;
		});
	}

	timer(
		timeController: TimeController,
		progressComplete: boolean
	): {
		lastLoop: Date;
		progressComplete: boolean;
	} {
		/**
		 * @Description Get the current time. If `warp` is defined, manipulate time for debug or demo purposes.
		 * @parameters for `warpJump`: current time and previous time.
		 */

		const now =
			timeController.warp === 1
				? timeController.current
				: timeController.warpJump(this.before);

		// initialize progress complete test for each loop
		progressComplete = true;

		// This may be unused
		this.sessionStatus
			? (this.sessionStatus.textContent = this.numberTeams.toString())
			: null; //! Display group number. Do we want it?

		// Run the logic only if the time has changed
		//! Decide if you want this to only run after full second delay as originally written or just let it go.
		// if (now > this.before) {
		if (true) {
			this.indicators.forEach((indicator) => {
				// Manage timer--not using decrement that was developed with the component. We check the time every loop.

				/**
				 * @var currentTarget: timeRemaining
				 * @description Find time remaining to target for each timer. Returns an object of {progressValue:, displayValue:}
				 */
				const currentTarget: timeRemaining = { display: '', progress: 0 };
				Object.assign(
					currentTarget,
					timeController.remainingTime(timeController[indicator.targetKey], now)
				);

				/**
				 * @var currentWarn: timeRemaining
				 * @description Find time remaining to warning for each timer. Returns and object of {progressValue:, displayValue:}
				 */
				const currentWarn: timeRemaining = { display: '', progress: 0 };
				Object.assign(
					currentWarn,
					timeController.remainingTime(timeController[indicator.warnKey], now)
				);

				// if (indicator.targetKey === 'firstMusicTime') {
				// 	console.log(
				// 		`currentTarget: ${indicator.targetKey} | ${
				// 			timeController[indicator.targetKey]
				// 		} | Time Remaining ${currentTarget.display}`
				// 	);
				// 	console.log(
				// 		`Warn: ${indicator.warnKey} | ${
				// 			timeController[indicator.warnKey]
				// 		} | Time Remaining ${currentWarn.display}`
				// 	);
				// }

				//TODO.future: May be able to refactor progressValue and currentTarget.progress together?
				indicator.progressValue = currentTarget.progress;

				if (indicator.modeValue) {
					// Countdown timers

					// Wrangle counter
					indicator.element.setAttribute(
						'progress',
						indicator.progressValue.toString()
					);
					indicator.element.setAttribute(
						'data-progress-count',
						currentTarget.display
					);

					//------------------------------DELETE LINE
					// Wrangle warning badge state
					//! combine with the setWarnState func?
					if (
						currentWarn.progress <= 0 + timeController.pendingWarn &&
						indicator.warnState !== 'pending' &&
						indicator.warnState !== 'true' &&
						indicator.warnState !== 'end'
					) {
						this.setWarnState(indicator, 'pending');
					}

					// Wrangle warning badge on
					if (
						currentWarn.progress <= 0 &&
						indicator.warnState !== 'true' &&
						indicator.warnState !== 'end'
					) {
						this.setWarnState(indicator, 'true');
					}

					// Wrangle warning badge session ending
					if (indicator.id === 'end-session') {
						if (
							currentTarget.progress <= 0 + timeController.pendingEndSession &&
							indicator.warnState !== 'end' &&
							indicator.warnState !== 'ending'
						) {
							this.setWarnState(indicator, 'ending');
						}
					}

					// Wrangle warning badge end timer
					if (currentTarget.progress <= 0 && indicator.warnState !== 'end') {
						this.setWarnState(indicator, 'end');
					}
				} else {
					// Count-up timers (future use)
				}

				if (
					(indicator.element.getAttribute('data-progress-state') as string) !==
					'complete'
				) {
					progressComplete = false;
				}
			});
		}

		// Hold value of current time for next loop
		this.before = now;
		// Reference value (Not used)
		this.iterator++;

		const passBack = {
			lastLoop: this.before,
			progressComplete: progressComplete,
		};

		return passBack;
	}

	//! startTimer() Moved to main.ts

	complete(): void {
		console.log(`[COMPLETE] ---Process Complete: ${this.numberTeams}`);
	}
}

// Referencing Notion: On Loops, Timeouts and Promises
// function writeToLog() = timer
// function writeToLogRepeatedly() = new function
// async function logEveryTwoSecondsForOneMinute() = startTimer
