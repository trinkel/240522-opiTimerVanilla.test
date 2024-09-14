import ProgressIndicator from '../components/progressIndicator';
// sample data: remove or add a demo switch
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { isBefore } from 'date-fns';
import { Parameters } from '../components/parameters';
import { ComponentController } from './componentController';
import { TimeController } from './timeController';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

const parameters = new Parameters();

// Temporary status label at bottom of page --- //! Now it's in ComponentController.ts?
const sessionStatus = document.querySelector('[data-session-status]');

const timeController = new TimeController(
	parameters.sessionLength,
	parameters.tick,
	parameters.pendingWarn,
	parameters.pendingEndSession,
	parameters.warp
);

// Instantiate main control loop
//ToDo:
// Start based on parameters.groupStartTime or a start button
const componentController = new ComponentController();

// Initialize the timers, wait for start time
// TODO [240813 (soon)] init on app launch (or param set) to set duration in timers. Start timer functions on groupStartTime or start button
componentController.init(timeController);

//! TODO Initial attempt at initializing and then waiting to run timers. Make this prettier. (Not being used, but save for reference)
// Initialize and run the timers
const waitTimer = (): void => {
	if (isBefore(new Date(), parameters.groupStartTime)) {
		console.log('.');
		setTimeout(waitTimer, 2000);
	} else {
		componentController.init(timeController);
	}
};

// Start a group of teams
async function startPracticeGroup(timeController: TimeController) {
	try {
		for (let i = 0; i < parameters.numStarts; i++) {
			console.log(
				`[START PRACTICE GROUP] ---START TEAM NUMBER ${i + 1} out of ${
					parameters.numStarts
				}---`
			);
			timeController = new TimeController(
				parameters.sessionLength,
				parameters.tick,
				parameters.pendingWarn,
				parameters.pendingEndSession,
				parameters.warp
			);
			componentController.init(timeController);
			await componentController.startTimer(timeController);
		}
	} catch (error) {
		console.log((error as Error).message);
	}

	//! This one will be held back
	console.log(`---End of Async function---`);
}

//! Call waitTimer
// waitTimer();

// Call appRunner (Replaces waitTimer)
startPracticeGroup(timeController);

//! This one will not be held back
componentController.complete();

//! OK, so here's the deal
/*
 * Instantiate a new instance of Parameters
 * Instantiate a new instance of ComponentController passing it numStarts (instead of looping on number of teams?) (see wrangling above. Should that be changing params.numStart rather than a new var?)
 * Instantiate a new instance of TimeController passing it params[sessionLength,groupStartTime(?)]
 *     // Actually, do we need to call this before we have a startTime, or even before startTime arrives?
 *     // groupStartTime is already a Date object
 *     // There has to be a start time. If session hasn't started and it's manual, start is now and duration is 0? Then call with duration on start click?
 *     // constructor needs to be rewritten to do what it's doing, but without the loop.
 */
