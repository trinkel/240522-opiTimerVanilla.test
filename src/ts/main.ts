import ProgressIndicator from '../components/progressIndicator';
import TeamSession from './team';
// sample data: remove or add a demo switch
import { teams } from '../data/sampleData';

// Passthrough component module
export * from '../components/progressIndicator';
export default ProgressIndicator;

interface Indicators {
	id: string; // element ID
	element: Element; // progressIndicator custom element
	modeValue: number; // Count up or down
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

teams.forEach((team) => {
	//Todo: Really need to make the names associated with this class more alike
	const session = new TeamSession(teams);

	// Timers go here

	const sessionStatus = document.querySelector('[data-session-status]'); // Temporary status label at bottom of page

	/*

end of loop of classes
 */
});
