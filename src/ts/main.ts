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
import { isBefore, isThisSecond } from 'date-fns';

// Settings
import { Parameters } from '../components/parameters';

// Layout and Control
import { ClockBadges } from './clockBadges';
import { ComponentController } from './componentController';
import { TimeController } from './timeController';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

// Application settings (includes settings form)
const parameters = new Parameters();

const clockOn: boolean = false; //! Flag. Change to parameters.idle? Receives click to start timer in manual mode

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

// Set group start and stop clocks
const setClocks = () => {
	const timeController = new TimeController(
		parameters.practiceLength,
		parameters.tick,
		parameters.pendingWarn,
		parameters.pendingEndSession,
		parameters.warp,
		parameters.groupStartType,
		parameters.groupStartTime
	);
	console.log(
		`[waitTimer] parameters.groupStartTime: ${parameters.groupStartTime}`
	);

	console.log(
		`[waitTimer] timeController.groupStartTime: ${timeController.groupStartTime}`
	);
	clockBadges.setClocksStartTime(timeController.groupStartTime);
	clockBadges.setClocksEndTime(timeController.endSession);
	parameters.clocksSet = true;
};

// Instantiate main control loop
//ToDo:
// Start based on parameters.groupStartTime or a start button
const componentController = new ComponentController();

// ! Delete
// const controlButtons = new ControlButtons();

// Initialize the timers, wait for start time
// TODO [240813 (soon)] init on app launch (or param set) to set duration in timers. Start timer functions on groupStartTime or start button
componentController.init(timeController);

//! TODO Initial attempt at initializing and then waiting to run timers. Make this prettier. (Not being used, but save for reference)
// Initialize and run the timers

async function waitTimer(): Promise<void> {
	return new Promise<void>(() => {
		const waitTimeIntvId = setInterval(() => {
			parameters.scheduleSet
				? console.log('waitTimer: pending')
				: console.log('waitTimer: hold');
			console.log(`[waitTimer] start time: ${parameters.groupStartTime}`);

			const goTimer = (): void => {
				switch (parameters.groupStartType) {
					case 'manual':
						if (!parameters.scheduleSet) {
							break;
						} else {
							setClocks();
							clearInterval(waitTimeIntvId);
							startPracticeGroup(timeController);
							// Start the stuff
						}
						break;
					case 'scheduled':
						if (!parameters.scheduleSet) {
							break;
						}

						if (parameters.groupStartTime && !parameters.clocksSet) {
							setClocks();
							//! Need an error handler for if no groupStartTime. Otherwise, don't bother checking for it.
						}

						if (!isBefore(new Date(), parameters.groupStartTime)) {
							clearInterval(waitTimeIntvId);
							startPracticeGroup(timeController);
						}
						break;
					default:
						clearInterval(waitTimeIntvId);
						startPracticeGroup(timeController);
				}
			};
			// console.log('timerWait');
			goTimer();
		}, 1000); //parameters.tick
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
				i ? timeController.endSessionTime : parameters.groupStartTime
				// parameters.groupStartTime
				//! 241121  Not passing a parameter here relies on new Date() in time controller to set the next start time. That may not be all that accurate. At least once we were off by a second for the startTime. Could have been caused by the slower tick? Maybe what we need to do is reset individual properties rather than re-instantiate. Maybe just run the constructor (or it's functions) again. Or endTime becomes startTime and figure new endTime. Would be a good place to insert new session lengths.
			);

			// Initialize new team session
			componentController.init(timeController);
			clockBadges.setClocksStartTime(timeController.teamStartTime);
			clockBadges.setClocksEndTime(timeController.endSession);
			// Run new team session
			await startTimer(timeController);
		}
	} catch (error) {
		console.log((error as Error).message);
	}

	//! This one will be held back
	console.log(`---End of Async function---`);
}

function startTimer(timeController: TimeController) {
	return new Promise<void>((resolve, reject) => {
		let lastLoop: Date = timeController.current;
		const startTimeIntvId = setInterval(() => {
			console.log(`global idle: ${parameters.idle}`);
			if (parameters.idle) {
				const now: Date = timeController.current;
				console.log(`${lastLoop.getTime()} | ${now.getTime()}`);
				if (isBefore(lastLoop, now) && !isThisSecond(lastLoop)) {
					lastLoop = pauseTimer(timeController, lastLoop);
				}
			} else {
				lastLoop = componentController.timer(
					timeController,
					parameters.progressComplete //! Not needed (when did we add)?
				);
			}

			// Here 241004: Something to set state of active indicator goes here. Switch that falls through to set a data-state attribute?
			if (parameters.progressComplete) {
				clearInterval(startTimeIntvId);
				resolve();
			}
		}, timeController.tick);
	});
}

// pause Timer
function pauseTimer(timeController: TimeController, lastLoop: Date) {
	console.log(`[pauseTimer]`);
	timeController.extendSession = timeController.endSessionTime;
	console.log(`endSessionTime: ${timeController.endSessionTime}`);
	clockBadges.setClocksEndTime(timeController.endSessionTime);
	console.log(`endSessionTime: ${timeController.endSessionTime}`);
	return timeController.current;
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
