import ProgressIndicator from '../components/progressIndicator';

// sample data: remove or add a demo switch
import { Parameters } from '../components/parameters';
import { teams } from '../data/sampleData';
import { ComponentController } from './componentController';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

const parameters = new Parameters();

//! numStarts (static vs number of teams) resolved in params and available as `parameters.numStarts`

const sessionStatus = document.querySelector('[data-session-status]'); // Temporary status label at bottom of page --- //! Now it's in ComponentController.ts?

const componentController = new ComponentController(parameters.numStarts);

teams.forEach((team) => {
	//Todo: Really need to make the names associated with this class more alike
	//! PASS parameters.numStarts
	const session = new TeamSession(teams);

	// Timers go here

	/*

end of loop of classes
 */
});

// here: Working out of main-old.ts. Convert vars to new indicator object. Then do timer() function Maybe move to file once it's figured out.

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
