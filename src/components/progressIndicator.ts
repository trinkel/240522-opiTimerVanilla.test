import { stringifySeconds } from '../utilities/timeUtilities';

export default class ProgressIndicator extends HTMLElement {
	calculatedCircumference: number;
	constructor() {
		super();

		// NOTE:  Component attribute `mode`: 0 = countdown 1 = count up

		//! Note: this.* variables come from getters defined below.

		// Calculate the circle radius and the normalized version which is radius minus the stroke
		const radius = this.viewBox / 2;
		const normalizedRadius = radius - this.stroke;
		this.calculatedCircumference = normalizedRadius * 2 * Math.PI;

		//  Set the custom property viewbox value for our CSS to latch on to
		this.style.setProperty('--progress-indicator-viewbox', `${this.viewBox}px`);

		// Set the default aria role states
		this.setAttribute('aria-label', this.label);
		this.setAttribute('role', 'progressbar');
		//  Render the component with all the data ready
		this.innerHTML = `
			<div class="progress-indicator">
				<div class="progress-indicator__visual">
					<svg
						fill='none'
						viewBox="0 0 ${this.viewBox} ${this.viewBox}"
						focusable="false"
						class="progress-indicator__circle"
					>
						<circle
						r="${normalizedRadius}"
						cx="${radius}"
						cy="${radius}"
						stroke-width="${this.stroke}"
						class="progress-indicator__background-circle"
						data-whitefill-graystroke
						/>
						<circle
						transform="rotate(-90, ${radius}, ${radius})"
						r="${normalizedRadius}"
						cx="${radius}"
						cy="${radius}"
						stroke-dasharray="${this.calculatedCircumference} ${this.calculatedCircumference}"
						stroke-width="${this.stroke}"
						stroke-linecap="round"
						class="progress-indicator__progress-circle"
						data-progress-circle
						data-pinkfill-greenstroke
						/>
					</svg>
				<div class="progress-indicator__count-container">
					<div data-progress-count-el="" class="progress-indicator__count"></div>
					<sl-badge pill data-progress-warn-el class="progress-indicator__warning-badge"></sl-badge>
				</div>
				<svg
						class="progress-indicator__check"
						focusable="false"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="m8.335 12.643 7.66-7.66 1.179 1.178L8.334 15 3.032 9.697 4.21 8.518l4.125 4.125Z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<div data-progress-title>
					<h2>${this.title}</h2>
					<p data-progress-title-warn></p>
				</div>
			</div>
		`;
	}

	setProgress(progress: number) {
		// Always make sure the progress passed never exceeds the max
		if (progress > this.valueMax) {
			progress = this.valueMax;
		}

		// Always make sure the progress passed is never less than 0
		if (progress < 0) {
			progress = 0;
		}

		//  Set the aria role value for screen readers
		//! This works after timer starts, but needs and initial setting.
		this.setAttribute('aria-valuenow', progress.toString());

		const circle = this.querySelector('[data-progress-circle]') as HTMLElement;

		// Calculate a dash offset value based on the calculated circumference and the current percentage
		circle
			? (circle.style.strokeDashoffset = (
					this.calculatedCircumference -
					(progress / this.valueMax) * this.calculatedCircumference
			  ).toString())
			: null;

		//  Set a complete or pending state based on progress.
		////If complete, set warning to false (Now it will be 'end' set elsewhere)
		if (this.mode) {
			if (progress <= 0) {
				this.setAttribute('data-progress-state', 'complete');
				// this.setAttribute('data-progress-warn-state', 'false');
			} else {
				this.setAttribute('data-progress-state', 'pending');
			}
		} else {
			if (progress >= this.valueMax) {
				this.setAttribute('data-progress-state', 'complete');
				// this.setAttribute('data-progress-warn-state', 'false');
			} else {
				this.setAttribute('data-progress-state', 'pending');
			}
		}
	}

