import { SlButton, SlIcon } from '@shoelace-style/shoelace';
import { Parameters } from '../components/parameters';
import { elementError } from '../utilities/elementError';

export class ControlButtons {
	// attach buttons
	controlBlock = document.querySelector<HTMLDivElement>('#control_block');

	previousTeam = document.querySelector<SlButton>('#previous-team');

	currentSkipBegin = document.querySelector<SlButton>('#current-skip-begin');

	currentStart = document.querySelector<SlButton>('#current-start');
	currentStartIcon = document.querySelector<SlIcon>('#current-start > sl-icon');

	currentSkipEnd = document.querySelector<SlButton>('#current-skip-end');

	nextTeam = document.querySelector<SlButton>('#next-team');

	// Constructor
	constructor(parameters: Parameters) {
		if (this.controlBlock) {
			this.controlBlock.addEventListener('click', (event: Event) => {
				this.handleControlBlockClick(event, parameters);
			});
		}
	} // end constructor

	/*
	 * Handle click events in controlButtons
	 *   if any element gets more than one action,
	 *   consider using `setAttribute and
	 *   `static get observedAttributes()` to batch them
	 */
	handleControlBlockClick(event: Event, parameters: Parameters) {
		const targetId = (event.target as HTMLElement).getAttribute('id');
		switch (targetId) {
			case 'previous-team':
				console.log(`target: ${targetId}`);
				break;

			case 'current-skip-begin':
				console.log(`target: ${targetId}`);
				break;

			case 'current-start':
				if (
					(event.target as HTMLElement).getAttribute('data-state') === 'paused'
				) {
					this.currentStartIcon
						? this.currentStartIcon.setAttribute('name', 'pause-fill')
						: elementError('currentStartIcon', 'controlButtons: currentStart');
					if (this.currentStart) {
						this.currentStart.setAttribute('aria-label', 'Pause session');
						this.currentStart.setAttribute('data-state', 'running');
					} else {
						elementError('currentStart', 'change data-state and aria-label');
					}
					parameters.toggleCurrent();
				} else {
				}

				//! start button
				// set parameters.groupStartType to manual
				// set parameters.groupStartTime = now
				// set parameters.scheduleSet
				// set parameters.idle false
				// change to stop button
				//! pause button
				// No stop, just pause? Stop would be "next team"?
				// set idle true
				break;

			case 'current-skip-end':
				console.log(`target: ${targetId}`);
				break;

			case 'next-team':
				console.log(`target: ${targetId}`);
				break;

			default:
				return;
		}

		// const et = event.target as HTMLElement;
		// console.dir(et);
		// if (et) {
		// 	et.getAttribute('id') == 'previous-team'
		// 		? console.log(`Previous Team`)
		// 		: console.log(event.target);
		// } else {
		// 	null;
		// }
	}
}

// !DELETE
// export function tellParam(parameters: Parameters) {
// 	console.log(`[controlButton] ${parameters.groupStartTime}`);
// 	const startTime = new Date();
// 	parameters.groupStartTime = startTime;
// 	console.log(`[controlButton] ${parameters.groupStartTime}`);
// }
