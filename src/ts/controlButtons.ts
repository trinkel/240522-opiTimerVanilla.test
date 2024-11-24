import { SlButton } from '@shoelace-style/shoelace';

export class ControlButtons {
	constructor() {
		// attach buttons
		const controlBlock = document.querySelector<HTMLDivElement>('#team_block');

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
		switch ((event.target as HTMLElement).getAttribute('id')) {
			case 'previous-team':
				console.log(`target: previousTeam`);
				break;

			case 'current-skip-begin':
				console.log(`target: currentSkipBegin`);
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