	setText(display: string) {
		const progressCount = this.querySelector('[data-progress-count-el]');
		// A human readable version for the text label
		progressCount
			? (progressCount.textContent = `${display}${this.unit}`)
			: null;
	}

	// Set by warning attributes -----------------
	setWarnState(display: string) {
		const progressWarnElement = this.querySelector('[data-progress-warn-el]');

		switch (display) {
			case 'false':
				if (progressWarnElement) {
					progressWarnElement.removeAttribute('pulse');
					progressWarnElement.textContent = ``;
				}
				progressWarnElement
					? progressWarnElement.removeAttribute('pulse')
					: null;
				progressWarnElement ? (progressWarnElement.textContent = ``) : null;

				break;

			case 'pending':
				progressWarnElement
					? progressWarnElement.setAttribute('pulse', '')
					: null;
				progressWarnElement ? (progressWarnElement.textContent = ``) : null;
				break;

			case 'true':
				progressWarnElement
					? progressWarnElement.removeAttribute('pulse')
					: null;
				if (this.label.search('music') >= 0) {
					progressWarnElement
						? (progressWarnElement.textContent = `Warn ${this.title.toLowerCase()}`)
						: null;
				} else if (this.label.search('ends') >= 0) {
					progressWarnElement
						? (progressWarnElement.textContent = `Warn end of session`)
						: null;
				}
				break;

			case 'ending':
				// affects end session timer only
				progressWarnElement
					? progressWarnElement.removeAttribute('pulse')
					: null;
				if (this.label.search('ends') >= 0) {
					progressWarnElement
						? (progressWarnElement.textContent = `Session ending Leave the ice`)
						: null;
				}
				break;

			case 'end':
				if (progressWarnElement) {
					if (this.label.search('music') >= 0) {
						progressWarnElement.textContent = 'Play music';
					}
				}
				// style changes only
				break;
		}
	}

	setWarn(display: string) {
		const progressTitleWarn = this.querySelector('[data-progress-title-warn]');

		progressTitleWarn
			? (progressTitleWarn.textContent = `${stringifySeconds(
					Number(display),
					false
			  )} warning`)
			: null;
	}

	// setWarnLabel(display: string) {
	// 	const progressWarnLabel = this.querySelector('[data-progress-warn-label]');
	// 	const warnTime = stringifySeconds(
	// 		Number(this.getAttribute('data-progress-warn')),
	// 		false
	// 	);
	// 	progressWarnLabel ? (progressWarnLabel.textContent = `${warnTime}`) : null;
	// }

	static get observedAttributes() {
		return [
			'progress',
			'data-progress-count',
			'value-max',
			'data-progress-warn',
			'data-progress-warn-state',
		];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'progress') {
			this.setProgress(Number(newValue));
		}
		if (name === 'data-progress-count') {
			this.setText(newValue);
		}

		if (name === 'value-max') {
			this.setAttribute('aria-valuemax', this.valueMax.toString());
		}

		if (name === 'data-progress-warn') {
			this.setWarn(newValue);
		}

		if (name === 'data-progress-warn-state') {
			this.setWarnState(newValue);
		}
	}

	get id(): string {
		return this.getAttribute('id') || 'unknown[234]';
	}

	get valueMax(): number {
		return Number(this.getAttribute('value-max')) || 60;
	}

	get unit(): string {
		return this.getAttribute('unit') || '';
	}

	get mode(): number {
		return Number(this.getAttribute('mode')) || 0; // 1 = Countdown | 0 = Count up
	}

	get viewBox(): number {
		return Number(this.getAttribute('viewbox')) || 100;
	}

	get stroke(): number {
		return Number(this.getAttribute('stroke')) || 5;
	}

	get label(): string {
		return this.getAttribute('label') || 'Current progress';
	}

	get title(): string {
		return this.getAttribute('title') || '';
	}
}

customElements.define('progress-indicator', ProgressIndicator);
//! End of custom element definition
