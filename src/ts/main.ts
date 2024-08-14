import ProgressIndicator from '../components/progressIndicator';

// sample data: remove or add a demo switch
import { Parameters } from '../components/parameters';
import { ComponentController } from './componentController';
import { TimeController } from './timeController';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

const parameters = new Parameters();

const sessionStatus = document.querySelector('[data-session-status]'); // Temporary status label at bottom of page --- //! Now it's in ComponentController.ts?

//TODO: [240716]: •Figure out loop •Figure out how `groupStartTime` works
//TODO: I think this is where the loop goes
const timeController = new TimeController(parameters.sessionLength);

const componentController = new ComponentController();

// Initialize the timers, wait for start time
// TODO [240813 (soon)] init on app launch (or param set) to set duration in timers. Start timer functions on groupStartTime or start button
componentController.init(timeController, false);

//! TODO Initial attempt at initializing and then waiting to run timers. Make this prettier.
// Initialize and run the timers
const waitTimer = (): void => {
	if (isBefore(new Date(), parameters.groupStartTime)) {
		console.log('.');
		setTimeout(waitTimer, 2000);
	} else {
		componentController.init(timeController);
	}
};

waitTimer();

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
