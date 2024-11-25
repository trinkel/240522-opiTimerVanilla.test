import { SlButton } from '@shoelace-style/shoelace';

export class ControlButtons {
	constructor() {
		// attach buttons
		const controlBlock =
			document.querySelector<HTMLDivElement>('#control_block');

		const previousTeam = document.querySelector<SlButton>('#previous-team');

		const currentSkipBegin = document.querySelector<SlButton>(
			'#current-skip-begin'
		);

		const currentStart = document.querySelector<SlButton>('#current-start');

		const currentSkipEnd =
			document.querySelector<SlButton>('#current-skip-end');

		const nextTeam = document.querySelector<SlButton>('#next-team');

		if (controlBlock) {
			controlBlock.addEventListener('click', (event: Event) => {
				this.handleControlBlockClick(event);
			});
		}
	} // end constructor

	handleControlBlockClick(event: Event) {
		const targetId = (event.target as HTMLElement).getAttribute('id');
		switch (targetId) {
			case 'previous-team':
				console.log(`target: ${targetId}`);
				break;

			case 'current-skip-begin':
				console.log(`target: ${targetId}`);
				break;

			case 'current-start':
				console.log(`target: ${targetId}`);
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
