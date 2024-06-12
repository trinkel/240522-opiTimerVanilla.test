import ProgressIndicator from '../components/progressIndicator';
import TeamSession from './team';
// sample data: remove or add a demo switch
import { parameters } from '../components/setup';
import { teams } from '../data/sampleData';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

interface Indicators {
	id: string; // element ID
	element: Element; // progressIndicator custom element
	modeValue: number; // Count up or down //! Don't need it but leave it in for posterity or 'just in case'
	maxValue: number; // Maximum value
	progressValueInit: number; // Initialization value
	progressValue: number; // Current value
	progressComplete: boolean;
}
[];

// Create array of indicators (timers): Get the indicator elements and establish variables for their values. This only has to happen once. (this is not the init)
// Then inside of loop with class:
// Initialize
// Run timers
const indicators: Indicators[] = [];
const indicatorIds = ['firstMusicTimer', 'secondMusicTimer', 'endSessionTimer'];
indicatorIds.forEach((id) => {
	const indicatorElement = document.querySelector(`${id}`);
	if (indicatorElement) {
		indicators.push({
			id: '',
			element: indicatorElement,
			modeValue: 1, // Count up or down
			// Zero out properties to initialize then initialize in class)
			maxValue: 0, // Maximum value
			progressValueInit: 0, // Initialization value
			progressValue: 0, // Placeholder - reinitialize in first init
			progressComplete: false,
		});
	}
});

const numStarts = teams.length > 0 ? teams.length : parameters.numStarts;

const sessionStatus = document.querySelector('[data-session-status]'); // Temporary status label at bottom of page

teams.forEach((team) => {
	//Todo: Really need to make the names associated with this class more alike
	const session = new TeamSession(teams);

	// Timers go here

	/*

end of loop of classes
 */
});

// here: Working out of main-old.ts. Convert vars to new indicator object. Then do timer() function Maybe move to file once it's figured out.
function init(): void {
	if (numStarts <= 0) {
		sessionStatus ? (sessionStatus.textContent = 'Group completed') : null;
		return;
	}
	indicators.forEach((indicator) => {
		indicator.progressComplete = false; // Indicates progress complete (starts as false)
		indicator.maxValue = // Here: How do we access values in the class?
		indicator.progressValueInit = indicator.modeValue ? indicator.maxValue : 0;
		indicator.progressValue = indicator.progressValueInit;
		indicator.element.setAttribute(
			'progress',
			indicator.progressValue.toString()
		);
		indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?
	});
}

function timer(): void {
	sessionStatus ? (sessionStatus.textContent = numStarts.toString()) : null; //! Display group number. Do we want it?
	indicators.forEach((indicator) => {
		if (indicator.modeValue) {
			if (indicator.progressValue > 0) {
				indicator.progressValue -= 1; //todo: Figure out what this needs to be for percent, seconds or whatever we're using
				if (indicator.progressValue <= 0) {
					indicator.progressValue = 0;
					indicator.progressComplete = true;
				}

				indicator.element.setAttribute(
					'progress',
					indicator.progressValue.toString()
				);
			}
		} else {
			if (indicator.progressValue < Number(indicator.maxValue))
		}
	});
}
