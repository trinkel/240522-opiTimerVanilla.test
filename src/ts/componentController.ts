export interface Indicators {
	id: string; // element ID
	element: Element; // progressIndicator custom element
	timeProperty: string; // name of property with time for element (eg firstWarnTime)
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

export class ComponentController {
	indicators: Indicators[] = [];
	sessionStatus = document.querySelector('[data-session-status'); // Temporary status label at bottom of page
	constructor(public numStarts: number) {
		// also declares the variable (see https://www.digitalocean.com/community/tutorials/how-to-use-classes-in-typescript#adding-class-properties)
		const indicatorIds = ['first-music', 'second-music', 'end-session'];
		indicatorIds.forEach((id) => {
			const dashIdx = id.indexOf('-');
			const indicatorElement = document.querySelector(`${id}`);
			if (indicatorElement) {
				this.indicators.push({
					id: id,
					element: indicatorElement,
					timeProperty: `${id.substring(0, dashIdx)}${id
						.charAt(dashIdx + 1)
						.toUpperCase()}${id.substring(dashIdx + 2)}`, // used to access times from class such as firstMusicTime
					modeValue: 1, // Count up or down
					// Zero out properties to initialize then initialize in class)
					maxValue: 0, // Maximum value
					progressValueInit: 0, // Initialization value
					progressValue: 0, // Placeholder - reinitialize in first init
					progressComplete: false,
				});
			}
		});
	}

	init(): void {
		if (this.numStarts <= 0) {
			this.sessionStatus
				? (this.sessionStatus.textContent = 'Group completed')
				: null;
			return;
		}
		this.indicators.forEach((indicator) => {
			indicator.progressComplete = false; // Indicates progress complete (starts as false)
			// HereHere: How do we access values in the class? This will use the timeProperty as the name of the property holding the max time for the timer.
			indicator.maxValue = indicator.progressValueInit = indicator.modeValue
				? indicator.maxValue
				: 0;
			indicator.progressValue = indicator.progressValueInit;
			indicator.element.setAttribute(
				'progress',
				indicator.progressValue.toString()
			);
			indicator.element.setAttribute('data-progress-state', 'pending'); //! Sets timer status. Do we need it?
		});
	}

	timer(): void {
		this.sessionStatus
			? (this.sessionStatus.textContent = this.numStarts.toString())
			: null; //! Display group number. Do we want it?
		this.indicators.forEach((indicator) => {
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
				if (indicator.progressValue < Number(indicator.maxValue)) {
					indicator.progressValue += 1;
					if (indicator.progressValue >= Number(indicator.maxValue)) {
						indicator.progressValue = Number(indicator.maxValue);
						indicator.progressComplete = true;
					}

					indicator.element.setAttribute(
						'progress',
						indicator.progressValue.toString()
					);
				}
			}
		});

		//! Timeout and progress complete were here. Where do they go now? ----- Loop should be handled in `main.ts`?
			// Pause and repeat until all timers complete

	// HERE Work in progress 240720
	// HERE Call init and timer in loop from main. Restart timer in `timer()` function below (needs to be finished)
	// HERE Also need to commit:
	// HERE - Remove comments from main
	// HERE - Loop to start init and timer
	// HERE - Time starter in `timer()` in `controllerComponent`
			!progressComplete.reduce((accumulator, current) =>
		current ? accumulator : current
	)
		? setTimeout(() => timer(), 500)
		: rounds-- && init();
}

	}
}
