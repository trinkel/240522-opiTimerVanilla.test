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
const timeController = new TimeController(
	parameters.sessionLength,
	parameters.groupStartTime
);

const componentController = new ComponentController(parameters.numStarts);

for (var i = 0; i < parameters.numStarts; i++) {
	// Initial the timers
	componentController.init();

	// Run the timers
	componentController.timer();
}

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
