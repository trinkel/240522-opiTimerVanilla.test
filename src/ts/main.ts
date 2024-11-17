// ProgressIndicator Component
import ProgressIndicator from '../components/progressIndicator';

// Shoelace Components
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

// DateFNS Utility
import { isBefore } from 'date-fns';

// Settings
import { Parameters } from '../components/parameters';

// Layout and Control
import { ClockBadges } from './clockBadges';
import { ComponentController } from './componentController';
import { ControlButtons } from './controlButtons';
import { TimeController } from './timeController';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

// Application settings (includes settings form)
const parameters = new Parameters();

const clockOn: boolean = false; // Flag. Receives click to start timer in manual mode

const timeController = new TimeController(
	parameters.practiceLength,
	parameters.tick,
	parameters.pendingWarn,
	parameters.pendingEndSession,
	parameters.warp,
	parameters.groupStartType,
	parameters.groupStartTime
);

// Instantiate clock badges. Start current time badge
const clockBadges = new ClockBadges(new Date(), timeController.tick);

// Instantiate main control loop
//ToDo:
// Start based on parameters.groupStartTime or a start button
const componentController = new ComponentController();

const controlButtons = new ControlButtons();

// Initialize the timers, wait for start time
// TODO [240813 (soon)] init on app launch (or param set) to set duration in timers. Start timer functions on groupStartTime or start button
componentController.init(timeController);

//! TODO Initial attempt at initializing and then waiting to run timers. Make this prettier. (Not being used, but save for reference)
// Initialize and run the timers

async function waitTimer(): Promise<void> {
	return new Promise<void>(() => {
		const waitTimeIntvId = setInterval(() => {
			console.log('waitTimer');
			const goTimer = (): void => {
				switch (parameters.groupStartType) {
					case 'manual':
						if (clockOn) {
							clearInterval(waitTimeIntvId);
							startPracticeGroup(timeController);
						} else {
							goTimer();
						}
						break;
					case 'scheduled':
						if (isBefore(new Date(), parameters.groupStartTime)) {
							goTimer();
						} else {
							clearInterval(waitTimeIntvId);
							startPracticeGroup(timeController);
						}
						break;
					default:
						goTimer();
				}
			};
			// console.log('timerWait');
			goTimer();
		}, 2000); //parameters.tick
		// ToDo: add a slow tick, maybe 1000?
	});
}

// Start a group of teams
async function startPracticeGroup(timeController: TimeController) {
	try {
		for (let i = 0; i < parameters.numberTeams; i++) {
			console.log(
				`[START PRACTICE GROUP] ---START TEAM NUMBER ${i + 1} out of ${
					parameters.numberTeams
				}---`
			);
			timeController = new TimeController(
				parameters.practiceLength,
				parameters.tick,
				parameters.pendingWarn,
				parameters.pendingEndSession,
				parameters.warp,
				parameters.groupStartType,
				parameters.groupStartTime
			);

			// Initialize new team session
			componentController.init(timeController);
			clockBadges.setClocksStartTime(timeController.groupStartTime);
			clockBadges.setClocksEndTime(timeController.endSession);
			// Run new team session
			await componentController.startTimer(timeController);
		}
	} catch (error) {
		console.log((error as Error).message);
	}

	//! This one will be held back
	console.log(`---End of Async function---`);
}

//! Call waitTimer
waitTimer();

// Call appRunner (Replaces waitTimer)
//!241114
// startPracticeGroup(timeController);

//! This one will not be held back
componentController.complete();

//! OK, so here's the deal
/*
 * Instantiate a new instance of Parameters
 * Instantiate a new instance of ComponentController passing it numberTeams (instead of looping on number of teams?) (see wrangling above. Should that be changing params.numStart rather than a new var?)
 * Instantiate a new instance of TimeController passing it params[sessionLength,groupStartTime(?)]
 *     // Actually, do we need to call this before we have a startTime, or even before startTime arrives?
 *     // groupStartTime is already a Date object
 *     // There has to be a start time. If session hasn't started and it's manual, start is now and duration is 0? Then call with duration on start click?
 *     // constructor needs to be rewritten to do what it's doing, but without the loop.
 */
