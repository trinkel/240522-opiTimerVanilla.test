import ProgressIndicator from '../src/components/progressIndicator';
import teamSession from '../src/ts/team';

export * from '../src/components/progressIndicator';
export default ProgressIndicator;

console.dir(teamSession);
interface IndicatorStatus {
	modeValue: number; // Count up or down
	maxValue: number; // Maximum value
	progressValueInit: number; // Initialization value
	progressValue: number; // Current value
}

// Get the indicator elements and establish variables for their values
const indicators = document.querySelectorAll('progress-indicator');
const sessionStatus = document.querySelector('[data-session-status]'); // Temporary status label at bottom of page

const indicatorStatus: IndicatorStatus[] = []; // means "array of IndicatorStatus"
const progressComplete: boolean[] = []; // means "array of booleans"
indicators.forEach((indicator, i) => {
	indicatorStatus[i] = {
		modeValue: Number(indicator.getAttribute('mode')), // Get modes: 1 = Countdown | 0 = Count up
		maxValue: Number(indicator.getAttribute('value-max')), // Set maximum value for each indicator in variable
		get progressValueInit() {
			return this.modeValue ? this.maxValue : 0;
		},
		progressValue: 0, // initialize progressValue - reinitialized in init()
	};
});

let rounds = 5; // placeholder for number of rounds for timer repeat

// initialize progress values for indicators
init();

function init() {
	if (rounds <= 0) {
		sessionStatus
			? (sessionStatus.textContent =
					'Group completed' + teamSession.remainingTime)
			: null;
		return;
	}
	console.log(`initializing: ${rounds}`);
	// <Refactor>
	indicators.forEach((indicator, i) => {
		progressComplete[i] = false;
		indicatorStatus[i].progressValue = indicatorStatus[i].progressValueInit; // Indicates progress complete (starts as false)
		indicator.setAttribute(
			'progress',
			indicatorStatus[i].progressValue.toString()
		);
		indicator.setAttribute('data-progress-state', 'pending'); //! Temporary just to try getting at the svg in component. It works. Use or replace.
		// /<Refactor>
	});

	// run timers for a team
	timer();
}

function timer() {
	sessionStatus ? (sessionStatus.textContent = rounds.toString()) : null; // Remove this indicator or make more better resolution display
	indicators.forEach((indicator, i) => {
		if (indicatorStatus[i].modeValue) {
			if (indicatorStatus[i].progressValue > 0) {
				indicatorStatus[i].progressValue -= 10;
				if (indicatorStatus[i].progressValue <= 0) {
					indicatorStatus[i].progressValue = 0;
					progressComplete[i] = true;
				}

				indicator.setAttribute(
					'progress',
					indicatorStatus[i].progressValue.toString()
				);
			}
		} else {
			if (
				indicatorStatus[i].progressValue < Number(indicatorStatus[i].maxValue)
			) {
				indicatorStatus[i].progressValue += 10;
				if (
					indicatorStatus[i].progressValue >=
					Number(indicatorStatus[i].maxValue)
				) {
					indicatorStatus[i].progressValue = Number(
						indicatorStatus[i].maxValue
					);
					progressComplete[i] = true;
				}

				indicator.setAttribute(
					'progress',
					indicatorStatus[i].progressValue.toString()
				);
			}
			// TODO (maybe?) Wes' thought: Still trying to remember. Something to do with animation. Can't find the Potluck. Maybe `requestAnimationFrame` https://www.smashingmagazine.com/2022/06/precise-timing-web-animations-api/ ? That article may actually be about an alternative. Check out https://www.youtube.com/watch?v=cCOL7MC4Pl0 and https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/ by Jake Archibald
		}
	});

	// Pause and repeat until all timers complete
	!progressComplete.reduce((accumulator, current) =>
		current ? accumulator : current
	)
		? setTimeout(() => timer(), 500)
		: rounds-- && init();
}
