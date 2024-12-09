import { SlButton, SlIcon } from '@shoelace-style/shoelace';
import { elementError } from '../utilities/elementError';

// Define valid button ids (#id)
export type ButtonId =
	| 'control_block'
	| 'previous-team'
	| 'current-skip-begin'
	| 'current-start'
	| 'current-start-icon'
	| 'current-skip-end'
	| 'next-team';

// Define valid button TS objects (const id: {})
export type ButtonKey =
	| 'controlBlock'
	| 'previousTeam'
	| 'currentSkipBegin'
	| 'currentStart'
	| 'currentStartIcon'
	| 'currentSkipEnd'
	| 'nextTeam';

// Define a mapping of ButtonKey to valid states
export type ButtonStateMap = {
	controlBlock: '';
	previousTeam: 'true' | 'false';
	currentSkipBegin: 'true' | 'false';
	currentStart: 'paused' | 'running';
	currentStartIcon: '';
	currentSkipEnd: 'true' | 'false';
	nextTeam: 'true' | 'false';
};

// Define the interface using the mapping with generics to define the state property
export interface ControlBlockButton<T extends ButtonKey> {
	element: HTMLDivElement | SlButton | SlIcon | null;
	id: ButtonId;
	state: ButtonStateMap[T];
}

// Define the interface for clicked button which is passed to parameters when button is clicked
export interface ClickedButton<T extends ButtonKey> {
	target: ButtonId;
	state: ButtonStateMap[T];
}

//
// using the interface with state map type generics
/**
 * controlBlockButtons control manual start and stop for the session
 * Define the controlBlockButtons object
 * using the interface with state map type generics
 *
 * @type {{ [K in ButtonKey]: ControlBlockButton<K> }}
 * typeDef: object key is typed as member of ButtonKey (and list assigned to var K);
 *          object is typed by interface ControlBlockButton<>;
 *          K is passed as argument which is picked up at T in interface;
 *          state is typed as member T (aka K) of ButtonStateMap object;
 */
export const controlBlockButtons: { [K in ButtonKey]: ControlBlockButton<K> } =
	{
		controlBlock: {
			element: document.querySelector<HTMLDivElement>('#control_block'),
			id: 'control_block',
			state: '',
		},
		previousTeam: {
			element: document.querySelector<SlButton>('#previous-team'),
			id: 'previous-team',
			state: 'true',
		},
		currentSkipBegin: {
			element: document.querySelector<SlButton>('#current-skip-begin'),
			id: 'current-skip-begin',
			state: 'false',
		},
		currentStart: {
			element: document.querySelector<SlButton>('#current-start'),
			id: 'current-start',
			state: 'paused',
		},
		currentStartIcon: {
			element: document.querySelector<SlIcon>('#current-start > sl-icon'),
			id: 'current-start-icon',
			state: '',
		},
		currentSkipEnd: {
			element: document.querySelector<SlButton>('#current-skip-end'),
			id: 'current-skip-end',
			state: 'true',
		},
		nextTeam: {
			element: document.querySelector<SlButton>('#next-team'),
			id: 'next-team',
			state: 'false',
		},
	};

export function addEventListeners(
	controlBlock: ControlBlockButton<ButtonKey>['element']
) {
	/*
	 * Add eventListener
	 */
	if (controlBlock) {
		controlBlock.addEventListener('click', (event: Event) => {
			handleControlBlockClick(event);
		});
	}
}

/*
 * Handle click events in controlButtons
 *   if any element gets more than one action,
 *   consider using `setAttribute and
 *   `static get observedAttributes()` to batch them
 */
export function handleControlBlockClick<T extends ButtonKey>(
	event: Event
): ClickedButton<T> {
	const targetId = (event.target as HTMLElement).getAttribute('id') as ButtonId;
	let clickedButton: ClickedButton<T> = {
		target: targetId, //! changed by pieces from empty. Was assigned in case statement. This makes sense at the time but watch out as the other cases are built out (note: `target: targetId` removed from clickedButton object in case 'current-start' as part of this. Original code should be in #244e24335442322ea186e394f32b782169fbc9eb)
		state: '' as ButtonStateMap[T],
	};
	switch (targetId) {
		case 'previous-team':
			console.log(`target: ${targetId}`);
			//--- Added by pieces where nothing else was found
			clickedButton.state = controlBlockButtons.previousTeam
				.state as ButtonStateMap[T];
			//---
			break;

		case 'current-skip-begin':
			console.log(`target: ${targetId}`);
			//--- Added by pieces where nothing else was found
			clickedButton.state = controlBlockButtons.currentSkipBegin
				.state as ButtonStateMap[T];
			//---
			break;

		case 'current-start':
			if (
				(event.target as HTMLElement).getAttribute('data-state') === 'paused'
			) {
				controlBlockButtons.currentStartIcon.element
					? controlBlockButtons.currentStartIcon.element.setAttribute(
							'name',
							'pause-fill'
					  )
					: elementError('currentStartIcon', 'controlButtons: currentStart');
				// Paused to running
				if (controlBlockButtons.currentStart.element) {
					controlBlockButtons.currentStart.element.setAttribute(
						'aria-label',
						'Pause session'
					);
					controlBlockButtons.currentStart.element.setAttribute(
						'data-state',
						'running'
					);
				} else {
					elementError('currentStart', 'change data-state and aria-label');
				}
				clickedButton.state = 'paused' as ButtonStateMap[T];
				return clickedButton;
				// parameters.toggleCurrent();
			} else {
				// Running to paused
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
			//--- Added by pieces where nothing else was found
			clickedButton.state = controlBlockButtons.currentSkipEnd
				.state as ButtonStateMap[T];
			//---
			break;

		case 'next-team':
			console.log(`target: ${targetId}`);
			//--- Added by pieces where nothing else was found
			clickedButton.state = controlBlockButtons.nextTeam
				.state as ButtonStateMap[T];
			//---
			break;

		default:
	}
	return clickedButton;

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

// !DELETE
// export function tellParam(parameters: Parameters) {
// 	console.log(`[controlButton] ${parameters.groupStartTime}`);
// 	const startTime = new Date();
// 	parameters.groupStartTime = startTime;
// 	console.log(`[controlButton] ${parameters.groupStartTime}`);
// }
